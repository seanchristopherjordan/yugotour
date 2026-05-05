'use client'

import { useState, useTransition } from 'react'
import { BlogTile } from '@/components/BlogTile'
import { fetchMorePosts } from './actions'
import './blog-listing.css'

interface BlogPost {
  id: number | string
  slug: string
  title: string
  publishedAt?: string | null
  categories?: unknown[] | null
  heroImage?: unknown
  meta?: {
    image?: unknown
    description?: string | null
  } | null
}

interface BlogListingProps {
  initialPosts: BlogPost[]
  initialHasMore: boolean
  initialNextPage: number | null
}

export function BlogListing({ initialPosts, initialHasMore, initialNextPage }: BlogListingProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [nextPage, setNextPage] = useState<number | null>(initialNextPage)
  const [isPending, startTransition] = useTransition()

  const handleShowMore = () => {
    if (!nextPage) return
    startTransition(async () => {
      const result = await fetchMorePosts(nextPage)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPosts((prev) => [...prev, ...(result.docs as any[])])
      setHasMore(result.hasNextPage ?? false)
      setNextPage(result.nextPage ?? null)
    })
  }

  return (
    <>
      <div className="blog-grid container">
        {posts.map((post) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <BlogTile key={post.id} post={post as any} />
        ))}
      </div>

      {hasMore && (
        <div className="blog-show-more container">
          <button
            onClick={handleShowMore}
            disabled={isPending}
            className="blog-show-more-btn btn-spring-hover"
            type="button"
          >
            {isPending ? 'Loading…' : 'Show More'}
          </button>
        </div>
      )}
    </>
  )
}
