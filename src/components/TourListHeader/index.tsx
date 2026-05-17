'use client'

import { useEffect, useRef, useCallback } from 'react'
import { animate, motion, useScroll, useMotionValue, useMotionValueEvent } from 'framer-motion'

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
  const l4m = layer4MobileUrl ?? null

  const { scrollY } = useScroll()
  const isMobileRef = useRef(false)
  const isProgrammaticRef = useRef(false)

  const titleY = useMotionValue(0)
  const l2Y    = useMotionValue(0)
  const l3Y    = useMotionValue(0)
  const l4Y    = useMotionValue(0)

  useEffect(() => {
    const update = () => { isMobileRef.current = window.innerWidth < 992 }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (isProgrammaticRef.current) return
    const cy = Math.min(y, 900)
    if (isMobileRef.current) {
      titleY.set(cy * 0.6)
      l2Y.set(cy * 0.3)
      l3Y.set(cy * 0.5)
      l4Y.set(cy * 0.7)
    } else {
      titleY.set(cy * 0.45)
      l2Y.set(cy * 0.3)
      l3Y.set(cy * 0.6)
      l4Y.set(0)
    }
  })

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
      <motion.div className="header-layer layer-3" style={{ y: l3Y }}>
        <picture>
          <source srcSet={l3m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l3d} alt="" aria-hidden="true" loading="eager" decoding="async" />
        </picture>
      </motion.div>

      {/* Layer 4 — Deep Background (mobile only, only rendered when URL is explicitly provided) */}
      {l4m && (
        <motion.div className="header-layer layer-4" style={{ y: l4Y }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l4m} alt="" aria-hidden="true" loading="eager" decoding="async" />
        </motion.div>
      )}

      {/* Layer 2 — Midground */}
      <motion.div className="header-layer layer-2" style={{ y: l2Y }}>
        <picture>
          <source srcSet={l2m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l2d} alt="" aria-hidden="true" loading="eager" decoding="async" />
        </picture>
      </motion.div>

      {/* Title text layer */}
      <motion.div className="header-text-layer" style={{ y: titleY }}>
        <div className="container">
          <h1 className="tour-title">{title.toUpperCase()}</h1>
        </div>
      </motion.div>

      {/* Layer 1 — Foreground (no parallax, in front of text) */}
      <div className="header-layer layer-1">
        <picture>
          <source srcSet={l1m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l1d} alt="" aria-hidden="true" loading="eager" decoding="async" />
        </picture>
      </div>

      {/* Scroll-down button */}
      <button
        onClick={scrollToContent}
        aria-label="Scroll to content"
        className="scroll-arrow-btn absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="scroll-arrow-icon">
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
        </div>
      </button>
    </header>
  )
}
