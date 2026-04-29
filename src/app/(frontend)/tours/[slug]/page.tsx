import type { Metadata } from 'next'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media, Tour } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { TourDetailHeader } from '@/components/TourDetailHeader'
import { TourFullBleedImage } from '@/components/TourFullBleedImage'
import { SimulatorSection } from '@/components/SimulatorSection'
import { getMediaUrl } from '@/lib/getMediaUrl'
import { getSimulatorAssets } from '@/lib/getSimulatorAssets'

// Cast a Payload media relationship to a URL string
function mediaUrl(field: number | Media | null | undefined): string | null {
  if (!field || typeof field === 'number') return null
  return (field as Media).url ?? null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const tours = await payload.find({
    collection: 'tours',
    draft: false,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })
  return tours.docs.map(({ slug }) => ({ slug: slug ?? '' })).filter((p) => p.slug)
}

type Args = { params: Promise<{ slug?: string }> }

export default async function TourPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = `/tours/${slug}`
  const tour = await queryTourBySlug({ slug })

  if (!tour) return <PayloadRedirects url={url} />

  const [talesTextureUrl, sim] = await Promise.all([
    getMediaUrl('texture-gold.webp'),
    getSimulatorAssets(),
  ])

  // Typing note: mapEmbedUrl and fullBleedImage are new fields not yet in
  // payload-types.ts — cast to access them safely until types are regenerated.
  type TourExtended = Tour & {
    mapEmbedUrl?: string | null
    fullBleedImage?: number | Media | null
  }
  const t = tour as TourExtended

  const headerDesktopUrl = mediaUrl(t.headerDesktop)
  const headerMobileUrl  = mediaUrl(t.headerMobile)
  const fullBleedUrl     = mediaUrl(t.fullBleedImage)
  const mapEmbedUrl      = t.mapEmbedUrl ?? null

  const includesList = t.includes
    ? t.includes.split('\n').map((s) => s.trim()).filter(Boolean)
    : []

  const steps = (t.steps ?? []) as Array<{
    id?: string | null
    title: string
    description?: DefaultTypedEditorState | null
    photo?: number | Media | null
  }>

  const bookingHref = t.tourId ? `/booking?tourId=${t.tourId}` : '/booking'

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────── */}
      <TourDetailHeader
        city={t.city as 'belgrade' | 'sarajevo'}
        title={t.title}
        lede={t.lede}
        desktopUrl={headerDesktopUrl}
        mobileUrl={headerMobileUrl}
      />

      {/* ── Info bar ────────────────────────────────────────────── */}
      <div className="tour-page-info-bar">
        <div className="container tour-page-info-inner">
          <div className="tour-page-info-details">
            {t.duration && (
              <span className="tour-page-info-item">
                <span className="tour-page-info-label">Duration</span>
                <span className="tour-page-info-value">{t.duration}</span>
              </span>
            )}
            {t.priceGroup != null && (
              <span className="tour-page-info-item">
                <span className="tour-page-info-label">Group (per person)</span>
                <span className="tour-page-info-value">{t.priceGroup}€</span>
              </span>
            )}
            {t.priceSolo != null && (
              <span className="tour-page-info-item">
                <span className="tour-page-info-label">Solo (per person)</span>
                <span className="tour-page-info-value">{t.priceSolo}€</span>
              </span>
            )}
            {includesList.length > 0 && (
              <span className="tour-page-info-item tour-page-info-includes">
                <span className="tour-page-info-label">Includes</span>
                <span className="tour-page-info-value">{includesList.join(' · ')}</span>
              </span>
            )}
          </div>
          <Link href={bookingHref} className="tour-book-btn tour-book-btn--bar">
            Book this Tour →
          </Link>
        </div>
      </div>

      {/* ── Body: intro + steps ─────────────────────────────────── */}
      <section className="tour-page-body">
        <div className="container">
          {t.introText && (
            <div className="tour-page-intro">
              <RichText
                data={t.introText as DefaultTypedEditorState}
                enableGutter={false}
                enableProse={false}
              />
            </div>
          )}

          {steps.length > 0 && (
            <div className="tour-steps">
              {steps.map((step, i) => {
                const photoUrl = mediaUrl(step.photo)
                const isImageLeft = i % 2 === 1
                return (
                  <div
                    key={step.id ?? i}
                    className={`tour-step${isImageLeft ? ' image-left' : ''}`}
                  >
                    <div className="tour-step-text">
                      <h2 className="tour-step-title">{step.title}</h2>
                      {step.description && (
                        <div className="tour-step-description">
                          <RichText
                            data={step.description}
                            enableGutter={false}
                            enableProse={false}
                          />
                        </div>
                      )}
                    </div>
                    {photoUrl && (
                      <div className="tour-step-image-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl}
                          alt={step.title}
                          className="tour-step-img"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Full-bleed parallax image ────────────────────────────── */}
      {fullBleedUrl && <TourFullBleedImage imageUrl={fullBleedUrl} />}

      {/* ── Tour map ────────────────────────────────────────────── */}
      {mapEmbedUrl && (
        <section className="tour-map-section">
          <div className="container">
            <h2 className="tour-map-heading">Tour Map</h2>
          </div>
          <div className="tour-map-iframe-outer">
            <div className="tour-map-iframe-wrap">
              <iframe
                src={mapEmbedUrl}
                title={`${t.title} map`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
          <div className="container tour-map-book-wrap">
            <Link href={bookingHref} className="tour-book-btn">
              Book this Tour →
            </Link>
          </div>
        </section>
      )}

      {/* ── Simulator / TV section ──────────────────────────────── */}
      <SimulatorSection {...sim} />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const tour = await queryTourBySlug({ slug })
  if (!tour) return {}
  return {
    title: `${tour.title} — Yugotour`,
    description: tour.lede ?? undefined,
    openGraph: {
      title: `${tour.title} — Yugotour`,
      description: tour.lede ?? undefined,
    },
  }
}

const queryTourBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'tours',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] ?? null
})
