'use client'

import { useState, useTransition } from 'react'
import { BlogTile } from '@/components/BlogTile'
import { fetchMoreCategoryPosts } from './actions'
import '../posts/blog-listing.css'

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

interface BlogCategoryListingProps {
  initialPosts: BlogPost[]
  initialHasMore: boolean
  initialNextPage: number | null
  initialCommentCounts: Record<string | number, number>
  categorySlug: string
  basePath: string
}

export function BlogCategoryListing({
  initialPosts,
  initialHasMore,
  initialNextPage,
  initialCommentCounts,
  categorySlug,
  basePath,
}: BlogCategoryListingProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [nextPage, setNextPage] = useState<number | null>(initialNextPage)
  const [commentCounts, setCommentCounts] = useState(initialCommentCounts)
  const [isPending, startTransition] = useTransition()

  const handleShowMore = () => {
    if (!nextPage) return
    startTransition(async () => {
      const result = await fetchMoreCategoryPosts(nextPage, categorySlug)
      setPosts((prev) => [...prev, ...(result.docs as BlogPost[])])
      setCommentCounts((prev) => ({ ...prev, ...result.commentCounts }))
      setHasMore(result.hasNextPage ?? false)
      setNextPage(result.nextPage ?? null)
    })
  }

  return (
    <>
      <div className="blog-grid container">
        {posts.map((post) => (
          <BlogTile
            key={post.id}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            post={post as any}
            basePath={basePath}
            commentCount={commentCounts[post.id] ?? 0}
          />
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
