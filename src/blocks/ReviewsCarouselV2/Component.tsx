import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import { ReviewsCarouselClient, type ReviewData } from './ReviewsCarouselClient'

const WRITE_REVIEW_URLS: Record<string, string> = {
  belgrade: 'https://maps.app.goo.gl/v8qd7Fg8nL2objY97',
  sarajevo: 'https://maps.app.goo.gl/yG41GVTv1NPx9tPo7',
}

export interface ReviewsCarouselV2BlockProps {
  blockType: 'reviewsCarouselV2'
  label?: string | null
  city?: 'both' | 'belgrade' | 'sarajevo' | null
  writeReviewCity?: 'belgrade' | 'sarajevo' | null
}

// ── Lexical JSON helpers ─────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

type LexicalNode = {
  type: string
  text?: string
  format?: number
  children?: LexicalNode[]
}

function serializeNode(node: LexicalNode): string {
  if (node.type === 'linebreak') return '<br>'
  if (node.type === 'text') {
    let t = escapeHtml(node.text ?? '')
    if ((node.format ?? 0) & 1) t = `<strong>${t}</strong>`
    if ((node.format ?? 0) & 2) t = `<em>${t}</em>`
    return t
  }
  if (node.type === 'paragraph') {
    const inner = (node.children ?? []).map(serializeNode).join('')
    return `<p>${inner}</p>`
  }
  return (node.children ?? []).map(serializeNode).join('')
}

function lexicalToHtml(json: unknown): string {
  if (!json || typeof json !== 'object') return ''
  const root = (json as { root?: LexicalNode }).root
  if (!root?.children) return ''
  return root.children.map(serializeNode).join('')
}

function lexicalToPlainText(json: unknown): string {
  if (!json || typeof json !== 'object') return ''
  const root = (json as { root?: LexicalNode }).root
  if (!root?.children) return ''
  const extractText = (node: LexicalNode): string => {
    if (node.type === 'text') return node.text ?? ''
    return (node.children ?? []).map(extractText).join('')
  }
  return root.children.map(extractText).join(' ')
}

// ────────────────────────────────────────────────────────────────────────────

const getCachedReviews = (city: 'both' | 'belgrade' | 'sarajevo') =>
  unstable_cache(
    async (): Promise<ReviewData[]> => {
      const payload = await getPayload({ config: configPromise })

      const where: Where = {}
      if (city !== 'both') {
        where.city = { equals: city }
      }

      const result = await payload.find({
        collection: 'reviews',
        where,
        sort: '-publishedAt',
        limit: 20,
        depth: 1,
        overrideAccess: true,
      })

      return result.docs.map((doc) => {
        const avatarMedia = doc.reviewerAvatar
        let avatarUrl: string | null = null
        if (avatarMedia && typeof avatarMedia === 'object' && 'url' in avatarMedia) {
          avatarUrl = (avatarMedia as { url?: string | null }).url ?? null
        }

        const source = ((doc.source as string) ?? 'google') as 'google' | 'tripadvisor'
        const isTA = source === 'tripadvisor'

        const reviewTextRichHtml = isTA ? lexicalToHtml(doc.reviewTextRich) : null
        // reviewText is used for threshold check on both sources
        const reviewText = isTA
          ? lexicalToPlainText(doc.reviewTextRich)
          : ((doc.reviewText as string) ?? '')

        return {
          id: doc.id as number,
          source,
          city: (doc.city as string) as 'belgrade' | 'sarajevo',
          reviewerName: (doc.reviewerName as string) ?? '',
          reviewerAvatarUrl: avatarUrl,
          rating: (doc.rating as number) ?? 5,
          reviewText,
          reviewTextRichHtml,
          publishedAt: (doc.publishedAt as string) ?? '',
        }
      })
    },
    [`reviews-carousel-${city}`],
    { tags: ['reviews'] },
  )

export async function ReviewsCarouselV2Block({
  city = 'both',
  writeReviewCity = 'belgrade',
}: ReviewsCarouselV2BlockProps) {
  const reviews = await getCachedReviews(city ?? 'both')()

  const citySections =
    !city || city === 'both'
      ? {
          belgrade: reviews.filter((r) => r.city === 'belgrade'),
          sarajevo: reviews.filter((r) => r.city === 'sarajevo'),
        }
      : null

  const writeReviewUrl =
    WRITE_REVIEW_URLS[writeReviewCity ?? 'belgrade'] ?? WRITE_REVIEW_URLS.belgrade

  const writeReviewUrls = citySections
    ? { belgrade: WRITE_REVIEW_URLS.belgrade, sarajevo: WRITE_REVIEW_URLS.sarajevo }
    : undefined

  return (
    <ReviewsCarouselClient
      reviews={reviews}
      citySections={citySections}
      singleCity={citySections ? undefined : (city as 'belgrade' | 'sarajevo')}
      writeReviewUrl={writeReviewUrl}
      writeReviewUrls={writeReviewUrls}
    />
  )
}
