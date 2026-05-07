'use client'

interface TourDetailHeaderProps {
  city: 'belgrade' | 'sarajevo'
  title: string
  lede?: string | null
  desktopUrl?: string | null
  mobileUrl?: string | null
}

export function TourDetailHeader({
  city,
  title,
  lede,
  desktopUrl,
  mobileUrl,
}: TourDetailHeaderProps) {
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1)
  const hasBg     = desktopUrl || mobileUrl

  return (
    <section className="tour-page-header">
      {hasBg && (
        <div className="tour-page-header-bg">
          <picture>
            {desktopUrl && <source srcSet={desktopUrl} media="(min-width: 992px)" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mobileUrl ?? desktopUrl ?? ''} alt="" aria-hidden="true" loading="eager" fetchPriority="high" />
          </picture>
        </div>
      )}

      <div className="tour-page-header-overlay" />

      <div className="tour-page-header-content">
        <div className="container">
          <div className="tour-page-header-text">
            <span className="tour-page-badge">{cityLabel}</span>
            <h1 className="tour-page-title">{title}</h1>
            {lede && <p className="tour-page-lede">{lede}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
