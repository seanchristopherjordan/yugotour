import { type NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_REVIEWS_PER_CITY = 10

const PLACE_IDS: Record<string, string | undefined> = {
  belgrade: process.env.GOOGLE_PLACE_ID_BELGRADE,
  sarajevo: process.env.GOOGLE_PLACE_ID_SARAJEVO,
}

interface GoogleReview {
  name: string
  rating: number
  text?: { text: string; languageCode: string }
  authorAttribution?: {
    displayName: string
    uri: string
    photoUri?: string
  }
  publishTime?: string
}

type SyncCityResult = {
  synced: number
  evicted: number
  skipped: number
  error?: string
}

function verifySecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

// ── GET: called by Vercel Cron (weekly, Sunday 2am UTC) ──────────────────────

export async function GET(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runSyncResponse()
}

// ── POST: manual trigger (curl / admin use) ──────────────────────────────────

export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runSyncResponse()
}

// ── Core sync orchestration ──────────────────────────────────────────────────

async function runSyncResponse() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not set' }, { status: 500 })
  }

  const payload = await getPayload({ config: configPromise })
  const results: Record<string, SyncCityResult> = {}

  for (const [city, placeId] of Object.entries(PLACE_IDS)) {
    results[city] = await syncCity(payload, apiKey, city, placeId)
  }

  return NextResponse.json({
    results,
    note: 'Google Places API returns max 5 reviews per request. Run sync again next week to accumulate more.',
  })
}

async function syncCity(
  payload: Payload,
  apiKey: string,
  city: string,
  placeId: string | undefined,
): Promise<SyncCityResult> {
  if (!placeId) {
    return { synced: 0, evicted: 0, skipped: 0, error: `GOOGLE_PLACE_ID_${city.toUpperCase()} not set` }
  }

  // Fetch from Google Places API (New)
  let googleReviews: GoogleReview[] = []
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      return { synced: 0, evicted: 0, skipped: 0, error: `Places API ${res.status}: ${body}` }
    }

    const data = (await res.json()) as { reviews?: GoogleReview[] }
    googleReviews = data.reviews ?? []
  } catch (err) {
    return { synced: 0, evicted: 0, skipped: 0, error: String(err) }
  }

  // Only keep 4-star and above
  const qualified = googleReviews.filter((r) => r.rating >= 4)

  let synced = 0
  let evicted = 0
  let skipped = 0

  for (const review of qualified) {
    const googleReviewId = review.name
    const publishedAt = review.publishTime ?? new Date().toISOString()

    // Skip if already stored
    const existing = await payload.find({
      collection: 'reviews',
      where: { googleReviewId: { equals: googleReviewId } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) {
      skipped++
      continue
    }

    // Load existing reviews for this city, oldest-first, to enforce the cap
    const citySnapshot = await payload.find({
      collection: 'reviews',
      where: { city: { equals: city } },
      sort: 'publishedAt',
      limit: MAX_REVIEWS_PER_CITY + 1,
      overrideAccess: true,
      depth: 1,
    })

    if (citySnapshot.totalDocs >= MAX_REVIEWS_PER_CITY) {
      const oldest = citySnapshot.docs[0]
      const oldestMs = new Date(oldest.publishedAt as string).getTime()
      const newMs = new Date(publishedAt).getTime()

      if (newMs <= oldestMs) {
        // New review is older than everything we have — not worth adding
        skipped++
        continue
      }

      // Evict the oldest to make room, cleaning up its avatar asset too
      const avatarRelation = oldest.reviewerAvatar
      if (avatarRelation && typeof avatarRelation === 'object' && 'id' in avatarRelation) {
        await payload
          .delete({ collection: 'media', id: (avatarRelation as { id: number }).id, overrideAccess: true })
          .catch(() => undefined)
      }

      await payload.delete({ collection: 'reviews', id: oldest.id as number, overrideAccess: true })
      evicted++
    }

    // Download and store the reviewer avatar
    const photoUri = review.authorAttribution?.photoUri
    const avatarMediaId = photoUri
      ? await downloadAvatar(
          payload,
          photoUri,
          review.authorAttribution?.displayName ?? 'Reviewer',
          googleReviewId,
        )
      : null

    await payload.create({
      collection: 'reviews',
      data: {
        city: city as 'belgrade' | 'sarajevo',
        reviewerName: review.authorAttribution?.displayName ?? 'Anonymous',
        ...(avatarMediaId ? { reviewerAvatar: avatarMediaId } : {}),
        reviewerAvatarUrl: photoUri ?? null,
        rating: review.rating,
        reviewText: review.text?.text ?? '',
        publishedAt,
        googleReviewId,
      },
      overrideAccess: true,
    })

    synced++
  }

  return { synced, evicted, skipped }
}

// ── Avatar download helper ────────────────────────────────────────────────────

async function downloadAvatar(
  payload: Payload,
  photoUri: string,
  name: string,
  reviewId: string,
): Promise<number | null> {
  try {
    // Request a 200px version of the Google profile photo
    const sizedUri = photoUri.replace(/=[sw]\d+-?[ch]?$/, '=s200-c')

    const response = await fetch(sizedUri, { cache: 'no-store' })
    if (!response.ok) return null

    const contentType = response.headers.get('content-type') ?? 'image/jpeg'
    if (!contentType.startsWith('image/')) return null

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    if (buffer.length === 0) return null

    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
    const safeId = reviewId.replace(/[^a-zA-Z0-9]/g, '-').slice(-32)
    const filename = `greviewer-${safeId}.${ext}`

    const media = await payload.create({
      collection: 'media',
      data: { alt: `${name} profile photo` },
      // @ts-expect-error Payload local API accepts a Buffer-based file object
      file: { data: buffer, mimetype: contentType, name: filename, size: buffer.length },
      overrideAccess: true,
    })

    return media.id as number
  } catch {
    // Avatar failure is non-fatal — review is still stored, initial letter is shown
    return null
  }
}
