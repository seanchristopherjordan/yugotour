'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useBookingModal } from '@/providers/BookingModal'

interface FloatingBookNowProps {
  imageUrl: string | null
}

export function FloatingBookNow({ imageUrl }: FloatingBookNowProps) {
  const { open } = useBookingModal()
  const pathname = usePathname()
  const [navHidden, setNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const isTourPage = pathname.startsWith('/tours/')

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      requestAnimationFrame(() => {
        const currentY = window.scrollY
        if (Math.abs(currentY - lastScrollY.current) < 10) {
          ticking.current = false
          return
        }
        setNavHidden(currentY > lastScrollY.current && currentY > 100)
        lastScrollY.current = currentY
        ticking.current = false
      })
      ticking.current = true
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`book-now-fab${navHidden && !isTourPage ? ' book-now-fab--visible' : ''}`}
      onClick={() => open()}
      aria-label="Book now"
    >
      <span className="book-now-fab-inner">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Book now" width={80} height={80} />
        ) : (
          <span className="book-now-fab-fallback">BOOK<br />NOW</span>
        )}
      </span>
    </button>
  )
}
