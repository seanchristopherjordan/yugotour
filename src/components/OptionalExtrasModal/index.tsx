'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface OptionalExtraItem {
  id?: string | null
  title: string
  priceGroup?: string | null
  priceSolo?: string | null
  descriptionHtml?: string | null
  imageUrl?: string | null
}

interface Props {
  tourTitle: string
  extras: OptionalExtraItem[]
  infoIconUrl: string | null
}

function isAirportExtra(title: string) {
  return title.toLowerCase().includes('airport')
}

function formatPrice(extra: OptionalExtraItem): string {
  if (isAirportExtra(extra.title)) {
    return extra.priceGroup ? `€${extra.priceGroup} per car` : ''
  }
  const group = extra.priceGroup?.trim()
  const solo = extra.priceSolo?.trim()
  if (group && solo) return `€${group} pp / €${solo} single`
  if (group) return `€${group}`
  if (solo) return `€${solo}`
  return ''
}

export function OptionalExtrasSection({ tourTitle, extras, infoIconUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsOpen(true)
    document.body.classList.add('modal-active')
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    document.body.classList.remove('modal-active')
    document.body.style.overflow = ''
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeModal])

  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-active')
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="tour-ibar-item tour-ibar-item--extras">
      <span className="tour-ibar-label">Optional Extras</span>
      <ul className="tour-ibar-list">
        {extras.map((ex, i) => (
          <li key={ex.id ?? i}>{ex.title}</li>
        ))}
      </ul>

      {/* Info icon — absolute top-right of this section */}
      <button
        type="button"
        className="opt-extras-info-btn"
        onClick={openModal}
        aria-label="View Optional Extras details"
      >
        {infoIconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={infoIconUrl} alt="" aria-hidden="true" className="opt-extras-info-icon" />
        ) : (
          <span className="opt-extras-info-icon-fallback">i</span>
        )}
      </button>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="opt-extras-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            aria-modal="true"
            role="dialog"
            aria-label="Optional Extras"
          >
            {/* Close — fixed position, stays visible while scrolling */}
            <button
              type="button"
              className="opt-extras-close"
              onClick={closeModal}
              aria-label="Close Optional Extras"
            >
              close <span className="opt-extras-close-x" aria-hidden="true">✕</span>
            </button>

            {/* Scrollable content */}
            <div className="opt-extras-scroll">
              <div className="opt-extras-content">

                {/* Tour name above the heading */}
                <p className="opt-extras-tour-name">{tourTitle}</p>

                {/* Main heading */}
                <h2 className="opt-extras-title">
                  Optional<br />Extras
                </h2>

                {/* Extras */}
                <div className="opt-extras-list">
                  {extras.map((extra, i) => {
                    const price = formatPrice(extra)
                    return (
                      <div key={extra.id ?? i} className="opt-extras-item">
                        <div className="opt-extras-item__text-top">
                          <p className="opt-extras-item__title">{extra.title}</p>
                          {price && <p className="opt-extras-item__price">{price}</p>}
                        </div>

                        {extra.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={extra.imageUrl}
                            alt={extra.title}
                            className="opt-extras-item__image"
                            loading="lazy"
                          />
                        )}

                        {extra.descriptionHtml && (
                          <div
                            className="opt-extras-item__desc"
                            dangerouslySetInnerHTML={{ __html: extra.descriptionHtml }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
