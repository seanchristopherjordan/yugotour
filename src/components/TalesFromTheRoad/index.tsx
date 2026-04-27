'use client'

import Script from 'next/script'

const BELGRADE_WIDGET_ID = '019d5f672eff751aaabdf254da1d85f411f4'
const SARAJEVO_WIDGET_ID = '019d5feef4297bba973ed40b64c5f91f4cad'

export interface TalesFromTheRoadProps {
  textureUrl: string | null
}

export function TalesFromTheRoad({ textureUrl }: TalesFromTheRoadProps) {
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
        <h2
          className="font-cooper text-yugo-cream mb-[30px] leading-[1.1]"
          style={{ fontSize: 'clamp(3.8rem, 6vw, 5.5rem)' }}
        >
          Tales From the Road
        </h2>

        {/* Belgrade reviews */}
        <div>
          <h3 className="font-grotesk font-medium text-[1.5rem] tracking-[0.6em] uppercase text-black/50 mb-0">
            Belgrade
          </h3>
          <div className="w-full max-w-[1320px] mx-auto">
            <div id={`JFWebsiteWidget-${BELGRADE_WIDGET_ID}`} />
            <Script
              id="jotform-belgrade"
              src={`https://www.jotform.com/website-widgets/embed/${BELGRADE_WIDGET_ID}`}
              strategy="afterInteractive"
            />
          </div>
        </div>

        {/* Sarajevo reviews */}
        <div>
          <h3 className="font-grotesk font-medium text-[1.5rem] tracking-[0.6em] uppercase text-black/50 mb-0">
            Sarajevo
          </h3>
          <div className="w-full max-w-[1320px] mx-auto">
            <div id={`JFWebsiteWidget-${SARAJEVO_WIDGET_ID}`} />
            <Script
              id="jotform-sarajevo"
              src={`https://www.jotform.com/website-widgets/embed/${SARAJEVO_WIDGET_ID}`}
              strategy="afterInteractive"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
