import type { Metadata } from 'next'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media, Tour } from '@/payload-types'

import { TourListHeader } from '@/components/TourListHeader'
import { TourTile } from '@/components/TourTile'
import { ImageSliderBlock } from '@/blocks/ImageSlider/Component'
import { TalesFromTheRoad } from '@/components/TalesFromTheRoad'
import { SimulatorSection } from '@/components/SimulatorSection'
import { getMediaUrl } from '@/lib/getMediaUrl'
import { getSimulatorAssets } from '@/lib/getSimulatorAssets'
import RichText from '@/components/RichText'

export const metadata: Metadata = {
  title: 'Belgrade Tours',
  description:
    'Explore socialist Belgrade in a vintage Yugo. Brutalist architecture, Tito history, and scars of war — all from the back seat of a Yugoslav time machine.',
}

function resolveMediaUrl(field: number | Media | null | undefined): string | null {
  if (!field || typeof field !== 'object') return null
  return (field as Media).url ?? null
}

function resolveMediaList(field: unknown): Media[] {
  if (!Array.isArray(field)) return []
  return field.filter((img): img is Media => typeof img !== 'number' && img !== null)
}

const FALLBACK_HEADLINE_BLACK = 'See the Capital of a Country'
const FALLBACK_HEADLINE_RED = 'That No Longer Exists!'

function FallbackBody() {
  return (
    <>
      <p>
        <strong>Belgrade,</strong> the perfect place to travel back to Yugoslavia. Be blown away by
        its <strong>brutalist architecture,</strong> see the <strong>scars of war</strong> from the
        &apos;90s, and trace the footsteps of its former leader{' '}
        <strong>Josip Broz Tito.</strong> All from the back seat of a Yugoslav time machine on
        wheels: the <strong>Zastava!</strong>
      </p>
      <p>
        Tours start at the <strong>Yugotour Headquarters</strong> at Karadjordjeva 11. It&apos;s
        possible to start or end your tour at another location, but if you want to pay by card
        you&apos;ll need to do that back at the HQ. Alternately, you can pay in cash (euros or
        dinars) to your driver directly.
      </p>
    </>
  )
}

export default async function BelgradeToursPage() {
  const payload = await getPayload({ config: configPromise })

  const [pageResult, toursResult, orderResult, talesTextureUrl, sim] = await Promise.all([
    payload.find({
      collection: 'tour-list-pages',
      where: { city: { equals: 'belgrade' } },
      limit: 1,
      depth: 2,
    }),
    payload.find({
      collection: 'tours',
      where: { city: { equals: 'belgrade' } },
      limit: 50,
      depth: 1,
    }),
    payload.findGlobal({ slug: 'tour-order', depth: 1 }),
    getMediaUrl('texture-gold.webp'),
    getSimulatorAssets(),
  ])

  const page = pageResult.docs[0] ?? null
  const allTours = toursResult.docs

  // Order tours according to TourOrder global; unordered tours go last
  const orderedRefs = (orderResult.belgrade ?? []) as { tour: number | Tour; id?: string }[]
  const orderedIds = orderedRefs
    .map(item => (typeof item.tour === 'number' ? item.tour : item.tour?.id))
    .filter((id): id is number => typeof id === 'number')

  const tours = [
    ...orderedIds
      .map(id => allTours.find(t => t.id === id))
      .filter((t): t is Tour => t !== undefined),
    ...allTours.filter(t => !orderedIds.includes(t.id)),
  ]

  const headlineBlack = page?.introHeaderBlack || FALLBACK_HEADLINE_BLACK
  const headlineRed   = page?.introHeaderRed   || FALLBACK_HEADLINE_RED
  const bgUrl =
    resolveMediaUrl(page?.backgroundImage) ??
    '/tour-headers/belgrade-list-page-background.webp'

  const p = page as typeof page & {
    carouselMobileImages?: Media[] | null
    carouselDesktopImages?: Media[] | null
    showTales?: boolean | null
    showSimulator?: boolean | null
  }

  const hasCarousel =
    (resolveMediaList(p?.carouselMobileImages).length > 0) ||
    (resolveMediaList(p?.carouselDesktopImages).length > 0)

  const showTales    = p?.showTales    !== false
  const showSim      = p?.showSimulator !== false

  return (
    <>
      <TourListHeader
        title={page?.title ?? 'Belgrade Tours'}
        city="belgrade"
        layer1DesktopUrl={resolveMediaUrl(page?.layer1Desktop)}
        layer2DesktopUrl={resolveMediaUrl(page?.layer2Desktop)}
        layer3DesktopUrl={resolveMediaUrl(page?.layer3Desktop)}
        layer1MobileUrl={resolveMediaUrl(page?.layer1Mobile)}
        layer2MobileUrl={resolveMediaUrl(page?.layer2Mobile)}
        layer3MobileUrl={resolveMediaUrl(page?.layer3Mobile)}
        layer4MobileUrl={resolveMediaUrl(page?.layer4Mobile)}
      />

      <section
        id="tour-list-intro"
        className="tour-intro-section belgrade"
        style={{ '--tour-bg': `url('${bgUrl}')` } as React.CSSProperties}
      >
        <div className="container relative z-10">
          <div className="w-full min-[992px]:w-2/3">
            <h1 className="intro-headline">
              <span className="part-black">{headlineBlack}</span>
              {' '}
              <span className="part-red">{headlineRed}</span>
            </h1>

            <div className="intro-copy-rich">
              {page?.introBodyText ? (
                <RichText
                  data={page.introBodyText as Parameters<typeof RichText>[0]['data']}
                  enableGutter={false}
                  enableProse={false}
                />
              ) : (
                <FallbackBody />
              )}
            </div>
          </div>

          <section className="tour-grid">
            {tours.map((tour) => (
              <TourTile key={tour.id} tour={tour} />
            ))}
            {tours.length === 0 && (
              <p className="font-fakt text-yugo-black col-span-2">
                No tours found for Belgrade yet. Check back soon!
              </p>
            )}
          </section>
        </div>
      </section>

      {hasCarousel && (
        <ImageSliderBlock
          blockType="imageSlider"
          mobileImages={resolveMediaList(p?.carouselMobileImages)}
          desktopImages={resolveMediaList(p?.carouselDesktopImages)}
        />
      )}

      {showTales && (
        <TalesFromTheRoad textureUrl={talesTextureUrl} city="belgrade" />
      )}

      {showSim && <SimulatorSection {...sim} />}
    </>
  )
}
