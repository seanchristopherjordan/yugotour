import './full-bleed-static.css'

type MediaRef = { url?: string | null; alt?: string | null } | string | null

interface FullBleedStaticBlockProps {
  image?: MediaRef
  imageMobile?: MediaRef
  caption?: string | null
  disableInnerContainer?: boolean
}

export function FullBleedStaticBlock({ image, imageMobile, caption }: FullBleedStaticBlockProps) {
  const desktopObj = typeof image === 'object' && image !== null ? image : null
  const desktopUrl = desktopObj?.url ?? null

  if (!desktopUrl) return null

  const mobileObj = typeof imageMobile === 'object' && imageMobile !== null ? imageMobile : null
  const mobileUrl = mobileObj?.url ?? null

  return (
    <figure className="full-bleed-static">
      <picture>
        {mobileUrl && (
          <source media="(max-width: 992px)" srcSet={mobileUrl} />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={desktopUrl}
          alt={desktopObj?.alt ?? ''}
          className="full-bleed-static-img"
          loading="lazy"
        />
      </picture>
      {caption && (
        <figcaption className="full-bleed-static-caption container">{caption}</figcaption>
      )}
    </figure>
  )
}
