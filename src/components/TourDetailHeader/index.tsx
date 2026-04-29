'use client'

import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'

interface TourDetailHeaderProps {
  city: 'belgrade' | 'sarajevo'
  title: string
  lede?: string | null
  desktopUrl?: string | null
  mobileUrl?: string | null
}

export function TourDetailHeader({
  city,
  title,
  lede,
  desktopUrl,
  mobileUrl,
}: TourDetailHeaderProps) {
  const { scrollY } = useScroll()
  const imgY = useMotionValue(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    imgY.set(-(Math.min(y, 800) * 0.3))
  })

  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1)
  const hasBg = desktopUrl || mobileUrl

  return (
    <section className="tour-page-header">
      {hasBg && (
        <motion.div className="tour-page-header-bg" style={{ y: imgY }}>
          <picture>
            {desktopUrl && <source srcSet={desktopUrl} media="(min-width: 992px)" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mobileUrl ?? desktopUrl ?? ''} alt="" aria-hidden="true" />
          </picture>
        </motion.div>
      )}

      <div className="tour-page-header-overlay" />

      <div className="tour-page-header-content">
        <div className="container">
          <span className="tour-page-badge">{cityLabel}</span>
          <h1 className="tour-page-title">{title}</h1>
          {lede && <p className="tour-page-lede">{lede}</p>}
        </div>
      </div>
    </section>
  )
}
