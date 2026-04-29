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

  // Image drifts upward by 16% of the inner div's height as section scrolls through viewport
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section ref={sectionRef} className="tour-full-bleed">
      <motion.div className="tour-full-bleed-inner" style={{ y: imgY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={alt} className="tour-full-bleed-img" />
      </motion.div>
    </section>
  )
}
