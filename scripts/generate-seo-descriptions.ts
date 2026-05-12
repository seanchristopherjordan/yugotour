/**
 * One-time migration: generate SEO meta descriptions for Posts using Claude Haiku.
 * Run with: pnpm tsx scripts/generate-seo-descriptions.ts
 * Requires ANTHROPIC_API_KEY in your .env file.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import Anthropic from '@anthropic-ai/sdk'

function lexicalToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as Record<string, unknown>
  if (typeof n.text === 'string') return n.text
  const children = Array.isArray(n.children)
    ? n.children
    : Array.isArray((n.root as Record<string, unknown>)?.children)
      ? ((n.root as Record<string, unknown>).children as unknown[])
      : null
  if (children) return children.map(lexicalToText).join(' ').replace(/\s+/g, ' ').trim()
  return ''
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set in your environment.')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const client = new Anthropic({ apiKey })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 500,
    depth: 0,
  })

  const targets = posts.filter((post) => {
    const desc = (post as unknown as { meta?: { description?: string | null } })?.meta?.description
    return !desc || desc.trim() === ''
  })

  console.log(`${posts.length} total posts — ${targets.length} missing meta descriptions.`)

  if (targets.length === 0) {
    console.log('Nothing to do.')
    process.exit(0)
  }

  for (const post of targets) {
    const rawText = lexicalToText((post as unknown as Record<string, unknown>).content)
    const excerpt = rawText.replace(/\s+/g, ' ').trim().slice(0, 1200)

    if (!excerpt) {
      console.log(`  SKIP  "${post.title}" — no extractable content`)
      continue
    }

    let description = ''
    try {
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
              `Title: ${post.title}`,
              '',
              `Content excerpt:\n${excerpt}`,
            ].join('\n'),
          },
        ],
      })

      const raw = (message.content[0] as { type: string; text: string }).text.trim()
      // Truncate to 160 chars at word boundary as a safety net
      description = raw.length <= 160 ? raw : raw.slice(0, 159).replace(/\s\S*$/, '') + '…'
    } catch (err) {
      console.error(`  ERROR  "${post.title}":`, err)
      continue
    }

    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { meta: { description } } as never,
    })

    console.log(`  OK    "${post.title}"\n         → ${description}`)

    // 300ms pause to stay well within rate limits
    await new Promise((r) => setTimeout(r, 300))
  }

  console.log('\nDone.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
