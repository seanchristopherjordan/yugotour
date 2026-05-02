'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useBookingModal } from '@/providers/BookingModal'

interface FloatingBookNowProps {
  imageUrl: string | null
}

export function FloatingBookNow({ imageUrl }: FloatingBookNowProps) {
  const { open } = useBookingModal()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isTourPage = pathname.startsWith('/tours/')

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 0)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <button
      type="button"
      className={`book-now-fab${scrolled && !isTourPage ? ' book-now-fab--scrolled' : ''}`}
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
