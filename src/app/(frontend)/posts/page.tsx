import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { BlogListing } from './BlogListing'
import PageClient from './page.client'
import './blog-listing.css'

export const dynamic = 'force-static'

export default async function PostsPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 10,
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

  return (
    <div>
      <PageClient />
      {/* Blog header band */}
      <div className="blog-header-band">
        <div className="container">
          <h1 className="blog-header-title">BLOG</h1>
        </div>
      </div>

      <BlogListing
        initialPosts={posts.docs as unknown as Parameters<typeof BlogListing>[0]['initialPosts']}
        initialHasMore={posts.hasNextPage ?? false}
        initialNextPage={posts.nextPage ?? null}
      />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Blog | YugoTour',
  }
}
