'use client'

import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import Link from 'next/link'
import { useCallback } from 'react'

interface Extra {
  title: string
  priceGroup?: string | null
  priceSolo?: string | null
}

interface TourDetailHeaderProps {
  city: 'belgrade' | 'sarajevo'
  title: string
  lede?: string | null
  desktopUrl?: string | null
  mobileUrl?: string | null
  duration?: string | null
  priceGroup?: number | null
  priceSolo?: number | null
  includesList?: string[]
  extras?: Extra[]
  bookingHref: string
}

export function TourDetailHeader({
  city,
  title,
  lede,
  desktopUrl,
  mobileUrl,
  duration,
  priceGroup,
  priceSolo,
  includesList = [],
  extras = [],
  bookingHref,
}: TourDetailHeaderProps) {
  const { scrollY } = useScroll()
  const imgY = useMotionValue(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    imgY.set(-(Math.min(y, 800) * 0.3))
  })

  const scrollToBody = useCallback(() => {
    const target = document.getElementById('tour-detail-body')
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1)
  const backHref  = city === 'belgrade' ? '/belgrade-tours' : '/sarajevo-tours'
  const backLabel = `Back to ${cityLabel} Tours`
  const hasBg     = desktopUrl || mobileUrl
  const hasPrice  = priceGroup != null || priceSolo != null
  const hasExtras = extras.length > 0

  return (
    <section className="tour-page-header">
      {/* Parallax background */}
      {hasBg && (
        <motion.div className="tour-page-header-bg" style={{ y: imgY }}>
          <picture>
            {desktopUrl && <source srcSet={desktopUrl} media="(min-width: 992px)" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mobileUrl ?? desktopUrl ?? ''} alt="" aria-hidden="true" />
          </picture>
        </motion.div>
      )}

      {/* 50% solid black overlay */}
      <div className="tour-page-header-overlay" />

      {/* Back to tours — top of header */}
      <div className="tour-page-back">
        <div className="container">
          <Link href={backHref} className="tour-page-back-link group relative">
            ← {backLabel}
            <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
          </Link>
        </div>
      </div>

      {/* Main content — bottom-anchored, grows upward on wrap */}
      <div className="tour-page-header-content">
        <div className="container">
          <span className="tour-page-badge">{cityLabel}</span>
          <h1 className="tour-page-title">{title}</h1>
          {lede && <p className="tour-page-lede">{lede}</p>}

          {/* Info section */}
          <div className="tour-page-header-info">
            {duration && (
              <div className="tour-hinfo-item tour-hinfo-item--duration">
                <span className="tour-hinfo-label">Duration</span>
                <span className="tour-hinfo-value">{duration}</span>
              </div>
            )}

            {hasPrice && (
              <>
                <div className="tour-hinfo-sep" aria-hidden="true" />
                <div className="tour-hinfo-item tour-hinfo-item--price">
                  <span className="tour-hinfo-label">Price</span>
                  {priceGroup != null && (
                    <span className="tour-hinfo-value">
                      {priceGroup}€ <span className="tour-hinfo-sublabel">(Group)</span>
                    </span>
                  )}
                  {priceSolo != null && (
                    <span className="tour-hinfo-value">
                      {priceSolo}€ <span className="tour-hinfo-sublabel">(Solo)</span>
                    </span>
                  )}
                </div>
              </>
            )}

            {includesList.length > 0 && (
              <>
                <div className="tour-hinfo-sep" aria-hidden="true" />
                <div className="tour-hinfo-item tour-hinfo-item--includes">
                  <span className="tour-hinfo-label">Includes</span>
                  <span className="tour-hinfo-value">{includesList.join(' / ')}</span>
                </div>
              </>
            )}

            {hasExtras && (
              <>
                <div className="tour-hinfo-sep" aria-hidden="true" />
                <div className="tour-hinfo-item tour-hinfo-item--extras">
                  <span className="tour-hinfo-label">Optional Extras</span>
                  <span className="tour-hinfo-value">
                    {extras.map((e) => e.title).join(' / ')}
                  </span>
                </div>
              </>
            )}
          </div>

          <Link href={bookingHref} className="tour-book-btn">
            Book this Tour →
          </Link>
        </div>
      </div>

      {/* Scroll-down arrow — mirrors homepage HeroVideo */}
      <motion.button
        onClick={scrollToBody}
        aria-label="Scroll to content"
        className="tour-page-scroll-btn"
        whileHover={{ filter: 'brightness(1.2)' }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-50"
          >
            <circle cx="19" cy="19" r="18" stroke="white" strokeWidth="1.5" />
            <path
              d="M12 16.5L19 23.5L26 16.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  )
}
