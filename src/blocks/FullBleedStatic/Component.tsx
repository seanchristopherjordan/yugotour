import './full-bleed-static.css'

interface FullBleedStaticBlockProps {
  image?: { url?: string | null; alt?: string | null } | string | null
  caption?: string | null
  disableInnerContainer?: boolean
}

export function FullBleedStaticBlock({ image, caption }: FullBleedStaticBlockProps) {
  const imageObj = typeof image === 'object' && image !== null ? image : null
  const imageUrl = imageObj?.url ?? null

  if (!imageUrl) return null

  return (
    <figure className="full-bleed-static">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={imageObj?.alt ?? ''}
        className="full-bleed-static-img"
        loading="lazy"
      />
      {caption && (
        <figcaption className="full-bleed-static-caption container">{caption}</figcaption>
      )}
    </figure>
  )
}
