import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import type { Media } from '@/payload-types'

// Initialized outside the cache boundary — safe for Next.js 16 production
const payloadPromise = getPayload({ config: configPromise })

export const getMediaUrl = unstable_cache(
  async (filename: string): Promise<string | null> => {
    const payload = await payloadPromise
    const result = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })
    const doc = result.docs[0] as { url?: string | null } | undefined
    return doc?.url ?? null
  },
  ['media-url'],
  { tags: ['media'] },
)

// Returns the full Media document — use when you need size variants (sizes.medium.url etc.)
export const getMediaDoc = unstable_cache(
  async (filename: string): Promise<Media | null> => {
    const payload = await payloadPromise
    const result = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })
    return (result.docs[0] as Media | undefined) ?? null
  },
  ['media-doc'],
  { tags: ['media'] },
)
