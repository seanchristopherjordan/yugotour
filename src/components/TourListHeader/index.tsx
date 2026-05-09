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

  const headerRef = useRef<HTMLElement>(null)
  const titleRef  = useRef<HTMLDivElement>(null)
  const l2Ref     = useRef<HTMLDivElement>(null)
  const l3Ref     = useRef<HTMLDivElement>(null)
  const l4Ref     = useRef<HTMLDivElement>(null)
  const isMobileRef = useRef(false)
  const capRef      = useRef(900)
  const rafRef      = useRef<number>(0)

  useEffect(() => {
    const updateDimensions = () => {
      isMobileRef.current = window.innerWidth < 992
      capRef.current = headerRef.current?.offsetHeight ?? 900
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions, { passive: true })

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, capRef.current)
        const mobile = isMobileRef.current
        if (titleRef.current)
          titleRef.current.style.transform = `translateY(${y * (mobile ? 0.6 : 0.45)}px)`
        if (l2Ref.current)
          l2Ref.current.style.transform = `translateY(${y * 0.3}px)`
        if (l3Ref.current)
          l3Ref.current.style.transform = `translateY(${y * (mobile ? 0.5 : 0.6)}px)`
        if (l4Ref.current)
          l4Ref.current.style.transform = mobile ? `translateY(${y * 0.7}px)` : 'none'
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const scrollToContent = useCallback(() => {
    const target = document.getElementById('tour-list-intro')
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

  return (
    <header ref={headerRef} className="tour-header">
      {/* Layer 3 — Background */}
      <div ref={l3Ref} className="header-layer layer-3">
        <picture>
          <source srcSet={l3m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l3d} alt="" loading="eager" decoding="async" />
        </picture>
      </div>

      {/* Layer 4 — Deep Background (mobile only) */}
      <div ref={l4Ref} className="header-layer layer-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l4m} alt="" loading="eager" decoding="async" />
      </div>

      {/* Layer 2 — Midground */}
      <div ref={l2Ref} className="header-layer layer-2">
        <picture>
          <source srcSet={l2m} media="(max-width: 991px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l2d} alt="" loading="eager" decoding="async" />
        </picture>
      </div>

      {/* Title text layer */}
      <div ref={titleRef} className="header-text-layer">
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
