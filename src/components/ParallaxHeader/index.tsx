'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'

export interface ParallaxLayer {
  url: string
  alt: string
  mobileUrl?: string
}

export interface ParallaxHeaderProps {
  title: string
  layer1: ParallaxLayer // foreground — no parallax
  layer2: ParallaxLayer // midground
  layer3: ParallaxLayer // background
  layer4?: ParallaxLayer // mobile-only deep background
}

export function ParallaxHeader({ title, layer1, layer2, layer3, layer4 }: ParallaxHeaderProps) {
  const { scrollY } = useScroll()
  const isMobileRef = useRef(false)

  const titleY = useMotionValue(0)
  const l2Y = useMotionValue(0)
  const l3Y = useMotionValue(0)
  const l4Y = useMotionValue(0)

  useEffect(() => {
    const update = () => {
      isMobileRef.current = window.innerWidth < 992
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const mobile = isMobileRef.current
    const cy = Math.min(y, 1200)

    if (mobile) {
      l2Y.set(cy * 0.3)
      titleY.set(cy * 0.4)
      l3Y.set(cy * 0.5)
      l4Y.set(cy * 0.7)
    } else {
      titleY.set(cy * 0.31)
      l2Y.set(cy * 0.39)
      l3Y.set(cy * 0.6)
    }
  })

  // Shared classes
  const layerBase = 'absolute inset-0 pointer-events-none overflow-hidden'
  const imgBase =
    'w-full h-full object-cover object-top block min-[992px]:h-auto'

  return (
    <header
      className="relative w-full overflow-hidden bg-[#FCF9EB] z-10 h-screen min-[992px]:h-auto min-[992px]:[aspect-ratio:2400/762]"
    >
      {/* Layer 3 — background (z-1 both breakpoints) */}
      <motion.div className={`${layerBase} z-[1]`} style={{ y: l3Y, willChange: 'transform' }}>
        <picture>
          {layer3.mobileUrl && (
            <source srcSet={layer3.mobileUrl} media="(max-width: 991px)" />
          )}
          <img className={imgBase} src={layer3.url} alt={layer3.alt} />
        </picture>
      </motion.div>

      {/* Layer 4 — mobile-only deep background (hidden on desktop) */}
      {layer4 && (
        <motion.div
          className={`${layerBase} z-[1] min-[992px]:hidden`}
          style={{ y: l4Y, willChange: 'transform' }}
        >
          <img
            className={imgBase}
            src={layer4.mobileUrl ?? layer4.url}
            alt={layer4.alt}
          />
        </motion.div>
      )}

      {/* Layer 2 — midground (z-4 mobile / z-2 desktop) */}
      <motion.div
        className={`${layerBase} z-[4] min-[992px]:z-[2]`}
        style={{ y: l2Y, willChange: 'transform' }}
      >
        <picture>
          {layer2.mobileUrl && (
            <source srcSet={layer2.mobileUrl} media="(max-width: 991px)" />
          )}
          <img className={imgBase} src={layer2.url} alt={layer2.alt} />
        </picture>
      </motion.div>

      {/* Text layer — always z-3, sandwiched between layers 2 and 1 */}
      <motion.div
        className="absolute left-0 w-full z-[3] flex pointer-events-none top-[22%] justify-center min-[992px]:top-[17%] min-[992px]:items-start min-[992px]:justify-start"
        style={{ y: titleY, willChange: 'transform' }}
      >
        <div className="w-full flex justify-center min-[992px]:justify-start min-[992px]:pl-[max(12vw,100px)] min-[992px]:pr-[15px]">
          <h1
            className="m-0 uppercase text-[#FCF9EB] font-zipper
              text-[31vw] leading-[0.78] break-words w-[90vw] p-0
              flex flex-col items-center text-center
              min-[992px]:text-[clamp(9rem,12vw,23rem)] min-[992px]:leading-[0.9]
              min-[992px]:tracking-[-0.01em] min-[992px]:whitespace-nowrap
              min-[992px]:inline-block min-[992px]:w-auto min-[992px]:text-left"
            style={{
              textShadow: '0 0 6px rgba(0,0,0,0.05), 0 0 3px rgba(0,0,0,0.05)',
            }}
          >
            {title}
          </h1>
        </div>
      </motion.div>

      {/* Layer 1 — foreground, no parallax (z-5 mobile / z-4 desktop) */}
      <div className={`${layerBase} z-[5] min-[992px]:z-[4]`}>
        <picture>
          {layer1.mobileUrl && (
            <source srcSet={layer1.mobileUrl} media="(max-width: 991px)" />
          )}
          <img className={imgBase} src={layer1.url} alt={layer1.alt} />
        </picture>
      </div>
    </header>
  )
}
