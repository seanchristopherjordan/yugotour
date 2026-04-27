/**
 * Migrates media collection URLs from local /api/media/file/ paths to Cloudflare R2.
 *
 * Dry run (default — safe, no writes):
 *   npx tsx src/scripts/migrate-media-urls.ts
 *
 * Execute (writes to DB):
 *   npx tsx src/scripts/migrate-media-urls.ts --execute
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../../src/payload.config'

const LOCAL_PREFIX = '/api/media/file/'
const CDN_BASE = 'https://media.yugotour-assets.workers.dev/'

const SIZE_NAMES = ['thumbnail', 'square', 'small', 'medium', 'large', 'xlarge', 'og'] as const

const isDryRun = !process.argv.includes('--execute')

function rewriteUrl(url: string | null | undefined): string | null {
  if (!url || !url.startsWith(LOCAL_PREFIX)) return null
  return CDN_BASE + url.slice(LOCAL_PREFIX.length)
}

async function run() {
  const payload = await getPayload({ config: configPromise })

  const all = await payload.find({
    collection: 'media',
    limit: 0, // 0 = fetch all
    depth: 0,
  })

  const docs = all.docs as Array<{
    id: number | string
    filename?: string | null
    url?: string | null
    sizes?: Record<string, { url?: string | null; filename?: string | null } | null>
  }>

  const toMigrate = docs.filter((d) => d.url?.startsWith(LOCAL_PREFIX))

  console.log(`\n${isDryRun ? '--- DRY RUN (no writes) ---' : '--- EXECUTING MIGRATION ---'}\n`)
  console.log(`Total records to migrate: ${toMigrate.length} / ${docs.length}\n`)

  if (toMigrate.length === 0) {
    console.log('Nothing to migrate.')
    process.exit(0)
  }

  console.log('First 5 records that will be updated:')
  console.log('─'.repeat(80))
  toMigrate.slice(0, 5).forEach((doc, i) => {
    const newUrl = rewriteUrl(doc.url)
    console.log(`${i + 1}. ${doc.filename} (id=${doc.id})`)
    console.log(`   url:  ${doc.url}`)
    console.log(`   →     ${newUrl}`)
    for (const size of SIZE_NAMES) {
      const sizeUrl = doc.sizes?.[size]?.url
      if (sizeUrl?.startsWith(LOCAL_PREFIX)) {
        console.log(`   ${size}: ${sizeUrl}`)
        console.log(`   →     ${rewriteUrl(sizeUrl)}`)
      }
    }
    console.log()
  })

  if (isDryRun) {
    console.log('Dry run complete. Run with --execute to apply changes.')
    process.exit(0)
  }

  console.log('Migrating...\n')
  let count = 0

  for (const doc of toMigrate) {
    const newUrl = rewriteUrl(doc.url)
    if (!newUrl) continue

    const sizesUpdate: Record<string, { url: string }> = {}
    for (const size of SIZE_NAMES) {
      const sizeUrl = doc.sizes?.[size]?.url
      const newSizeUrl = rewriteUrl(sizeUrl)
      if (newSizeUrl) sizesUpdate[size] = { url: newSizeUrl }
    }

    await payload.update({
      collection: 'media',
      id: doc.id,
      data: {
        url: newUrl,
        ...(Object.keys(sizesUpdate).length > 0 ? { sizes: sizesUpdate } : {}),
      } as Record<string, unknown>,
      depth: 0,
      context: { disableRevalidate: true },
    })

    count++
    process.stdout.write(`\rMigrated: ${count} / ${toMigrate.length}`)
  }

  console.log(`\n\nDone. ${count} records updated.`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
