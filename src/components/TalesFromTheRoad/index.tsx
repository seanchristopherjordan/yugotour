'use client'

import { useEffect } from 'react'

const BELGRADE_WIDGET_ID = '019d5f672eff751aaabdf254da1d85f411f4'
const SARAJEVO_WIDGET_ID = '019d5feef4297bba973ed40b64c5f91f4cad'

export interface TalesFromTheRoadProps {
  textureUrl: string | null
  /** When provided, renders only the reviews widget for that city. */
  city?: 'belgrade' | 'sarajevo'
}

interface CityWidgetProps {
  city: 'belgrade' | 'sarajevo'
  widgetId: string
  showLabel: boolean
}

function CityWidget({ city, widgetId, showLabel }: CityWidgetProps) {
  useEffect(() => {
    const scriptId = `jotform-widget-${widgetId}`
    const containerId = `JFWebsiteWidget-${widgetId}`
    const container = document.getElementById(containerId)
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        // Always remove any existing instance so the script re-runs on SPA navigation
        const existing = document.getElementById(scriptId)
        if (existing) existing.remove()

        const script = document.createElement('script')
        script.id = scriptId
        script.src = `https://www.jotform.com/website-widgets/embed/${widgetId}`
        script.async = true
        document.body.appendChild(script)
      },
      { rootMargin: '200px' },
    )
    observer.observe(container)

    return () => {
      observer.disconnect()
      const s = document.getElementById(scriptId)
      if (s) s.remove()
    }
  }, [widgetId])

  return (
    <div>
      {showLabel && (
        <h3 className="font-grotesk font-medium text-[1.5rem] tracking-[0.6em] uppercase text-black/50 mb-0">
          {city.charAt(0).toUpperCase() + city.slice(1)}
        </h3>
      )}
      <div className="w-full max-w-[1320px] mx-auto">
        <div id={`JFWebsiteWidget-${widgetId}`} />
      </div>
    </div>
  )
}

export function TalesFromTheRoad({ textureUrl, city }: TalesFromTheRoadProps) {
  return (
    <section
      id="tales-from-the-road"
      className="reviews-section-outer relative z-[10] py-[40px] text-center"
      style={{
        backgroundImage: textureUrl ? `url('${textureUrl}')` : undefined,
        backgroundRepeat: 'repeat-y',
        backgroundSize: '100% auto',
        backgroundColor: '#D4AF37',
      }}
    >
      <div className="container">
        <h2 className="tales-section-title">
          Tales From the Road
        </h2>

        {city === 'belgrade' || !city ? (
          <CityWidget
            city="belgrade"
            widgetId={BELGRADE_WIDGET_ID}
            showLabel={!city}
          />
        ) : null}

        {city === 'sarajevo' || !city ? (
          <CityWidget
            city="sarajevo"
            widgetId={SARAJEVO_WIDGET_ID}
            showLabel={!city}
          />
        ) : null}
      </div>
    </section>
  )
}
