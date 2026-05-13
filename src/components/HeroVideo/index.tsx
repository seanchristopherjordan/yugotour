'use client'

import { animate, motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useCallback, useState } from 'react'

export interface HeroVideoProps {
  videoUrl: string | null
  mobileVideoUrl: string | null
  mobileH265Url: string | null
  mobileH264Url: string | null
  desktopH265Url: string | null
  desktopH264Url: string | null
  posterDesktopUrl: string | null
  posterMobileUrl: string | null
  logoUrl: string | null
}

export function HeroVideo({
  videoUrl,
  mobileVideoUrl,
  mobileH265Url,
  mobileH264Url,
  desktopH265Url,
  desktopH264Url,
  posterDesktopUrl,
  posterMobileUrl,
  logoUrl,
}: HeroVideoProps) {
  const { scrollY } = useScroll()
  const logoY = useMotionValue(0)
  const logoOpacity = useMotionValue(0)
  const [flickering, setFlickering] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [sourceSet, setSourceSet] = useState<'mobile' | 'desktop' | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasStartedRef = useRef(false)

  // Determine mobile vs desktop once on mount — avoids <source media> which iOS ignores
  useEffect(() => {
    setSourceSet(window.innerWidth < 992 ? 'mobile' : 'desktop')
  }, [])

  // Set up video playback once sources are rendered into the DOM
  useEffect(() => {
    if (sourceSet === null) return

    const video = videoRef.current
    const hasSrc =
      sourceSet === 'mobile'
        ? mobileVideoUrl || mobileH265Url || mobileH264Url
        : videoUrl || desktopH265Url || desktopH264Url

    if (!video || !hasSrc) {
      // No video available — show logo immediately without flicker
      animate(logoOpacity, 1, { duration: 0 })
      return
    }

    // Reload now that <source> elements are in the DOM
    video.load()

    const handleError = () => {
      // All sources failed — show logo without flicker
      animate(logoOpacity, 1, { duration: 0.3, ease: 'easeIn' })
      setVideoFailed(true)
    }

    const startVideo = () => {
      video
        .play()
        .then(() => {
          setFlickering(true)
          hasStartedRef.current = true
        })
        .catch(() => {
          // Autoplay blocked or codec error — show logo without flicker
          animate(logoOpacity, 1, { duration: 0.3, ease: 'easeIn' })
          setVideoFailed(true)
        })
    }

    const isCached = video.readyState >= 3
    const timers: ReturnType<typeof setTimeout>[] = []

    if (isCached) {
      timers.push(
        setTimeout(() => {
          animate(logoOpacity, 1, { duration: 0.3, ease: 'easeIn' })
          startVideo()
        }, 500),
      )
    } else {
      timers.push(
        setTimeout(() => {
          animate(logoOpacity, 1, { duration: 0.7, ease: 'easeIn' })
        }, 1000),
      )
      timers.push(
        setTimeout(() => {
          if (video.readyState >= 3) {
            startVideo()
          } else {
            video.addEventListener('canplay', startVideo, { once: true })
          }
        }, 2200),
      )
    }

    video.addEventListener('error', handleError, { once: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!hasStartedRef.current) return
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(video)

    return () => {
      timers.forEach(clearTimeout)
      video.removeEventListener('canplay', startVideo)
      video.removeEventListener('error', handleError)
      observer.disconnect()
    }
  }, [sourceSet, videoUrl, mobileVideoUrl, mobileH265Url, mobileH264Url, desktopH265Url, desktopH264Url, logoOpacity])

  const scrollToIntro = useCallback(() => {
    const target = document.getElementById('intro-section')
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

  // Mirrors handleHeroLogoParallax from custom-javascript.js (speed: 0.4)
  useMotionValueEvent(scrollY, 'change', (y) => {
    logoY.set(y * 0.4)
  })

  useLayoutEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const update = () => {
      const navMinHeight = window.innerWidth < 992 ? 45 : 42
      const navHeight = Math.max(window.innerHeight * 0.034, navMinHeight)
      el.style.marginTop = '0px'
      const naturalTop = el.getBoundingClientRect().top + window.scrollY
      el.style.marginTop = `${Math.max(0, navHeight - naturalTop)}px`
      el.style.height = `calc(100svh - ${navHeight}px)`
    }

    update()

    const observer = new ResizeObserver(update)
    const adminBar = document.querySelector('.admin-bar')
    if (adminBar) observer.observe(adminBar)

    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const poster =
    sourceSet === 'mobile'
      ? (posterMobileUrl ?? posterDesktopUrl ?? undefined)
      : (posterDesktopUrl ?? undefined)

  return (
    <section
      ref={sectionRef}
      id="hero-video-module"
      className="relative w-full overflow-hidden bg-black"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {(videoUrl || mobileVideoUrl || mobileH265Url || mobileH264Url || desktopH265Url || desktopH264Url) ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            poster={poster}
            className="block w-full h-full object-cover z-[1]"
            style={{ transform: 'scale(1.01)' }}
          >
            {/* Sources injected only once we know the viewport — avoids iOS ignoring <source media> */}
            {sourceSet === 'mobile' && (
              <>
                {mobileVideoUrl && <source src={mobileVideoUrl} type="video/webm" />}
                {mobileH265Url && <source src={mobileH265Url} type='video/mp4; codecs="hvc1"' />}
                {mobileH264Url && <source src={mobileH264Url} type="video/mp4" />}
              </>
            )}
            {sourceSet === 'desktop' && (
              <>
                {videoUrl && <source src={videoUrl} type="video/webm" />}
                {desktopH265Url && <source src={desktopH265Url} type='video/mp4; codecs="hvc1"' />}
                {desktopH264Url && <source src={desktopH264Url} type="video/mp4" />}
              </>
            )}
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

      {/* Logo overlay — parallax wrapper; flicker+jitter only while video is playing */}
      {logoUrl && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ y: logoY, opacity: logoOpacity, willChange: 'transform' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="YugoTour"
            className={`yugo-logo-base h-auto${flickering ? ' yugo-logo-flicker' : ''}`}
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
