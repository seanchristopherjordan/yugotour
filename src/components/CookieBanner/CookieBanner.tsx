'use client'

import { useEffect, useState } from 'react'
import './cookie-banner.css'

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
    <div className="cookie-wrapper">
      <div className="cookie-card">

        {/* Kolaci image — left column, clips at card border-radius via overflow:hidden */}
        {kolaciUrl && (
          <div className="cookie-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={kolaciUrl} alt="" aria-hidden="true" />
          </div>
        )}

        {/* Content */}
        <div className="cookie-content">
          <p className="cookie-heading">This site uses kolači.</p>

          <div className="cookie-buttons">
            {/* Manage — left */}
            <button className="cookie-btn">Manage</button>
            {/* Accept — right */}
            <button className="cookie-btn" onClick={accept}>Accept</button>
          </div>
        </div>

      </div>
    </div>
  )
}
