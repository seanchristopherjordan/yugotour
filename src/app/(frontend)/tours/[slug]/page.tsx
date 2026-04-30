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
import { TvSectionBlock, type TvSectionBlockProps } from '@/blocks/TvSection/Component'

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
  const [tour, tvBlock] = await Promise.all([
    queryTourBySlug({ slug }),
    queryTvBlock(),
  ])

  if (!tour) return <PayloadRedirects url={url} />

  type TourExtended = Tour & {
    mapEmbedUrl?: string | null
    fullBleedImage?: number | Media | null
    extras?: Array<{ id?: string | null; title: string; priceGroup?: string | null; priceSolo?: string | null }>
  }
  const t = tour as TourExtended

  const headerDesktopUrl = mediaUrl(t.headerDesktop)
  const headerMobileUrl  = mediaUrl(t.headerMobile)
  const fullBleedUrl     = mediaUrl(t.fullBleedImage)
  const mapEmbedUrl      = t.mapEmbedUrl ?? null

  const includesList = t.includes
    ? t.includes.split('\n').map((s) => s.trim()).filter(Boolean)
    : []

  const extras = (t.extras ?? []) as Array<{
    id?: string | null
    title: string
    priceGroup?: string | null
    priceSolo?: string | null
  }>

  const steps = (t.steps ?? []) as Array<{
    id?: string | null
    title: string
    description?: DefaultTypedEditorState | null
    photo?: number | Media | null
  }>

  const bookingHref = t.tourId ? `/booking?tourId=${t.tourId}` : '/booking'

  return (
    <>
      {/* ── Header (includes info + book button) ─────────────── */}
      <TourDetailHeader
        city={t.city as 'belgrade' | 'sarajevo'}
        title={t.title}
        lede={t.lede}
        desktopUrl={headerDesktopUrl}
        mobileUrl={headerMobileUrl}
        duration={t.duration}
        priceGroup={t.priceGroup}
        priceSolo={t.priceSolo}
        includesList={includesList}
        extras={extras}
        bookingHref={bookingHref}
      />

      {/* ── Body: intro + steps ─────────────────────────────── */}
      <section id="tour-detail-body" className="tour-page-body">
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
                        <img src={photoUrl} alt={step.title} className="tour-step-img" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Tour map (before full-bleed) ────────────────────── */}
      {mapEmbedUrl && (
        <section className="tour-map-section">
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

      {/* ── Full-bleed parallax image (after map) ───────────── */}
      {fullBleedUrl && <TourFullBleedImage imageUrl={fullBleedUrl} />}

      {/* ── Television section ──────────────────────────────── */}
      {tvBlock && <TvSectionBlock {...tvBlock} />}
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

// Fetch the TvSection block from the homepage layout so the tour detail page
// always uses the same TV configuration as the main site.
const queryTvBlock = cache(async (): Promise<TvSectionBlockProps | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 2,
  })
  const layout = (result.docs[0]?.layout ?? []) as Array<
    { blockType: string } & Record<string, unknown>
  >
  const block = layout.find((b) => b.blockType === 'tvSection')
  return block ? (block as unknown as TvSectionBlockProps) : null
})
