'use client'

import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'

export interface HeroVideoProps {
  videoUrl: string | null
  posterUrl: string | null
  logoUrl: string | null
}

export function HeroVideo({ videoUrl, posterUrl, logoUrl }: HeroVideoProps) {
  const { scrollY } = useScroll()
  const logoY = useMotionValue(0)

  // Mirrors handleHeroLogoParallax from custom-javascript.js (speed: 0.4)
  useMotionValueEvent(scrollY, 'change', (y) => {
    logoY.set(y * 0.4)
  })

  return (
    <section
      id="hero-video-module"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '100svh' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Video */}
        {videoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl ?? undefined}
            className="block w-full h-full object-cover z-[1]"
            style={{ transform: 'scale(1.01)' }}
          >
            <source src={videoUrl} type="video/webm" />
            {posterUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={posterUrl} alt="YugoTour Hero" />
            )}
          </video>
        )}

        {/* Logo overlay — parallax container, animation on img child */}
        {logoUrl && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            style={{ y: logoY }}
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
      </div>
    </section>
  )
}
