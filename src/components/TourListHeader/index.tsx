'use client'

import { motion, useScroll, useMotionValue, useMotionValueEvent } from 'framer-motion'

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

  const { scrollY } = useScroll()

  const titleY = useMotionValue(0)
  const l2Y = useMotionValue(0)
  const l3Y = useMotionValue(0)
  const l4Y = useMotionValue(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (y > 1200) return
    const mobile = window.innerWidth < 992
    if (mobile) {
      titleY.set(y * 0.4)
      l2Y.set(y * 0.3)
      l3Y.set(y * 0.5)
      l4Y.set(y * 0.7)
    } else {
      titleY.set(y * 0.31)
      l2Y.set(y * 0.39)
      l3Y.set(y * 0.6)
      l4Y.set(0)
    }
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
