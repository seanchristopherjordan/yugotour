/**
 * Dry-run em-dash rewrite tool.
 *
 * Reads every published post directly from Neon (no Payload init, no migrations),
 * finds paragraphs that contain em-dashes (—), and asks Claude to remove 60–70%
 * of them by rewriting with proper flowing language.
 *
 * In dry-run mode (the default) nothing is saved — it just prints before → after.
 *
 * Run:
 *   pnpm tsx scripts/rewrite-emdashes.ts          # dry run (read-only)
 *   pnpm tsx scripts/rewrite-emdashes.ts --live   # apply changes via SQL
 *
 * Requires ANTHROPIC_API_KEY and DATABASE_URL in your environment.
 */

import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'
import pg from 'pg'

const { Pool } = pg
const DRY_RUN = !process.argv.includes('--live')

// ── Lexical JSON helpers ─────────────────────────────────────────────────────

type LexNode = {
  type: string
  text?: string
  format?: number
  children?: LexNode[]
  [key: string]: unknown
}

function extractParagraphText(para: LexNode): string {
  return (para.children ?? [])
    .map((n) => (n.type === 'text' ? (n.text ?? '') : ''))
    .join('')
}

function paragraphHasEmdash(para: LexNode): boolean {
  return extractParagraphText(para).includes('—')
}

function countEmdashes(text: string): number {
  return (text.match(/—/g) ?? []).length
}

function replaceParagraphText(para: LexNode, newText: string): LexNode {
  return {
    ...para,
    children: [{ type: 'text', text: newText, format: 0, version: 1 }],
  }
}

function walkAndCollect(root: LexNode): { path: number[]; text: string }[] {
  const results: { path: number[]; text: string }[] = []

  function walk(node: LexNode, path: number[]) {
    if (node.type === 'paragraph' && paragraphHasEmdash(node)) {
      results.push({ path, text: extractParagraphText(node) })
    }
    ;(node.children ?? []).forEach((child, i) => walk(child, [...path, i]))
  }

  walk(root, [])
  return results
}

function applyRewrites(root: LexNode, rewrites: Map<string, string>): LexNode {
  function walk(node: LexNode, path: number[]): LexNode {
    if (node.type === 'paragraph' && paragraphHasEmdash(node)) {
      const newText = rewrites.get(path.join(','))
      if (newText !== undefined) return replaceParagraphText(node, newText)
    }
    if (!node.children) return node
    return {
      ...node,
      children: node.children.map((child, i) => walk(child, [...path, i])),
    }
  }
  return walk(root, [])
}

// ── Claude rewrite ────────────────────────────────────────────────────────────

async function rewriteParagraph(client: Anthropic, text: string): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          'You are editing travel writing. The paragraph below overuses em-dashes (—).',
          'Remove 60–70% of them by replacing with better alternatives:',
          '  • commas, colons, semicolons, or parentheses where appropriate',
          '  • restructure the sentence where the em-dash is used for an aside',
          '  • conjunctions (and, but, because, which) where logical',
          'Do NOT remove em-dashes that are truly the best punctuation for that spot.',
          'Keep the tone, voice, and all factual content exactly the same.',
          'Return ONLY the rewritten paragraph — no preamble, no explanation.',
          '',
          'Paragraph:',
          text,
        ].join('\n'),
      },
    ],
  })
  return (msg.content[0] as { type: string; text: string }).text.trim()
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set.')
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set.')
    process.exit(1)
  }

  console.log(DRY_RUN ? '\n── DRY RUN (nothing will be saved) ──\n' : '\n── LIVE MODE ──\n')

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Read posts directly — no Payload init, no migration runner
  const { rows } = await pool.query<{
    id: number
    title: string
    slug: string
    content: unknown
  }>(`
    SELECT id, title, slug, content
    FROM posts
    WHERE _status = 'published'
      AND content IS NOT NULL
      AND content::text LIKE '%—%'
    ORDER BY published_at DESC
  `)

  console.log(`${rows.length} published post(s) contain em-dashes\n`)

  let totalBefore = 0
  let totalAfter = 0
  let postsChanged = 0

  for (const post of rows) {
    const root = (post.content as { root?: LexNode } | null)?.root
    if (!root) continue

    const paragraphs = walkAndCollect(root)
    if (paragraphs.length === 0) continue

    console.log(`\n${'─'.repeat(72)}`)
    console.log(`POST: "${post.title}" (id ${post.id})`)
    console.log(`  ${paragraphs.length} paragraph(s) with em-dashes`)

    const rewrites = new Map<string, string>()

    for (const { path, text } of paragraphs) {
      const before = countEmdashes(text)
      totalBefore += before

      let rewritten: string
      try {
        rewritten = await rewriteParagraph(client, text)
      } catch (err) {
        console.error(`  ERROR rewriting paragraph:`, err)
        continue
      }

      const after = countEmdashes(rewritten)
      totalAfter += after

      console.log(`\n  BEFORE (${before} em-dash${before !== 1 ? 'es' : ''}):`)
      console.log(`    ${text}`)
      console.log(`  AFTER  (${after} em-dash${after !== 1 ? 'es' : ''}, −${before - after}):`)
      console.log(`    ${rewritten}`)

      rewrites.set(path.join(','), rewritten)

      await new Promise((r) => setTimeout(r, 400))
    }

    if (!DRY_RUN && rewrites.size > 0) {
      const newRoot = applyRewrites(root, rewrites)
      const newContent = { ...(post.content as object), root: newRoot }
      await pool.query('UPDATE posts SET content = $1::jsonb WHERE id = $2', [
        JSON.stringify(newContent),
        post.id,
      ])
      console.log(`  ✓ saved`)
      postsChanged++
    }
  }

  const removed = totalBefore - totalAfter
  const pct = totalBefore > 0 ? Math.round((removed / totalBefore) * 100) : 0

  console.log(`\n${'═'.repeat(72)}`)
  console.log(`Summary`)
  console.log(`  Em-dashes before : ${totalBefore}`)
  console.log(`  Em-dashes after  : ${totalAfter}`)
  console.log(`  Removed          : ${removed} (${pct}%)`)
  if (!DRY_RUN) console.log(`  Posts updated    : ${postsChanged}`)
  if (DRY_RUN) console.log(`\nRe-run with --live to apply these changes.`)

  await pool.end()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
