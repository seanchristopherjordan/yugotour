'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'

export interface ReviewData {
  id: number
  source: 'google' | 'tripadvisor'
  city: 'belgrade' | 'sarajevo'
  reviewerName: string
  reviewerAvatarUrl: string | null
  rating: number
  reviewText: string
  publishedAt: string
}

interface ReviewsCarouselClientProps {
  reviews: ReviewData[]
  citySections: { belgrade: ReviewData[]; sarajevo: ReviewData[] } | null
  writeReviewUrl: string
  writeReviewUrls?: { belgrade: string; sarajevo: string }
}

// ── Google 'G' logo SVG (official brand colours) ────────────────────────────
function GoogleGLogo() {
  return (
    <svg
      className="rcv2-google-g"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="rcv2-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'rcv2-star rcv2-star--filled' : 'rcv2-star'}>
          ★
        </span>
      ))}
    </div>
  )
}

// ── TripAdvisor circle rating ────────────────────────────────────────────────
function CircleRating({ rating }: { rating: number }) {
  return (
    <div className="rcv2-circles" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'rcv2-circle rcv2-circle--filled' : 'rcv2-circle'} />
      ))}
    </div>
  )
}

// ── Reviewer avatar ──────────────────────────────────────────────────────────
function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const [imgError, setImgError] = useState(false)
  const initial = name.charAt(0).toUpperCase()

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="rcv2-avatar-img"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div className="rcv2-avatar-initial" aria-hidden="true">
      {initial}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(isoString: string): string {
  if (!isoString) return ''
  try {
    return new Date(isoString).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

// Show "Read more" button when text exceeds ~6 lines worth of characters
const READ_MORE_THRESHOLD = 360

// ── City label — matches TalesFromTheRoad homepage style ─────────────────────
function CityLabel({ city }: { city: 'belgrade' | 'sarajevo' }) {
  return <h3 className="rcv2-city-label">{city.toUpperCase()}</h3>
}

// ── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({
  review,
  onReadMore,
}: {
  review: ReviewData
  onReadMore: (r: ReviewData) => void
}) {
  const needsReadMore = review.reviewText.length > READ_MORE_THRESHOLD

  const isTA = review.source === 'tripadvisor'

  return (
    <div className="rcv2-card">
      <div className="rcv2-card-top">
        {isTA ? <CircleRating rating={review.rating} /> : <StarRating rating={review.rating} />}
        <p className="rcv2-card-date">{formatDate(review.publishedAt)}</p>
      </div>
      <div className="rcv2-card-body">
        <p className="rcv2-card-text">{review.reviewText}</p>
        {needsReadMore && (
          <button
            className="rcv2-read-more-btn"
            onClick={() => onReadMore(review)}
            aria-label={`Read full review by ${review.reviewerName}`}
          >
            Read more
          </button>
        )}
      </div>
      <div className="rcv2-card-footer">
        <div className="rcv2-avatar-wrap">
          <Avatar name={review.reviewerName} avatarUrl={review.reviewerAvatarUrl} />
        </div>
        {isTA ? (
          <p className="rcv2-ta-credit">Review by {review.reviewerName}, a Tripadvisor traveler</p>
        ) : (
          <p className="rcv2-reviewer-name">{review.reviewerName}</p>
        )}
      </div>
    </div>
  )
}

// ── Read-more modal ──────────────────────────────────────────────────────────
function ReviewModal({ review, onClose }: { review: ReviewData; onClose: () => void }) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Lock body scroll while modal is open
  React.useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      className="rcv2-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Review by ${review.reviewerName}`}
    >
      <div className="rcv2-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rcv2-modal-close" onClick={onClose} aria-label="Close review">
          ✕
        </button>
        {review.source === 'tripadvisor'
          ? <CircleRating rating={review.rating} />
          : <StarRating rating={review.rating} />}
        <p className="rcv2-modal-text">{review.reviewText}</p>
        <div className="rcv2-card-footer">
          <div className="rcv2-avatar-wrap">
            <Avatar name={review.reviewerName} avatarUrl={review.reviewerAvatarUrl} />
          </div>
          <div>
            {review.source === 'tripadvisor' ? (
              <p className="rcv2-ta-credit">Review by {review.reviewerName}, a Tripadvisor traveler</p>
            ) : (
              <p className="rcv2-reviewer-name">{review.reviewerName}</p>
            )}
            <p className="rcv2-card-date">{formatDate(review.publishedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Arrow SVGs
const PREV_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='%23FCF9EB' d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H109.2l105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z'/%3E%3C/svg%3E\")"
const NEXT_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='%23FCF9EB' d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z'/%3E%3C/svg%3E\")"

// ── Single-city carousel strip (owns its own swiper state) ────────────────────
function CityCarousel({
  reviews,
  onReadMore,
}: {
  reviews: ReviewData[]
  onReadMore: (r: ReviewData) => void
}) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const syncEdges = (s: SwiperType) => {
    setIsBeginning(s.isBeginning)
    setIsEnd(s.isEnd)
  }

  return (
    <div className="rcv2-carousel-outer">
      <button
        className="rcv2-nav rcv2-nav--prev"
        style={{ backgroundImage: PREV_SVG }}
        onClick={() => swiper?.slidePrev()}
        disabled={isBeginning}
        aria-label="Previous review"
      />

      <Swiper
        modules={[A11y]}
        onSwiper={(s) => { setSwiper(s); syncEdges(s) }}
        loop={false}
        grabCursor
        spaceBetween={26}
        breakpoints={{
          0:    { slidesPerView: 1 },
          600:  { slidesPerView: 2 },
          1100: { slidesPerView: 3 },
          1500: { slidesPerView: 4 },
        }}
        onSlideChange={syncEdges}
        onBreakpoint={syncEdges}
        className="rcv2-swiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="rcv2-slide">
            <ReviewCard review={review} onReadMore={onReadMore} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className="rcv2-nav rcv2-nav--next"
        style={{ backgroundImage: NEXT_SVG }}
        onClick={() => swiper?.slideNext()}
        disabled={isEnd}
        aria-label="Next review"
      />
    </div>
  )
}

// ── Main carousel ────────────────────────────────────────────────────────────
export function ReviewsCarouselClient({ reviews, citySections, writeReviewUrl, writeReviewUrls }: ReviewsCarouselClientProps) {
  const [activeReview, setActiveReview] = useState<ReviewData | null>(null)

  const sectionStyle = {
    backgroundImage: "url('/textures/texture-gold.webp')",
    backgroundRepeat: 'repeat-y' as const,
    backgroundSize: '100% auto' as const,
    backgroundColor: '#D4AF37',
  }

  if (reviews.length === 0) {
    return (
      <section className="rcv2-section reviews-section-outer" style={sectionStyle}>
        <div className="container rcv2-container">
          <div className="rcv2-header">
            <h2 className="tales-section-title">Tales From the Road</h2>
          </div>
          <p className="rcv2-empty">
            No reviews yet — add some in Payload admin under Site → Reviews, or run the sync
            endpoint.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="rcv2-section reviews-section-outer" style={sectionStyle}>
      <div className="container rcv2-container">

        {/* Section header — title only */}
        <div className="rcv2-header">
          <h2 className="tales-section-title">Tales From the Road</h2>
        </div>

        {/* Both-cities mode: BELGRADE + SARAJEVO labelled sections, each with own button */}
        {citySections ? (
          <>
            <div className="rcv2-city-section">
              <CityLabel city="belgrade" />
              <CityCarousel reviews={citySections.belgrade} onReadMore={setActiveReview} />
              <div className="rcv2-city-footer">
                <a
                  href={writeReviewUrls?.belgrade ?? writeReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rcv2-write-btn"
                >
                  LEAVE A REVIEW →
                </a>
              </div>
            </div>
            <div className="rcv2-city-section">
              <CityLabel city="sarajevo" />
              <CityCarousel reviews={citySections.sarajevo} onReadMore={setActiveReview} />
              <div className="rcv2-city-footer">
                <a
                  href={writeReviewUrls?.sarajevo ?? writeReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rcv2-write-btn"
                >
                  LEAVE A REVIEW →
                </a>
              </div>
            </div>

            {/* Attribution sits below both city sections */}
            <div className="rcv2-footer">
              <div className="rcv2-attribution" aria-label="Powered by Google">
                <GoogleGLogo />
                <span>Powered by Google</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Single-city mode */}
            <CityCarousel reviews={reviews} onReadMore={setActiveReview} />

            {/* Footer row: Google attribution left, Leave a Review button right */}
            <div className="rcv2-footer">
              <div className="rcv2-attribution" aria-label="Powered by Google">
                <GoogleGLogo />
                <span>Powered by Google</span>
              </div>
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rcv2-write-btn"
              >
                LEAVE A REVIEW →
              </a>
            </div>
          </>
        )}

      </div>

      {activeReview && (
        <ReviewModal review={activeReview} onClose={() => setActiveReview(null)} />
      )}
    </section>
  )
}
