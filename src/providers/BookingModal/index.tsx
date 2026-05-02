'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import { BookingModal } from '@/components/BookingModal'
import type { BookingTour } from '@/lib/getAllToursForBooking'

export type { BookingTour }

export interface OpenBookingOpts {
  payloadId?: string
  city?: 'belgrade' | 'sarajevo'
}

interface BookingModalContextValue {
  isOpen: boolean
  open: (opts?: OpenBookingOpts) => void
  close: () => void
  tours: BookingTour[]
  initialOpts: OpenBookingOpts
  textureUrl: string | null
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null)

export function BookingModalProvider({
  tours,
  textureUrl,
  children,
}: {
  tours: BookingTour[]
  textureUrl: string | null
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialOpts, setInitialOpts] = useState<OpenBookingOpts>({})

  const open = useCallback((opts: OpenBookingOpts = {}) => {
    setInitialOpts(opts)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  return (
    <BookingModalContext.Provider value={{ isOpen, open, close, tours, initialOpts, textureUrl }}>
      {children}
      <BookingModal />
    </BookingModalContext.Provider>
  )
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext)
  if (!ctx) throw new Error('useBookingModal must be used within BookingModalProvider')
  return ctx
}
