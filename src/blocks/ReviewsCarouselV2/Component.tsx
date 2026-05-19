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

export async function ReviewsCarouselV2Block({
  city = 'both',
  writeReviewCity = 'belgrade',
}: ReviewsCarouselV2BlockProps) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {}
  if (city && city !== 'both') {
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

  const reviews: ReviewData[] = result.docs.map((doc) => {
    const avatarMedia = doc.reviewerAvatar
    let avatarUrl: string | null = null
    if (avatarMedia && typeof avatarMedia === 'object' && 'url' in avatarMedia) {
      avatarUrl = (avatarMedia as { url?: string | null }).url ?? null
    }

    return {
      id: doc.id as number,
      city: (doc.city as string) as 'belgrade' | 'sarajevo',
      reviewerName: (doc.reviewerName as string) ?? '',
      reviewerAvatarUrl: avatarUrl,
      rating: (doc.rating as number) ?? 5,
      reviewText: (doc.reviewText as string) ?? '',
      publishedAt: (doc.publishedAt as string) ?? '',
    }
  })

  // For both-cities mode, split into city-labelled sections
  const citySections =
    !city || city === 'both'
      ? {
          belgrade: reviews.filter((r) => r.city === 'belgrade'),
          sarajevo: reviews.filter((r) => r.city === 'sarajevo'),
        }
      : null

  const writeReviewUrl =
    WRITE_REVIEW_URLS[writeReviewCity ?? 'belgrade'] ?? WRITE_REVIEW_URLS.belgrade

  return (
    <ReviewsCarouselClient
      reviews={reviews}
      citySections={citySections}
      writeReviewUrl={writeReviewUrl}
    />
  )
}
