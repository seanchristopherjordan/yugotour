'use client'

import { useBookingModal } from '@/providers/BookingModal'

interface BookNowButtonProps {
  payloadId: string
  city: 'belgrade' | 'sarajevo'
  className?: string
  children: React.ReactNode
}

export function BookNowButton({ payloadId, city, className, children }: BookNowButtonProps) {
  const { open } = useBookingModal()
  return (
    <button
      type="button"
      className={className}
      onClick={() => open({ payloadId, city })}
    >
      {children}
    </button>
  )
}
