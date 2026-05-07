'use client'

import React, { useCallback, useEffect, useState } from 'react'

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

function parseRawPrice(s: string | null | undefined): number {
  if (!s) return 0
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0
}

function formatPrice(extra: OptionalExtraItem): string {
  if (isAirportExtra(extra.title)) {
    const price = parseRawPrice(extra.priceGroup)
    return price ? `€${price} per car` : ''
  }
  const group = parseRawPrice(extra.priceGroup)
  const solo = parseRawPrice(extra.priceSolo)
  if (group && solo && solo !== group) return `€${group} pp / €${solo} single`
  if (group) return `€${group}`
  if (solo) return `€${solo}`
  return ''
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="flex items-center cursor-pointer bg-transparent border-none p-0 h-[24px] relative group"
    >
      <span className="mr-[8px] font-grotesk text-[1.1rem] max-[991px]:text-[1.3rem] font-light leading-none text-yugo-cream">
        close
      </span>
      <div className="flex flex-col justify-center gap-[6px] w-[22px] max-[991px]:w-[26px] h-[20px] overflow-visible">
        <span
          className="block w-[20px] max-[991px]:w-[24px] h-[2.5px] bg-yugo-cream rounded-[5px] origin-center"
          style={{ transform: 'translateY(4.25px) rotate(45deg)' }}
        />
        <span
          className="block w-[20px] max-[991px]:w-[24px] h-[2.5px] bg-yugo-cream rounded-[5px] origin-center"
          style={{ transform: 'translateY(-4.25px) rotate(-45deg)' }}
        />
      </div>
      <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-yugo-cream transition-[width] duration-300 group-hover:w-full" />
    </button>
  )
}

export function OptionalExtrasSection({ tourTitle, extras, infoIconUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    document.documentElement.classList.toggle('modal-active', isOpen)
    document.body.classList.toggle('modal-active', isOpen)
    return () => {
      document.documentElement.classList.remove('modal-active')
      document.body.classList.remove('modal-active')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeModal])

  return (
    <div className="tour-ibar-item tour-ibar-item--extras">
      <span className="tour-ibar-label">Optional Extras</span>
      <ul className="tour-ibar-list">
        {extras.map((ex, i) => (
          <li key={ex.id ?? i}>{ex.title}</li>
        ))}
      </ul>

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

      {/* Always rendered — toggled via opacity/visibility exactly like the booking modal */}
      <div
        className={[
          'fixed inset-0 z-[10000] flex flex-col',
          'transition-[opacity,visibility] duration-[400ms] ease-[ease]',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
        ].join(' ')}
        style={{
          backgroundImage: "url('/textures/texture-gold.webp')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundColor: '#c9a84c',
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Optional Extras"
      >
        {/* Close bar — mirrors .booking-close-bar height exactly */}
        <div className="opt-extras-close-bar flex-none flex items-center justify-end pr-[20px] min-[992px]:pr-[30px]">
          <CloseButton onClick={closeModal} />
        </div>

        {/* Scrollable content — same flex pattern as booking modal body */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <div className="opt-extras-content">

            <p className="opt-extras-tour-name">{tourTitle}</p>
            <h2 className="opt-extras-title">Optional<br />Extras</h2>

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
      </div>
    </div>
  )
}
