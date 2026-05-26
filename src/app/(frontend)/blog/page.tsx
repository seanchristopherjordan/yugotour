import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { BlogCategoryListing } from './BlogCategoryListing'
import { PageHeader } from '@/components/PageHeader'
import PageClient from './page.client'
import '../posts/blog-listing.css'

export const revalidate = 3600

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const [catResult, siteSettings] = await Promise.all([
    payload.find({
      collection: 'categories',
      where: { slug: { equals: 'blog' } },
      limit: 1,
    }),
    getCachedGlobal('site-settings', 2)(),
  ])

  const catId = catResult.docs[0]?.id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const site = (siteSettings as any)?.site

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 10,
    overrideAccess: true,
    draft: false,
    sort: '-publishedAt',
    where: catId
      ? { and: [{ categories: { equals: catId } }, { _status: { equals: 'published' } }] }
      : { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      categories: true,
      publishedAt: true,
      heroImage: true,
      meta: true,
    },
  })

  const commentCounts = await getCommentCounts(payload, posts.docs.map((p) => p.id))

  return (
    <div
      style={{ backgroundImage: "url('/textures/texture-blue.webp')", backgroundRepeat: 'repeat' }}
    >
      <PageClient />
      <PageHeader
        heroHeadline={site?.blogHeaderHeadline ?? 'Blog'}
        heroImage={site?.blogHeaderImage ?? null}
        heroImageMobile={site?.blogHeaderImageMobile ?? null}
      />
      <BlogCategoryListing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialPosts={posts.docs as any}
        initialHasMore={posts.hasNextPage ?? false}
        initialNextPage={posts.nextPage ?? null}
        initialCommentCounts={commentCounts}
        categorySlug="blog"
        basePath="/blog"
      />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCommentCounts(payload: any, postIds: (number | string)[]) {
  if (postIds.length === 0) return {}
  try {
    const { docs } = await payload.find({
      collection: 'post-comments',
      where: { and: [{ post: { in: postIds } }, { approved: { equals: true } }] },
      select: { post: true },
      limit: 10000,
      depth: 0,
      overrideAccess: false,
    })
    const counts: Record<string | number, number> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    docs.forEach((c: any) => {
      const pid = typeof c.post === 'object' ? c.post?.id : c.post
      if (pid != null) counts[pid] = (counts[pid] || 0) + 1
    })
    return counts
  } catch {
    return {}
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://www.yugotour.com'

export function generateMetadata(): Metadata {
  return {
    title: 'Blog | YugoTour',
    alternates: { canonical: `${BASE_URL}/blog` },
  }
}
