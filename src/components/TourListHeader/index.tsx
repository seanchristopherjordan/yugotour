'use client'

import { useRef } from 'react'
import { motion, useScroll, useMotionValue, useMotionValueEvent, useAnimationFrame } from 'framer-motion'

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

// Lerp factor: 0.4 gives ~50ms to settle — removes per-frame jitter, no spring feel
const ALPHA = 0.4

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

  const { scrollY } = useScroll()

  const titleY = useMotionValue(0)
  const l2Y    = useMotionValue(0)
  const l3Y    = useMotionValue(0)
  const l4Y    = useMotionValue(0)

  // Plain ref for scroll targets — avoids triggering re-renders
  const targets = useRef({ titleY: 0, l2Y: 0, l3Y: 0, l4Y: 0 })

  useMotionValueEvent(scrollY, 'change', (y) => {
    const clamped = Math.min(y, 1200)
    const mobile = window.innerWidth < 992
    if (mobile) {
      targets.current = { titleY: clamped * 0.4, l2Y: clamped * 0.3, l3Y: clamped * 0.5, l4Y: clamped * 0.7 }
    } else {
      targets.current = { titleY: clamped * 0.31, l2Y: clamped * 0.39, l3Y: clamped * 0.6, l4Y: 0 }
    }
  })

  useAnimationFrame(() => {
    const t = targets.current
    titleY.set(titleY.get() + (t.titleY - titleY.get()) * ALPHA)
    l2Y.set(l2Y.get()       + (t.l2Y    - l2Y.get())    * ALPHA)
    l3Y.set(l3Y.get()       + (t.l3Y    - l3Y.get())    * ALPHA)
    l4Y.set(l4Y.get()       + (t.l4Y    - l4Y.get())    * ALPHA)
  })

  return (
    <header className="tour-header">
      {/* Layer 3 — Background */}
      <div className="header-layer layer-3">
        <motion.div style={{ y: l3Y, width: '100%', height: '100%' }}>
          <picture>
            <source srcSet={l3m} media="(max-width: 991px)" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l3d} alt="" />
          </picture>
        </motion.div>
      </div>

      {/* Layer 4 — Deep Background (mobile only) */}
      <div className="header-layer layer-4">
        <motion.div style={{ y: l4Y, width: '100%', height: '100%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l4m} alt="" />
        </motion.div>
      </div>

      {/* Layer 2 — Midground */}
      <div className="header-layer layer-2">
        <motion.div style={{ y: l2Y, width: '100%', height: '100%' }}>
          <picture>
            <source srcSet={l2m} media="(max-width: 991px)" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l2d} alt="" />
          </picture>
        </motion.div>
      </div>

      {/* Title text layer */}
      <div className="header-text-layer">
        <div className="container">
          <motion.h1 className="tour-title" style={{ y: titleY }}>
            {title.toUpperCase()}
          </motion.h1>
        </div>
      </div>

      {/* Layer 1 — Foreground (no parallax, in front of text) */}
      <div className="header-layer layer-1">
        <picture>
          <source srcSet={l1m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l1d} alt="" />
        </picture>
      </div>
    </header>
  )
}
