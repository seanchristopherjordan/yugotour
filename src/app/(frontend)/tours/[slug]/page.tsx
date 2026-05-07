import type { Metadata } from 'next'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { Media, Tour } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { TourDetailHeader } from '@/components/TourDetailHeader'
import { TourFullBleedImage } from '@/components/TourFullBleedImage'
import { TvSectionBlock, type TvSectionBlockProps } from '@/blocks/TvSection/Component'
import { BookNowButton } from '@/components/BookNowButton'
import { OptionalExtrasSection, type OptionalExtraItem } from '@/components/OptionalExtrasModal'
import { getMediaUrl } from '@/lib/getMediaUrl'

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

type RawExtraRef = {
  id?: string | null
  extra?:
    | {
        id?: number | string | null
        title?: string | null
        priceGroup?: string | null
        priceSolo?: string | null
        description?: unknown
        image?: number | Media | null
      }
    | number
    | null
}

export default async function TourPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = `/tours/${slug}`
  const [tour, tvBlock, infoIconUrl] = await Promise.all([
    queryTourBySlug({ slug }),
    queryTvBlock(),
    getMediaUrl('information-icon.webp'),
  ])
  const textureCreamUrl = '/textures/texture-cream.webp'

  if (!tour) return <PayloadRedirects url={url} />

  type TourExtended = Omit<Tour, 'extras'> & {
    mapEmbedUrl?: string | null
    fullBleedImage?: number | Media | null
    extras?: RawExtraRef[]
  }
  const t = tour as TourExtended

  const headerDesktopUrl = mediaUrl(t.headerDesktop)
  const headerMobileUrl  = mediaUrl(t.headerMobile)
  const fullBleedUrl     = mediaUrl(t.fullBleedImage)
  const mapEmbedUrl      = t.mapEmbedUrl ?? null

  const includesList = t.includes
    ? t.includes.split('\n').map((s) => s.trim()).filter(Boolean)
    : []

  // Resolve the array-of-relationship extras (depth: 2 populates extra.image too)
  const rawResolvedExtras = await Promise.all(
    (t.extras ?? []).map(async (item) => {
      const ex = typeof item.extra === 'object' && item.extra !== null ? item.extra : null
      if (!ex || typeof ex.title !== 'string') return null
      let descriptionHtml = ''
      if (ex.description) {
        try {
          descriptionHtml = await convertLexicalToHTML({ data: ex.description as never })
        } catch { /* swallow — description is optional */ }
      }
      return {
        id: ex.id != null ? String(ex.id) : null,
        title: ex.title as string,
        priceGroup: ex.priceGroup ?? null,
        priceSolo: ex.priceSolo ?? null,
        descriptionHtml,
        imageUrl: mediaUrl(ex.image),
      }
    }),
  )
  const resolvedExtras = rawResolvedExtras.filter(Boolean) as OptionalExtraItem[]

  const steps = (t.steps ?? []) as Array<{
    id?: string | null
    title: string
    description?: DefaultTypedEditorState | null
    photo?: number | Media | null
  }>

  const tourPayloadId = String(t.id)

  const creamBg = textureCreamUrl
    ? { backgroundImage: `url('${textureCreamUrl}')`, backgroundRepeat: 'repeat' as const }
    : {}

  return (
    <div className="tour-page-root" style={creamBg}>
      {/* ── Header hero (image + badge + title + lede + caret) ── */}
      <TourDetailHeader
        city={t.city as 'belgrade' | 'sarajevo'}
        title={t.title}
        lede={t.lede}
        desktopUrl={headerDesktopUrl}
        mobileUrl={headerMobileUrl}
      />

      {/* ── Info Bar (red texture — duration / price / includes / extras / book) ── */}
      <section id="tour-info-bar" className="tour-info-bar">
        <div className="container">
          <div className="tour-ibar-inner">
            {t.duration && (
              <>
                <div className="tour-ibar-item tour-ibar-item--duration">
                  <span className="tour-ibar-label">Duration</span>
                  <span className="tour-ibar-value">{t.duration}</span>
                </div>
                <div className="tour-ibar-sep" aria-hidden="true" />
              </>
            )}
            {(t.priceGroup != null || t.priceSolo != null) && (
              <>
                <div className="tour-ibar-item tour-ibar-item--price">
                  <span className="tour-ibar-label">Price</span>
                  {t.priceGroup != null && (
                    <span className="tour-ibar-value">
                      €{t.priceGroup} <span className="tour-ibar-sublabel">PP</span>
                    </span>
                  )}
                  {t.priceSolo != null && (
                    <span className="tour-ibar-value">
                      €{t.priceSolo} <span className="tour-ibar-sublabel">SINGLE</span>
                    </span>
                  )}
                </div>
                <div className="tour-ibar-sep" aria-hidden="true" />
              </>
            )}
            {includesList.length > 0 && (
              <>
                <div className="tour-ibar-item tour-ibar-item--includes">
                  <span className="tour-ibar-label">Includes</span>
                  <ul className="tour-ibar-list">
                    {includesList.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                {resolvedExtras.length > 0 && <div className="tour-ibar-sep" aria-hidden="true" />}
              </>
            )}

            {/* Extras column — client component renders label + list + info icon + modal */}
            {resolvedExtras.length > 0 && (
              <OptionalExtrasSection
                tourTitle={t.title}
                extras={resolvedExtras}
                infoIconUrl={infoIconUrl}
              />
            )}

            <div className="tour-ibar-book">
              <BookNowButton
                payloadId={tourPayloadId}
                city={t.city as 'belgrade' | 'sarajevo'}
                className="tour-ibar-book-btn"
              >
                Book This Tour →
              </BookNowButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body: intro + steps ─────────────────────────────── */}
      <section id="tour-detail-body" className="tour-page-body" style={creamBg}>
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
                        <img src={photoUrl} alt={step.title} className="tour-step-img" loading="lazy" />
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
        <section className="tour-map-section" style={creamBg}>
          <div className="container">
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
          </div>
          <div className="container tour-map-book-wrap">
            <BookNowButton
              payloadId={tourPayloadId}
              city={t.city as 'belgrade' | 'sarajevo'}
              className="tour-book-btn"
            >
              Book this Tour →
            </BookNowButton>
          </div>
        </section>
      )}

      {/* ── Full-bleed parallax image (after map) ───────────── */}
      {fullBleedUrl && <TourFullBleedImage imageUrl={fullBleedUrl} />}

      {/* ── Television section ──────────────────────────────── */}
      {tvBlock && <TvSectionBlock {...tvBlock} />}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const tour = await queryTourBySlug({ slug })
  if (!tour) return {}
  return {
    title: tour.title,
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
