import Link from 'next/link'

export interface CityPickerProps {
  textureUrl: string | null
  starUrl: string | null
  flagRibbonUrl: string | null
  mapUrl: string | null
  mapMobileUrl: string | null
  belgradSignUrl: string | null
  sarajevoSignUrl: string | null
  partizanGirlUrl: string | null
  partizanGirlMobileUrl: string | null
}

export function CityPicker({
  textureUrl,
  starUrl,
  flagRibbonUrl,
  mapUrl,
  mapMobileUrl,
  belgradSignUrl,
  sarajevoSignUrl,
  partizanGirlUrl,
  partizanGirlMobileUrl,
}: CityPickerProps) {
  return (
    <section
      className="relative overflow-hidden pt-[40px] pb-[40px] max-[991px]:pb-[67px]"
      style={{
        backgroundImage: textureUrl ? `url('${textureUrl}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#003882',
      }}
    >
      <div className="container">
        {/* picker-stack-wrapper: 77% centered on desktop, full-width on mobile */}
        <div className="w-[77%] mx-auto relative z-[5] max-[991px]:w-full">

          {/* ── Headline row ── */}
          <div
            className="flex items-center justify-between mb-[12px] w-full relative max-[991px]:flex-col max-[991px]:gap-[5px] max-[991px]:px-[6vw] max-[991px]:mb-[30px]"
          >
            {/* Flanking stars — mobile only, absolutely positioned left + right */}
            {starUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={starUrl}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="block absolute left-[1vw] top-1/2 -translate-y-1/2 w-[12vw] h-auto min-[992px]:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={starUrl}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="block absolute right-[1vw] top-1/2 -translate-y-1/2 w-[12vw] h-auto min-[992px]:hidden"
                />
              </>
            )}

            <h2
              className="font-tungsten uppercase text-yugo-cream m-0 leading-[0.9] max-[991px]:leading-[0.8] max-[991px]:text-center max-[991px]:whitespace-nowrap tracking-[0.02em] max-[991px]:text-[clamp(3.3rem,7vw,5.4rem)] min-[992px]:text-[clamp(2.2rem,4.2vw,4.4rem)]"
            >
              Where to, Comrade?
            </h2>

            {/* Desktop-only star between first and second headline */}
            {starUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={starUrl}
                alt="*"
                aria-hidden="true"
                loading="lazy"
                className="hidden min-[992px]:block w-[45px] h-auto flex-shrink-0"
              />
            )}

            <h2
              className="font-tungsten uppercase text-yugo-cream m-0 leading-[0.9] max-[991px]:leading-[0.8] max-[991px]:text-center max-[991px]:whitespace-nowrap tracking-[0.02em] max-[991px]:text-[clamp(3.3rem,7vw,5.4rem)] min-[992px]:text-[clamp(2.2rem,4.2vw,4.4rem)]"
            >
              Kuda, Druže?
            </h2>

            {/* Desktop-only star between second and third headline */}
            {starUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={starUrl}
                alt="*"
                aria-hidden="true"
                loading="lazy"
                className="hidden min-[992px]:block w-[45px] h-auto flex-shrink-0"
              />
            )}

            <h2
              className="font-steelfish uppercase text-yugo-cream m-0 leading-[0.9] max-[991px]:leading-[0.85] max-[991px]:text-center max-[991px]:whitespace-nowrap tracking-[0.015em] max-[991px]:text-[clamp(2.7rem,6vw,5rem)] min-[992px]:text-[clamp(1.78rem,3.7vw,3.3rem)]"
            >
              Куда, Друже?
            </h2>
          </div>

          {/* ── Flag ribbon — bleeds full viewport width on mobile ── */}
          {flagRibbonUrl && (
            <div className="vw-bleed w-full" style={{ lineHeight: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flagRibbonUrl}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="min-[992px]:rounded-t-[5px]"
                style={{ width: '100%', height: '33px', display: 'block', objectFit: 'fill' }}
              />
            </div>
          )}

          {/* ── Map + pulsing city signs — bleeds full viewport width on mobile ── */}
          <div className="vw-bleed relative w-full">
            <div className="relative w-full" style={{ lineHeight: 0, overflow: 'visible' }}>
              {mapUrl && (
                <picture>
                  {mapMobileUrl && (
                    <source srcSet={mapMobileUrl} media="(max-width: 991px)" />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mapUrl}
                    alt="Yugoslavia Map"
                    loading="lazy"
                    className="min-[992px]:rounded-b-[5px]"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </picture>
              )}

              {/* Belgrade sign — top-right, pulses big→small */}
              {belgradSignUrl && (
                <Link href="/belgrade-tours" className="city-sign-belgrade">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={belgradSignUrl} alt="Belgrade Tours" loading="lazy" />
                </Link>
              )}

              {/* Sarajevo sign — bottom-left, pulses small→big */}
              {sarajevoSignUrl && (
                <Link href="/sarajevo-tours" className="city-sign-sarajevo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sarajevoSignUrl} alt="Sarajevo Tours" loading="lazy" />
                </Link>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Partizan girl — right edge of section, bleeds on mobile */}
      {partizanGirlUrl && (
        <picture className="absolute right-0 bottom-0 w-[23vw] max-w-[400px] z-[15] pointer-events-none max-[991px]:w-[42vw] max-[991px]:right-[-6vw] block">
          {partizanGirlMobileUrl && (
            <source srcSet={partizanGirlMobileUrl} media="(max-width: 991px)" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partizanGirlUrl}
            alt=""
            aria-hidden="true"
            loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </picture>
      )}
    </section>
  )
}
