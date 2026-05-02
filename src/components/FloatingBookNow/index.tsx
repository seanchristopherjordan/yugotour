'use client'

import { useBookingModal } from '@/providers/BookingModal'

interface FloatingBookNowProps {
  imageUrl: string | null
}

export function FloatingBookNow({ imageUrl }: FloatingBookNowProps) {
  const { open } = useBookingModal()
  if (!imageUrl) return null
  return (
    <button
      type="button"
      className="book-now-fab"
      onClick={() => open()}
      aria-label="Book now"
    >
      <span className="book-now-fab-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Book now" width={80} height={80} />
      </span>
    </button>
  )
}
