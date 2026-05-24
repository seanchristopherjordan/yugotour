'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
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
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isPending) {
          loadMore()
        }
      },
      { rootMargin: '300px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isPending, nextPage])

  const loadMore = () => {
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
        <div ref={sentinelRef} className="blog-lazy-sentinel" aria-hidden="true" />
      )}
    </>
  )
}
