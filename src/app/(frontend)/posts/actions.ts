'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function fetchMorePosts(page: number) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 10,
    page,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      publishedAt: true,
      heroImage: true,
      meta: true,
    },
  })

  return {
    docs: result.docs,
    hasNextPage: result.hasNextPage,
    nextPage: result.nextPage,
  }
}
