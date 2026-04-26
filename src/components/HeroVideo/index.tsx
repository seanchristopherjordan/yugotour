'use client'

import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef } from 'react'

export interface HeroVideoProps {
  videoUrl: string | null
  posterUrl: string | null
  logoUrl: string | null
}

export function HeroVideo({ videoUrl, posterUrl, logoUrl }: HeroVideoProps) {
  const { scrollY } = useScroll()
  const logoY = useMotionValue(0)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return
    const tryPlay = () => { video.play().catch(() => {}) }
    video.addEventListener('canplay', tryPlay, { once: true })
    tryPlay()
    return () => video.removeEventListener('canplay', tryPlay)
  }, [videoUrl])

  // Mirrors handleHeroLogoParallax from custom-javascript.js (speed: 0.4)
  useMotionValueEvent(scrollY, 'change', (y) => {
    logoY.set(y * 0.4)
  })

  // Position the section flush with the nav bottom regardless of what
  // in-flow elements sit above it (e.g. Payload AdminBar when logged in).
  // The AdminBar uses an async auth check, so we also watch it via
  // ResizeObserver in case it appears after initial mount.
  useLayoutEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const update = () => {
      // nav: height 3.4vh, min-height 50px mobile / 42px desktop (≥992px)
      const navMinHeight = window.innerWidth < 992 ? 50 : 42
      const navHeight = Math.max(window.innerHeight * 0.034, navMinHeight)
      // Temporarily zero our margin to read the natural flow offset
      // (= AdminBar height when logged in, 0 otherwise)
      el.style.marginTop = '0px'
      const naturalTop = el.getBoundingClientRect().top
      el.style.marginTop = `${Math.max(0, navHeight - naturalTop)}px`
      el.style.height = `calc(100svh - ${navHeight}px)`
    }

    update()

    // Re-run when the AdminBar appears/disappears (auth is async)
    const observer = new ResizeObserver(update)
    const adminBar = document.querySelector('.admin-bar')
    if (adminBar) observer.observe(adminBar)

    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero-video-module"
      className="relative w-full overflow-hidden bg-black"
    >
      {/* Video fill */}
      <div className="absolute inset-0 flex items-center justify-center">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={posterUrl ?? undefined}
            className="block w-full h-full object-cover z-[1]"
            style={{ transform: 'scale(1.01)' }}
          />
        ) : posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt="YugoTour Hero"
            className="block w-full h-full object-cover z-[1]"
          />
        ) : null}
      </div>

      {/* Logo overlay — parallax on the wrapper, flicker+jitter on the img */}
      {logoUrl && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ y: logoY, willChange: 'transform' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="YugoTour"
            className="yugo-logo-flicker h-auto"
            style={{ mixBlendMode: 'screen' }}
          />
        </motion.div>
      )}
    </section>
  )
}
