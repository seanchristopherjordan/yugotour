import Image from 'next/image'
import Link from 'next/link'
import type { Tour } from '@/payload-types'

interface TourTileProps {
  tour: Tour
}

function resolveUrl(field: number | { url?: string | null } | null | undefined): string | null {
  if (!field || typeof field === 'number') return null
  return field.url ?? null
}

export function TourTile({ tour }: TourTileProps) {
  const thumbnailUrl = resolveUrl(tour.thumbnail)
  const href = `/tours/${tour.slug}`

  // Build info-bar details line
  const duration = tour.duration ?? null
  const price = tour.priceGroup != null ? `${tour.priceGroup}€` : null
  const includesText = tour.includes
    ? tour.includes.split('\n').map(s => s.trim()).filter(Boolean).join(', ')
    : null

  return (
    <article className="tour-tile">
      <Link href={href} className="tour-tile-inner">

        {/* Image + title area */}
        <div className="tile-image-wrap">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={tour.title}
              fill
              className="tile-bg-img"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              sizes="(min-width: 992px) 50vw, 100vw"
            />
          ) : (
            <div className="tile-bg-img" style={{ backgroundColor: '#212121' }} />
          )}
          <div className="tile-gradient" />
          <h2 className="tile-title">{tour.title}</h2>
        </div>

        {/* Red info bar */}
        <div className="tile-info-bar">
          {tour.lede && (
            <p className="tile-intro-text">
              {tour.lede}<span className="tile-lede-cta">learn more →</span>
            </p>
          )}

          <div className="tile-info-lines">
            <p className="tile-info-line">
              {duration && <span className="info-val info-val-dark">{duration}</span>}
              {price && (
                <>
                  {duration && <span className="info-sep info-sep-dark">|</span>}
                  <span className="info-val info-val-dark">{price}</span>
                </>
              )}
              {includesText && (
                <>
                  {(duration || price) && <span className="info-sep info-sep-dark">|</span>}
                  <span className="info-val info-val-includes">INCL. {includesText}</span>
                </>
              )}
            </p>
          </div>
        </div>

      </Link>
    </article>
  )
}
