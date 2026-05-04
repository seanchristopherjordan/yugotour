'use client'

import { animate, motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useCallback } from 'react'

export interface HeroVideoProps {
  videoUrl: string | null
  mobileVideoUrl: string | null
  posterDesktopUrl: string | null
  posterMobileUrl: string | null
  logoUrl: string | null
}

export function HeroVideo({ videoUrl, mobileVideoUrl, posterDesktopUrl, posterMobileUrl, logoUrl }: HeroVideoProps) {
  const { scrollY } = useScroll()
  const logoY = useMotionValue(0)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || (!videoUrl && !mobileVideoUrl)) return
    const tryPlay = () => { if (video.paused) video.play().catch(() => {}) }
    video.addEventListener('loadeddata', tryPlay, { once: true })
    video.addEventListener('canplay', tryPlay, { once: true })
    tryPlay()
    return () => {
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
    }
  }, [videoUrl, mobileVideoUrl])

  const scrollToIntro = useCallback(() => {
    const target = document.getElementById('intro-section')
    if (!target) return
    const targetY = target.getBoundingClientRect().top + window.scrollY
    const controls = animate(window.scrollY, targetY, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => window.scrollTo(0, v),
    })
    // Cancel programmatic scroll if the user touches or wheels — prevents
    // the animation fighting manual scroll on mobile.
    const cancel = () => controls.stop()
    window.addEventListener('touchstart', cancel, { once: true, passive: true })
    window.addEventListener('wheel', cancel, { once: true, passive: true })
  }, [])

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
      // nav: height 3.4vh, min-height 45px mobile / 42px desktop (≥992px)
      const navMinHeight = window.innerWidth < 992 ? 45 : 42
      const navHeight = Math.max(window.innerHeight * 0.034, navMinHeight)
      // Temporarily zero our margin to read the natural flow offset
      // (= AdminBar height when logged in, 0 otherwise).
      // Use getBoundingClientRect + scrollY to get the absolute document
      // position — getBoundingClientRect alone is viewport-relative and
      // produces a huge wrong value when called mid-scroll (e.g. when
      // the mobile address bar shows/hides and fires a resize event).
      el.style.marginTop = '0px'
      const naturalTop = el.getBoundingClientRect().top + window.scrollY
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
      {/* Video fill — video only loads on desktop (≥992px); mobile shows poster only */}
      <div className="absolute inset-0 flex items-center justify-center">
        {(videoUrl || mobileVideoUrl) ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={posterDesktopUrl ?? undefined}
            className="block w-full h-full object-cover z-[1]"
            style={{ transform: 'scale(1.01)' }}
          >
            {mobileVideoUrl && <source src={mobileVideoUrl} media="(max-width: 991px)" type="video/webm" />}
            {videoUrl && <source src={videoUrl} media="(min-width: 992px)" type="video/webm" />}
          </video>
        ) : (posterDesktopUrl || posterMobileUrl) ? (
          <picture className="block w-full h-full">
            {posterMobileUrl && (
              <source srcSet={posterMobileUrl} media="(max-width: 991px)" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterDesktopUrl ?? posterMobileUrl ?? ''}
              alt="YugoTour Hero"
              className="block w-full h-full object-cover z-[1]"
            />
          </picture>
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
      {/* Scroll-down arrow */}
      <motion.button
        onClick={scrollToIntro}
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 cursor-pointer border-none bg-transparent p-0"
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
