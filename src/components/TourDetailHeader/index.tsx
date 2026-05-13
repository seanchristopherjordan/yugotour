'use client'

import React from 'react'
import Link from 'next/link'

interface TourDetailHeaderProps {
  city: 'belgrade' | 'sarajevo'
  title: string
  lede?: string | null
  desktopUrl?: string | null
  mobileUrl?: string | null
  desktopFocalX?: number | null
  desktopFocalY?: number | null
  mobileFocalX?: number | null
  mobileFocalY?: number | null
}

export function TourDetailHeader({
  city,
  title,
  lede,
  desktopUrl,
  mobileUrl,
  desktopFocalX,
  desktopFocalY,
  mobileFocalX,
  mobileFocalY,
}: TourDetailHeaderProps) {
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1)
  const hasBg     = desktopUrl || mobileUrl

  const focalVars = {
    '--focal-desktop': `${desktopFocalX ?? 50}% ${desktopFocalY ?? 50}%`,
    '--focal-mobile': `${mobileFocalX ?? desktopFocalX ?? 50}% ${mobileFocalY ?? desktopFocalY ?? 50}%`,
  } as React.CSSProperties

  return (
    <section className="tour-page-header">
      {hasBg && (
        <div className="tour-page-header-bg">
          <picture>
            {desktopUrl && <source srcSet={desktopUrl} media="(min-width: 992px)" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mobileUrl ?? desktopUrl ?? ''} alt="" aria-hidden="true" loading="eager" fetchPriority="high" style={focalVars} />
          </picture>
        </div>
      )}

      <div className="tour-page-header-overlay" />

      <Link href={`/${city}-tours`} className="tour-page-back-link group relative">
        ← Back to Tours
        <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
      </Link>

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
