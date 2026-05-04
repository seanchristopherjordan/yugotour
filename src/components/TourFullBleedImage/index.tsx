'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface TourFullBleedImageProps {
  imageUrl: string
  alt?: string
}

export function TourFullBleedImage({ imageUrl, alt = '' }: TourFullBleedImageProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // 2× parallax range (±16%). Inner div is 160% tall so no gaps appear at edges.
  const imgY = useTransform(scrollYProgress, [0, 1], ['16%', '-16%'])

  return (
    <section ref={sectionRef} className="tour-full-bleed">
      <motion.div className="tour-full-bleed-inner" style={{ y: imgY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={alt} className="tour-full-bleed-img" loading="lazy" />
      </motion.div>
    </section>
  )
}
