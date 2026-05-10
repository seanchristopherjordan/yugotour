'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import dynamic from 'next/dynamic'
import type { BookingTour } from '@/lib/getAllToursForBooking'

const BookingModal = dynamic(
  () => import('@/components/BookingModal').then((m) => ({ default: m.BookingModal })),
  { ssr: false },
)

export type { BookingTour }

export interface OpenBookingOpts {
  payloadId?: string
  city?: 'belgrade' | 'sarajevo'
}

export interface BookingModalImages {
  headerImage: string | null
  headerImageMobile: string | null
  checkmarkCircle: string | null
  cityBelgrade: string | null
  citySarajevo: string | null
  iconComment: string | null
  iconDate: string | null
  iconEmail: string | null
  iconName: string | null
  iconPhone: string | null
  iconPickup: string | null
  iconTime: string | null
  littleWhiteStar: string | null
  priceTag: string | null
  redStar: string | null
  titoSuccessBadge: string | null
  titoSuccessSpeechBubbleDesktop: string | null
  titoSuccessSpeechBubbleMobile: string | null
}

export interface BookingSuccessContent {
  line1: string
  line2: string
}

export interface BookingTimeSettings {
  tourTimeStart: string
  tourTimeEnd: string
  airportTimeStart: string
  airportTimeEnd: string
}

const DEFAULT_IMAGES: BookingModalImages = {
  headerImage: null, headerImageMobile: null, checkmarkCircle: null,
  cityBelgrade: null, citySarajevo: null,
  iconComment: null, iconDate: null, iconEmail: null, iconName: null, iconPhone: null, iconPickup: null,
  iconTime: null, littleWhiteStar: null, priceTag: null, redStar: null,
  titoSuccessBadge: null, titoSuccessSpeechBubbleDesktop: null, titoSuccessSpeechBubbleMobile: null,
}

const DEFAULT_SUCCESS: BookingSuccessContent = {
  line1: 'The Marshal of Yugoslavia is pleased to confirm receipt of your booking request.',
  line2: "We'll be in touch via email to firm up the details. Thank you for booking with Yugotour! <i>Ajmo!</i>",
}

const DEFAULT_TIME_SETTINGS: BookingTimeSettings = {
  tourTimeStart: '09:00', tourTimeEnd: '17:00',
  airportTimeStart: '08:00', airportTimeEnd: '20:00',
}

interface BookingModalContextValue {
  isOpen: boolean
  open: (opts?: OpenBookingOpts) => void
  close: () => void
  tours: BookingTour[]
  initialOpts: OpenBookingOpts
  textureUrl: string | null
  images: BookingModalImages
  timeSettings: BookingTimeSettings
  successContent: BookingSuccessContent
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null)

export function BookingModalProvider({
  tours,
  textureUrl,
  images = DEFAULT_IMAGES,
  timeSettings = DEFAULT_TIME_SETTINGS,
  successContent = DEFAULT_SUCCESS,
  children,
}: {
  tours: BookingTour[]
  textureUrl: string | null
  images?: BookingModalImages
  timeSettings?: BookingTimeSettings
  successContent?: BookingSuccessContent
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
    <BookingModalContext.Provider value={{ isOpen, open, close, tours, initialOpts, textureUrl, images, timeSettings, successContent }}>
      {children}
      {/* <BookingModal /> — disabled for isolation testing */}
    </BookingModalContext.Provider>
  )
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext)
  if (!ctx) throw new Error('useBookingModal must be used within BookingModalProvider')
  return ctx
}
