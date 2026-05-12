'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import dynamic from 'next/dynamic'

const ContactModal = dynamic(
  () => import('@/components/ContactModal').then((m) => ({ default: m.ContactModal })),
  { ssr: false },
)

export interface ContactModalImages {
  headerImage: string | null
  headerImageMobile: string | null
  iconName: string | null
  iconEmail: string | null
  iconComment: string | null
}

interface ContactModalContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null)

export function ContactModalProvider({
  textureUrl,
  images,
  children,
}: {
  textureUrl: string | null
  images: ContactModalImages
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <ContactModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={close} textureUrl={textureUrl} images={images} />
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext)
  if (!ctx) throw new Error('useContactModal must be used within ContactModalProvider')
  return ctx
}
