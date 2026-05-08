'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'yugotour-cookies-accepted'

interface CookieBannerProps {
  kolaciUrl: string | null
}

export function CookieBanner({ kolaciUrl }: CookieBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  function accept() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  return (
    <div className="fixed z-[9999] bottom-4 right-4 max-[991px]:bottom-0 max-[991px]:left-0 max-[991px]:right-0 max-[991px]:bottom-0">
      <div
        className="flex overflow-hidden"
        style={{
          width: '340px',
          maxWidth: '100%',
          background: '#FCF9EB',
          border: '3px solid #212121',
          borderRadius: '10px',
          boxShadow: 'none',
        }}
      >
        {/* Kolaci image — left-aligned, clips at card border-radius via parent overflow:hidden */}
        {kolaciUrl && (
          <div style={{ width: '115px', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={kolaciUrl}
              alt=""
              aria-hidden="true"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="flex flex-col justify-between"
          style={{ padding: '1.1rem 1.1rem 1.1rem 1rem', flex: 1 }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cooper-bold-condensed)',
              fontSize: '1.35rem',
              color: '#212121',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 1rem 0',
            }}
          >
            This site uses kolaci
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={accept}
              style={{
                fontFamily: 'var(--font-grotesk)',
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '-0.01em',
                lineHeight: 1,
                background: '#212121',
                color: '#FCF9EB',
                border: '1.5px solid #212121',
                borderRadius: '5px',
                padding: '0.5rem 1.1rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Accept
            </button>
            <button
              style={{
                fontFamily: 'var(--font-grotesk)',
                fontWeight: 400,
                fontSize: '0.88rem',
                letterSpacing: '-0.01em',
                background: 'none',
                border: 'none',
                color: '#212121',
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationThickness: '1px',
                textUnderlineOffset: '2px',
                padding: 0,
              }}
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
