import './page-header.css'

interface PageHeaderProps {
  heroHeadline?: string | null
  heroImage?: { url?: string | null; alt?: string | null } | string | null
  heroImageMobile?: { url?: string | null; alt?: string | null } | string | null
}

export function PageHeader({ heroHeadline, heroImage, heroImageMobile }: PageHeaderProps) {
  const desktopImageObj = typeof heroImage === 'object' && heroImage !== null ? heroImage : null
  const mobileImageObj =
    typeof heroImageMobile === 'object' && heroImageMobile !== null ? heroImageMobile : null

  const desktopUrl = desktopImageObj?.url ?? null
  const mobileUrl = mobileImageObj?.url ?? desktopUrl

  return (
    <header className="page-header">
      {desktopUrl && (
        <>
          {mobileUrl && mobileUrl !== desktopUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mobileUrl}
              alt=""
              aria-hidden="true"
              className="page-header-bg page-header-bg--mobile"
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={desktopUrl}
            alt=""
            aria-hidden="true"
            className={`page-header-bg${mobileUrl && mobileUrl !== desktopUrl ? ' page-header-bg--desktop' : ''}`}
          />
        </>
      )}
      <div className="container page-header-content">
        {heroHeadline && <h1 className="page-header-headline">{heroHeadline}</h1>}
      </div>
    </header>
  )
}
