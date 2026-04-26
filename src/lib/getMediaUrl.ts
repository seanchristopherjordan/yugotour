import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { UTApi } from 'uploadthing/server'
import { unstable_cache } from 'next/cache'

/**
 * Fetches the full Uploadthing file list and resolves all URLs in two batch
 * API calls, returning a { filename → url } map.  Cached under the 'media'
 * tag so it's revalidated whenever Payload media changes.
 */
const getUTUrlMap = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const utapi = new UTApi()
    const { files } = await utapi.listFiles({ limit: 2000 })
    if (!files.length) return {}

    const { data: urlData } = await utapi.getFileUrls(files.map((f) => f.key))
    const keyToUrl: Record<string, string> = {}
    for (const d of urlData) keyToUrl[d.key] = d.url

    return Object.fromEntries(files.map((f) => [f.name, keyToUrl[f.key] ?? '']))
  },
  ['ut-url-map'],
  { tags: ['media'] },
)

async function fetchMediaUrl(filename: string): Promise<string | null> {
  // 1. Check Payload Media collection first (files uploaded via Payload admin)
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  const doc = result.docs[0] as { url?: string | null } | undefined
  if (doc?.url) return doc.url

  // 2. Fall back to Uploadthing direct-upload file list
  const urlMap = await getUTUrlMap()
  return urlMap[filename] ?? null
}

export function getMediaUrl(filename: string): Promise<string | null> {
  return unstable_cache(
    () => fetchMediaUrl(filename),
    [`media-url-${filename}`],
    { tags: ['media'] },
  )()
}
