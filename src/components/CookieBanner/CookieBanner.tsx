'use client'

import { useEffect, useState } from 'react'
import './cookie-banner.css'

const STORAGE_KEY = 'yugotour-cookies-accepted'

interface CookieBannerProps {
  kolaciUrl: string | null
}

export function CookieBanner({ kolaciUrl }: CookieBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setMounted(true), 2000)
    return () => clearTimeout(t)
  }, [])

  function dismiss(value: '1' | '0') {
    localStorage.setItem(STORAGE_KEY, value)
    setLeaving(true)
    setTimeout(() => setMounted(false), 480)
  }

  if (!mounted) return null

  return (
    <div className={`cookie-wrapper${leaving ? ' cookie-wrapper--out' : ''}`}>
      <div className="cookie-card">

        {kolaciUrl && (
          <div className="cookie-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={kolaciUrl} alt="" aria-hidden="true" />
          </div>
        )}

        <div className="cookie-content">
          <p className="cookie-heading">This site uses keksići.</p>

          <div className="cookie-buttons">
            <button className="cookie-btn" onClick={() => dismiss('0')}>Reject</button>
            <button className="cookie-btn" onClick={() => dismiss('1')}>Accept</button>
          </div>
        </div>

      </div>
    </div>
  )
}
