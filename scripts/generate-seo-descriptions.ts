/**
 * One-time migration: generate SEO meta descriptions via Claude Haiku.
 * Covers Posts, Tours, TourListPages, and Pages.
 *
 * Run with: pnpm tsx scripts/generate-seo-descriptions.ts
 * Requires ANTHROPIC_API_KEY in your .env file.
 *
 * Uses raw SQL for updates to bypass Next.js revalidatePath hooks.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import Anthropic from '@anthropic-ai/sdk'
import pg from 'pg'

const { Pool } = pg

type Doc = Record<string, unknown>

function lexicalToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as Doc
  if (typeof n.text === 'string') return n.text
  const children = Array.isArray(n.children)
    ? n.children
    : Array.isArray((n.root as Doc)?.children)
      ? ((n.root as Doc).children as unknown[])
      : null
  if (children) return children.map(lexicalToText).join(' ').replace(/\s+/g, ' ').trim()
  return ''
}

function hasMeta(doc: unknown): boolean {
  const desc = (doc as { meta?: { description?: string | null } })?.meta?.description
  return Boolean(desc && desc.trim())
}

async function generate(client: Anthropic, title: string, excerpt: string): Promise<string | null> {
  if (!excerpt.trim()) return null
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 80,
    messages: [
      {
        role: 'user',
        content: [
          'Write a compelling SEO meta description between 140–155 characters.',
          'Tone: professional, evocative, travel-focused.',
          'Return ONLY the description — no quotes, no label, no explanation.',
          '',
          `Title: ${title}`,
          '',
          `Content excerpt:\n${excerpt}`,
        ].join('\n'),
      },
    ],
  })
  const raw = (message.content[0] as { type: string; text: string }).text.trim()
  return raw.length <= 160 ? raw : raw.slice(0, 159).replace(/\s\S*$/, '') + '…'
}

async function processCollection(
  payload: Awaited<ReturnType<typeof getPayload>>,
  client: Anthropic,
  pool: InstanceType<typeof Pool>,
  collection: 'posts' | 'tours' | 'tour-list-pages' | 'pages',
  table: string,
  getExcerpt: (doc: Doc) => string,
) {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0 })
  const targets = docs.filter((d) => !hasMeta(d))

  console.log(`\n[${collection}] ${docs.length} total — ${targets.length} missing descriptions`)

  for (const doc of targets) {
    const d = doc as unknown as Doc
    const title = typeof d.title === 'string' ? d.title : String(doc.id)
    const excerpt = getExcerpt(d).replace(/\s+/g, ' ').trim().slice(0, 1200)

    if (!excerpt) {
      console.log(`  SKIP  "${title}" — no extractable content`)
      continue
    }

    let description: string | null = null
    try {
      description = await generate(client, title, excerpt)
    } catch (err) {
      console.error(`  ERROR  "${title}":`, err)
      continue
    }

    if (!description) continue

    // Write directly to the DB to bypass Next.js revalidatePath hooks
    await pool.query(`UPDATE "${table}" SET meta_description = $1 WHERE id = $2`, [
      description,
      doc.id,
    ])

    console.log(`  OK    "${title}"\n         → ${description}`)
    await new Promise((r) => setTimeout(r, 300))
  }
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set in your environment.')
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in your environment.')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const client = new Anthropic({ apiKey })
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

  await processCollection(payload, client, pool, 'posts', 'posts', (d) =>
    lexicalToText(d.content),
  )

  await processCollection(
    payload,
    client,
    pool,
    'tours',
    'tours',
    (d) => (typeof d.lede === 'string' ? d.lede : ''),
  )

  await processCollection(payload, client, pool, 'tour-list-pages', 'tour_list_pages', (d) => {
    const black = typeof d.introHeaderBlack === 'string' ? d.introHeaderBlack : ''
    const red = typeof d.introHeaderRed === 'string' ? d.introHeaderRed : ''
    const body = lexicalToText(d.introBodyText)
    return [black, red, body].filter(Boolean).join(' ')
  })

  await processCollection(payload, client, pool, 'pages', 'pages', (d) => {
    if (Array.isArray(d.layout)) {
      for (const block of d.layout as Doc[]) {
        if (block.blockType === 'content' && block.richText) return lexicalToText(block.richText)
        if (block.blockType === 'textContainer' && block.content)
          return lexicalToText(block.content)
      }
    }
    return ''
  })

  await pool.end()
  console.log('\nDone.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
