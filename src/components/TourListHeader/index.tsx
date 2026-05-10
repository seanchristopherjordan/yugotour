'use client'

import { useEffect, useRef, useCallback } from 'react'
import { animate } from 'framer-motion'

export interface TourListHeaderProps {
  title: string
  city: 'belgrade' | 'sarajevo'
  layer1DesktopUrl?: string | null
  layer2DesktopUrl?: string | null
  layer3DesktopUrl?: string | null
  layer1MobileUrl?: string | null
  layer2MobileUrl?: string | null
  layer3MobileUrl?: string | null
  layer4MobileUrl?: string | null
}

function fallback(city: string, filename: string) {
  return `/tour-headers/${city}-${filename}`
}

export function TourListHeader({
  title,
  city,
  layer1DesktopUrl,
  layer2DesktopUrl,
  layer3DesktopUrl,
  layer1MobileUrl,
  layer2MobileUrl,
  layer3MobileUrl,
  layer4MobileUrl,
}: TourListHeaderProps) {
  const l1d = layer1DesktopUrl ?? fallback(city, 'header-layer-1.webp')
  const l2d = layer2DesktopUrl ?? fallback(city, 'header-layer-2.webp')
  const l3d = layer3DesktopUrl ?? fallback(city, 'header-layer-3.webp')
  const l1m = layer1MobileUrl ?? fallback(city, 'mobile-header-layer-1.webp')
  const l2m = layer2MobileUrl ?? fallback(city, 'mobile-header-layer-2.webp')
  const l3m = layer3MobileUrl ?? fallback(city, 'mobile-header-layer-3.webp')
  const l4m = layer4MobileUrl ?? fallback(city, 'mobile-header-layer-4.webp')

  const isProgrammaticRef = useRef(false)

  const scrollToContent = useCallback(() => {
    const target = document.getElementById('tour-list-intro')
    if (!target) return
    isProgrammaticRef.current = true
    const targetY = target.getBoundingClientRect().top + window.scrollY
    const controls = animate(window.scrollY, targetY, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => window.scrollTo(0, v),
      onComplete: () => { isProgrammaticRef.current = false },
    })
    const cancel = () => { isProgrammaticRef.current = false; controls.stop() }
    window.addEventListener('touchstart', cancel, { once: true, passive: true })
    window.addEventListener('wheel', cancel, { once: true, passive: true })
  }, [])

  return (
    <header className="tour-header">
      {/* Layer 3 — Background */}
      <div className="header-layer layer-3">
        <picture>
          <source srcSet={l3m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l3d} alt="" loading="eager" decoding="async" />
        </picture>
      </div>

      {/* Layer 4 — Deep Background (mobile only) */}
      <div className="header-layer layer-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l4m} alt="" loading="eager" decoding="async" />
      </div>

      {/* Layer 2 — Midground */}
      <div className="header-layer layer-2">
        <picture>
          <source srcSet={l2m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l2d} alt="" loading="eager" decoding="async" />
        </picture>
      </div>

      {/* Title text layer */}
      <div className="header-text-layer">
        <div className="container">
          <h1 className="tour-title">{title.toUpperCase()}</h1>
        </div>
      </div>

      {/* Layer 1 — Foreground (no parallax, in front of text) */}
      <div className="header-layer layer-1">
        <picture>
          <source srcSet={l1m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l1d} alt="" loading="eager" decoding="async" />
        </picture>
      </div>

      {/* Scroll-down button — temporarily removed for isolation testing */}
    </header>
  )
}
