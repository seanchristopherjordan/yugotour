'use client'

import { useEffect, useRef } from 'react'
import './parallax-header.css'

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
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    let current = 0
    let rafId: number

    const tick = () => {
      const target = Math.min(window.scrollY, 1200)
      current += (target - current) * 0.15
      header.style.setProperty('--ph-scroll', current.toFixed(2))
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const imgBase = 'w-full h-full object-cover object-top block min-[992px]:h-auto'

  return (
    <header
      ref={headerRef}
      className="relative w-full overflow-hidden bg-[#FCF9EB] z-10 h-screen min-[992px]:h-auto min-[992px]:[aspect-ratio:2400/762]"
    >
      {/* Layer 3 — background (z-1 both breakpoints) */}
      <div className="parallax-layer parallax-l3 z-[1]">
        <picture>
          {layer3.mobileUrl && (
            <source srcSet={layer3.mobileUrl} media="(max-width: 991px)" />
          )}
          <img className={imgBase} src={layer3.url} alt={layer3.alt} />
        </picture>
      </div>

      {/* Layer 4 — mobile-only deep background (hidden on desktop) */}
      {layer4 && (
        <div className="parallax-layer parallax-l4 z-[1] min-[992px]:hidden">
          <img
            className={imgBase}
            src={layer4.mobileUrl ?? layer4.url}
            alt={layer4.alt}
          />
        </div>
      )}

      {/* Layer 2 — midground (z-4 mobile / z-2 desktop) */}
      <div className="parallax-layer parallax-l2 z-[4] min-[992px]:z-[2]">
        <picture>
          {layer2.mobileUrl && (
            <source srcSet={layer2.mobileUrl} media="(max-width: 991px)" />
          )}
          <img className={imgBase} src={layer2.url} alt={layer2.url} />
        </picture>
      </div>

      {/* Text layer — z-3, sandwiched between layers 2 and 1 */}
      <div
        className="parallax-title absolute left-0 w-full z-[3] flex pointer-events-none
          top-[22%] justify-center
          min-[992px]:top-[17%] min-[992px]:items-start min-[992px]:justify-start"
      >
        <div className="w-full flex justify-center min-[992px]:justify-start min-[992px]:pl-[max(12vw,100px)] min-[992px]:pr-[15px]">
          <h1
            className="m-0 uppercase text-[#FCF9EB] font-zipper
              text-[31vw] leading-[0.78] break-words w-[90vw] p-0
              flex flex-col items-center text-center
              min-[992px]:text-[clamp(9rem,12vw,23rem)] min-[992px]:leading-[0.9]
              min-[992px]:tracking-[-0.01em] min-[992px]:whitespace-nowrap
              min-[992px]:inline-block min-[992px]:w-auto min-[992px]:text-left"
            style={{ textShadow: '0 0 6px rgba(0,0,0,0.05), 0 0 3px rgba(0,0,0,0.05)' }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Layer 1 — foreground, no parallax (z-5 mobile / z-4 desktop) */}
      <div className="parallax-layer z-[5] min-[992px]:z-[4]">
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
