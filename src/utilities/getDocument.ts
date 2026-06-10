import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

async function getDocument(collection: Collection, slug: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, slug: string) => {
  // HTTP headers (x-next-cache-tags) only accept ASCII; replace any non-ASCII chars
  // (e.g. em dashes in slugs like "rise—fall-of-a-nation-tour") with a hyphen.
  const safeTag = `${collection}_${slug}`.replace(/[^\x20-\x7E]/g, '-')
  return unstable_cache(async () => getDocument(collection, slug), [collection, slug], {
    tags: [safeTag],
  })
}
