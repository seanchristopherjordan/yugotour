import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import Link from 'next/link'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { formatDateTime } from '@/utilities/formatDateTime'
import { CommentForm } from './CommentForm'
import './blog-post.css'

export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://yugotour.com'

function lexicalToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as Record<string, unknown>
  if (typeof n.text === 'string') return n.text
  const children = Array.isArray(n.children)
    ? n.children
    : Array.isArray((n.root as Record<string, unknown>)?.children)
      ? ((n.root as Record<string, unknown>).children as unknown[])
      : null
  if (children) return children.map(lexicalToText).join(' ').replace(/\s+/g, ' ').trim()
  return ''
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs: catDocs } = await payload.find({
      collection: 'categories',
      where: { slug: { in: ['blog', 'in-the-media'] } },
      limit: 10,
    })
    const catIds = catDocs.map((c) => c.id)

    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      where: catIds.length > 0 ? { categories: { in: catIds } } : {},
      select: { slug: true },
    })

    return posts.docs.map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function BlogPostPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blog/' + decodedSlug

  const post = await queryPostBySlug({ slug: decodedSlug })
  if (!post) return <PayloadRedirects url={url} />

  const payload = await getPayload({ config: configPromise })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let comments: any[] = []
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { docs } = await (payload as any).find({
      collection: 'post-comments',
      where: { and: [{ post: { equals: post.id } }, { approved: { equals: true } }] },
      sort: 'publishedAt',
      limit: 500,
      depth: 0,
      overrideAccess: false,
    })
    comments = docs
  } catch {
    comments = []
  }

  const heroImage =
    post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null

  const backPath =
    (post.categories as Array<{ slug?: string | null }>)?.some((c) => c?.slug === 'in-the-media')
      ? '/in-the-media'
      : '/blog'

  const backLabel = backPath === '/in-the-media' ? '← In the Media' : '← Blog'

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(heroImage && 'url' in heroImage && heroImage.url ? { image: heroImage.url } : {}),
    url: `${BASE_URL}/blog/${decodedSlug}`,
    publisher: { '@type': 'Organization', name: 'YugoTour', url: BASE_URL },
  }

  return (
    <article className="blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <PayloadRedirects disableNotFound url={url} />

      {/* Hero */}
      <div className="blog-post-hero">
        {heroImage && 'url' in heroImage && heroImage.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage.url}
            alt={('alt' in heroImage ? heroImage.alt : null) ?? post.title ?? ''}
            className="blog-post-hero-img"
            loading="eager"
            style={{
              objectPosition: `${'focalX' in heroImage && heroImage.focalX != null ? heroImage.focalX : 50}% ${'focalY' in heroImage && heroImage.focalY != null ? heroImage.focalY : 50}%`,
            }}
          />
        )}
        <div className="blog-post-hero-overlay" />
        <div className="blog-post-hero-content container">
          <Link href={backPath} className="blog-post-back-link">
            {backLabel}
          </Link>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta">
            {post.publishedAt && (
              <time dateTime={post.publishedAt} className="blog-post-date">
                {formatDateTime(post.publishedAt)}
              </time>
            )}
            <span className="blog-post-comment-count">
              {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="blog-post-body container">
        {post.content && (
          <RichText
            className="blog-post-richtext"
            data={post.content}
            enableGutter={false}
            enableProse={false}
          />
        )}
      </div>

      {/* Layout blocks (VideoEmbed, ImageCarousel, etc.) */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {Array.isArray((post as any).layout) && (post as any).layout.length > 0 && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <RenderBlocks blocks={(post as any).layout} />
      )}

      {/* Comments */}
      <div className="blog-post-comments container">
        <h2 className="blog-post-comments-heading">
          {comments.length > 0
            ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`
            : 'No Comments Yet'}
        </h2>

        {comments.length > 0 && (
          <div className="blog-post-comment-list">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {comments.map((comment: any) => (
              <div key={comment.id} className="blog-post-comment">
                <div className="blog-post-comment-header">
                  <span className="blog-post-comment-author">{comment.authorName}</span>
                  {comment.publishedAt && (
                    <time
                      className="blog-post-comment-date"
                      dateTime={comment.publishedAt}
                    >
                      {formatDateTime(comment.publishedAt)}
                    </time>
                  )}
                </div>
                <p className="blog-post-comment-body">{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="blog-post-comment-form-wrap">
          <h3 className="blog-post-leave-comment">Leave a Comment</h3>
          <CommentForm postId={post.id} postSlug={decodedSlug} />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug: decodeURIComponent(slug) })

  const title = post?.meta?.title ?? post?.title ?? 'Blog | YugoTour'
  const description =
    post?.meta?.description ??
    (post?.content ? lexicalToText(post.content).slice(0, 155).replace(/\s\S*$/, '…') : undefined)

  const heroImg =
    post?.heroImage && typeof post.heroImage === 'object' && 'url' in post.heroImage
      ? (post.heroImage as { url?: string | null; alt?: string | null })
      : null

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      type: 'article',
      ...(post?.publishedAt ? { publishedTime: post.publishedAt } : {}),
      ...(post?.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      ...(heroImg?.url
        ? { images: [{ url: heroImg.url, alt: heroImg.alt ?? title }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? undefined,
      ...(heroImg?.url ? { images: [heroImg.url] } : {}),
    },
  }
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  })

  return result.docs?.[0] || null
})
