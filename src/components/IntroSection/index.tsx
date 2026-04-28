'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export interface IntroSectionProps {
  headlineTop: string
  headlineBottom: string
  bodyText: string
  ctaText: string | null
  ctaUrl: string | null
  howItWorksTitle: string | null
  bullets: string[]
  textureUrl: string | null
  textureRedUrl: string | null
  spomentikUrl: string | null
  tripadvisorBadgeUrl: string | null
  carsDesktopUrl: string | null
  carsMobileUrl: string | null
}

export function IntroSection({
  headlineTop,
  headlineBottom,
  bodyText,
  ctaText,
  ctaUrl,
  howItWorksTitle,
  bullets,
  textureUrl,
  textureRedUrl,
  spomentikUrl,
  tripadvisorBadgeUrl,
  carsDesktopUrl,
  carsMobileUrl,
}: IntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Mirrors handleSpomentikParallax from custom-javascript.js:
  // scrollPercent = (distance + vh) / (sectionH + vh)  →  0..1
  // moveAmount = scrollPercent * 33  →  translateY 0% .. -33%
  const spomentikY = useTransform(scrollYProgress, [0, 1], ['0%', '-33%'])

  return (
    <section
      ref={sectionRef}
      id="intro-section"
      className="relative z-[20] overflow-visible bg-yugo-cream py-[20px]"
      style={{
        backgroundImage: textureUrl ? `url('${textureUrl}')` : undefined,
        backgroundSize: 'cover',
      }}
    >
      {/* TripAdvisor badge — straddles the hero/intro border */}
      {tripadvisorBadgeUrl && (
        <div
          className="absolute top-0 right-0 z-[100] flex justify-end pointer-events-none"
          style={{ transform: 'translateY(-50%)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tripadvisorBadgeUrl}
            alt="Tripadvisor Travelers Choice 2025"
            className="h-auto drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)] w-[170px] -mr-[20px] min-[550px]:w-[204px] min-[992px]:w-[240px] min-[992px]:mr-0"
          />
        </div>
      )}

      {/* Spomentik parallax background */}
      {spomentikUrl && (
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src={spomentikUrl}
            alt=""
            className="absolute top-0 right-0 opacity-70"
            style={{ height: '150%', width: 'auto', maxWidth: 'none', y: spomentikY, willChange: 'transform' }}
          />
        </div>
      )}

      {/* All content — above the spomentik */}
      <div className="container relative z-[5]">

        {/* Row 1: headline + body — 9/12-col offset on desktop */}
        <div className="w-full min-[992px]:w-3/4 min-[992px]:ml-[8.333%] mb-[10px] min-[992px]:mb-0">
          {/* Staggered two-line headline */}
          <h2
            className="font-tungsten uppercase pt-[18px] mb-[30px] min-[992px]:mb-[1rem] leading-[0.75] table mx-auto text-left min-[992px]:block min-[992px]:mx-0"
            style={{ transform: 'rotate(-1deg)', transformOrigin: 'left center' }}
          >
            <span
              className="block text-yugo-black"
              style={{ fontSize: 'clamp(6rem, 18vw, 10rem)' }}
            >
              {headlineTop}
            </span>
            <span
              className="block text-yugo-red pl-[12vw] min-[992px]:pl-[92px]"
              style={{ fontSize: 'clamp(6rem, 18vw, 10rem)' }}
            >
              {headlineBottom}
            </span>
          </h2>

          {/* Body text + red CTA pill */}
          <div className="pl-0 min-[992px]:pl-[95px]">
            <p className="font-fakt text-yugo-black leading-[1.4] mb-0 w-full min-[992px]:w-[650px] min-[992px]:max-w-full text-[1.092rem] min-[400px]:text-[1.248rem] min-[992px]:text-[1.2rem]">
              {bodyText}
              {ctaText && ctaUrl && (
                <>
                  {' '}
                  <Link
                    href={ctaUrl}
                    className="inline-block relative top-[-1px] text-yugo-cream no-underline font-bold align-middle transition-[filter] duration-200 ease-in-out hover:brightness-[1.15]"
                    style={{
                      backgroundImage: textureRedUrl ? `url('${textureRedUrl}')` : undefined,
                      backgroundColor: textureRedUrl ? undefined : '#C6363C',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      fontSize: '1rem',
                      letterSpacing: '0.01rem',
                      padding: '0 5px',
                      height: '1.15em',
                      lineHeight: '1.3em',
                    }}
                  >
                    {ctaText} →
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Row 2: Yugo cars — full-width, responsive sizing */}
        {(carsDesktopUrl || carsMobileUrl) && (
          <div className="text-center">
            <picture className="block mx-auto">
              {carsDesktopUrl && (
                <source srcSet={carsDesktopUrl} media="(min-width: 992px)" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={carsMobileUrl ?? carsDesktopUrl ?? ''}
                alt="Yugoslav Cars"
                className="block mx-auto h-auto w-[104%] max-w-full min-[601px]:max-w-[85%] min-[992px]:max-w-[68%]"
              />
            </picture>
          </div>
        )}

        {/* Row 3: How it works — pulled up over the cars on desktop */}
        <div className="w-full min-[992px]:w-3/4 min-[992px]:ml-[8.333%]">
          <div className="mt-[5px] min-[992px]:mt-[-35px] min-[1200px]:mt-[-70px] pb-[10px] pl-0 min-[992px]:pl-[95px] min-[992px]:flex min-[992px]:items-baseline">
            {howItWorksTitle && (
              <p className="font-fakt font-bold text-yugo-black leading-[1.4] text-[1.092rem] min-[400px]:text-[1.248rem] min-[992px]:text-[1.2rem] mb-[0.25rem] min-[992px]:mb-0 min-[992px]:mr-[15px] min-[992px]:flex-shrink-0">
                {howItWorksTitle}
              </p>
            )}
            <ul className="list-none p-0 m-0 min-[992px]:flex-1">
              {bullets.filter(Boolean).map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-center"
                  style={{ marginBottom: 'calc(0.25rem - 4px)' }}
                >
                  <span className="text-yugo-red mr-[6px] leading-none text-[1.1em] flex-shrink-0">
                    {(['❶', '❷', '❸'] as const)[i] ?? '•'}
                  </span>
                  <span className="font-fakt text-yugo-black leading-[1.4] text-[1.092rem] min-[400px]:text-[1.248rem] min-[992px]:text-[1.2rem]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}
