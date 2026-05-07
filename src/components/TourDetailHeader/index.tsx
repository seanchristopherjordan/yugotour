'use client'

import Link from 'next/link'

interface TourDetailHeaderProps {
  city: 'belgrade' | 'sarajevo'
  title: string
  lede?: string | null
  desktopUrl?: string | null
  mobileUrl?: string | null
  prevSlug?: string | null
  nextSlug?: string | null
}

export function TourDetailHeader({
  city,
  title,
  lede,
  desktopUrl,
  mobileUrl,
  prevSlug,
  nextSlug,
}: TourDetailHeaderProps) {
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1)
  const backHref  = city === 'belgrade' ? '/belgrade-tours' : '/sarajevo-tours'
  const hasBg     = desktopUrl || mobileUrl

  return (
    <section className="tour-page-header">
      {/* Static background — no parallax */}
      {hasBg && (
        <div className="tour-page-header-bg">
          <picture>
            {desktopUrl && <source srcSet={desktopUrl} media="(min-width: 992px)" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mobileUrl ?? desktopUrl ?? ''} alt="" aria-hidden="true" loading="eager" fetchPriority="high" />
          </picture>
        </div>
      )}

      {/* Flat overlay */}
      <div className="tour-page-header-overlay" />

      {/* Back link — top left */}
      <Link href={backHref} className="tour-page-back-link group relative">
        ← Back
        <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
      </Link>

      {/* Prev tour — bottom left */}
      {prevSlug && (
        <Link href={`/tours/${prevSlug}`} className="tour-page-nav-prev group relative">
          ← Prev
          <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
        </Link>
      )}

      {/* Next tour — bottom right */}
      {nextSlug && (
        <Link href={`/tours/${nextSlug}`} className="tour-page-nav-next group relative">
          Next →
          <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
        </Link>
      )}

      {/* Bottom-anchored text block — grows upward on wrap */}
      <div className="tour-page-header-content">
        <div className="container">
          <div className="tour-page-header-text">
            <span className="tour-page-badge">{cityLabel}</span>
            <h1 className="tour-page-title">{title}</h1>
            {lede && <p className="tour-page-lede">{lede}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
