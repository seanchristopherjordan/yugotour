import Link from 'next/link'
import { formatDateTime } from '@/utilities/formatDateTime'
import './blog-tile.css'

interface BlogTileCategory {
  title?: string | null
}

interface BlogTilePost {
  slug: string
  title: string
  publishedAt?: string | null
  categories?: (string | BlogTileCategory)[] | null
  heroImage?: { url?: string | null; alt?: string | null } | string | null
  meta?: {
    image?: { url?: string | null; alt?: string | null } | string | null
    description?: string | null
  } | null
}

interface BlogTileProps {
  post: BlogTilePost
  basePath?: string
  commentCount?: number
}

export function BlogTile({ post, basePath = '/posts', commentCount }: BlogTileProps) {
  const { slug, title, publishedAt, categories, heroImage, meta } = post

  // Prefer meta.image, fall back to heroImage
  const imageSource = meta?.image ?? heroImage
  const imageObj = typeof imageSource === 'object' && imageSource !== null ? imageSource : null
  const imageUrl = imageObj?.url ?? null

  const resolvedCategories = (categories ?? [])
    .filter((c): c is BlogTileCategory => typeof c === 'object' && c !== null)
    .map((c) => c.title)
    .filter(Boolean)

  return (
    <article className="blog-tile">
      <Link href={`${basePath}/${slug}`} className="blog-tile-link" tabIndex={-1} aria-hidden>
        <div className="blog-tile-image-wrap">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={imageObj?.alt ?? title}
              className="blog-tile-image"
              loading="lazy"
            />
          ) : (
            <div className="blog-tile-image-placeholder" />
          )}
        </div>
      </Link>
      <div className="blog-tile-body">
        {resolvedCategories.length > 0 && (
          <p className="blog-tile-category">{resolvedCategories.join(', ')}</p>
        )}
        <h2 className="blog-tile-title">
          <Link href={`${basePath}/${slug}`}>{title}</Link>
        </h2>
        {publishedAt && (
          <time className="blog-tile-date" dateTime={publishedAt}>
            {formatDateTime(publishedAt)}
          </time>
        )}
        {meta?.description && <p className="blog-tile-excerpt">{meta.description}</p>}
        {commentCount !== undefined && commentCount > 0 && (
          <p className="blog-tile-comments">{commentCount} comment{commentCount !== 1 ? 's' : ''}</p>
        )}
      </div>
    </article>
  )
}
