'use client'

import { animate, motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback } from 'react'

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
  const scrollToBody = useCallback(() => {
    const target = document.getElementById('tour-info-bar')
    if (!target) return
    const targetY = target.getBoundingClientRect().top + window.scrollY
    const controls = animate(window.scrollY, targetY, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => window.scrollTo(0, v),
    })
    const cancel = () => controls.stop()
    window.addEventListener('touchstart', cancel, { once: true, passive: true })
    window.addEventListener('wheel', cancel, { once: true, passive: true })
  }, [])

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
            <img src={mobileUrl ?? desktopUrl ?? ''} alt="" aria-hidden="true" />
          </picture>
        </div>
      )}

      {/* Flat 50% black overlay */}
      <div className="tour-page-header-overlay" />

      {/* Back to Tours — absolutely positioned outside content margins */}
      <Link href={backHref} className="tour-page-back-link group relative">
        ← Back to Tours
        <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
      </Link>

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

      {/* Scroll-down arrow — mirrors homepage */}
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
