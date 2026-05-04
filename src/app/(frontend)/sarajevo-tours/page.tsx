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
  title: 'Sarajevo Tours',
  description:
    "Explore Sarajevo's socialist past in a vintage Yugo. Olympic sites, brutalist blocks, and the scars of the '90s siege — driven in a period-correct Yugoslav car.",
}

function resolveMediaUrl(field: number | Media | null | undefined): string | null {
  if (!field || typeof field !== 'object') return null
  return (field as Media).url ?? null
}

// Mobile layers: medium (900px) — covers retina up to ~450px-wide screens
function resolveMediaMobileUrl(field: number | Media | null | undefined): string | null {
  if (!field || typeof field !== 'object') return null
  const doc = field as Media
  return doc.sizes?.medium?.url ?? doc.url ?? null
}

// Desktop layers: xlarge (1920px) or large (1400px) for full-width parallax images
function resolveMediaDesktopUrl(field: number | Media | null | undefined): string | null {
  if (!field || typeof field !== 'object') return null
  const doc = field as Media
  return doc.sizes?.xlarge?.url ?? doc.sizes?.large?.url ?? doc.url ?? null
}

function resolveMediaList(field: unknown): Media[] {
  if (!Array.isArray(field)) return []
  return field.filter((img): img is Media => typeof img !== 'number' && img !== null)
}

const FALLBACK_HEADLINE_BLACK =
  "EXPLORE THE '84 WINTER OLYMPICS, BRUTALIST ARCHITECTURE, AND SPOMENIKS—"
const FALLBACK_HEADLINE_RED = 'IN A VINTAGE YUGO!'

function FallbackBody() {
  return (
    <>
      <p>
        <strong>Yugotour Sarajevo</strong> guides you through the history, architecture, and pop
        culture of Yugoslavia in an interactive way, driving a vintage YUGO car to the most
        significant socialist-era buildings and sights in Sarajevo and beyond.
      </p>
      <p>
        Our main tour explores <strong>Yugoslav Sarajevo,</strong> host of the &apos;84 Winter
        Olympics and beating heart of <strong>YU-<em>rock</em>.</strong> Our other tours separately
        focus on the <strong>Olympics</strong>, <strong>Brutalist Zenica,</strong> the Second World
        War battles of <strong>Neretva &amp; Sutjeska,</strong> and the{' '}
        <strong>Fall of Yugoslavia.</strong> Hop on board, comrade, as we rock onwards, rock upwards
        across Yugoslavia!
      </p>
    </>
  )
}

export default async function SarajevoToursPage() {
  const payload = await getPayload({ config: configPromise })

  const [pageResult, toursResult, orderResult, talesTextureUrl, sim] = await Promise.all([
    payload.find({
      collection: 'tour-list-pages',
      where: { city: { equals: 'sarajevo' } },
      limit: 1,
      depth: 2,
    }),
    payload.find({
      collection: 'tours',
      where: { city: { equals: 'sarajevo' } },
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
  const orderedRefs = (orderResult.sarajevo ?? []) as { tour: number | Tour; id?: string }[]
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
    '/tour-headers/sarajevo-list-page-background.webp'

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
        title={page?.title ?? 'Sarajevo Tours'}
        city="sarajevo"
        layer1DesktopUrl={resolveMediaDesktopUrl(page?.layer1Desktop)}
        layer2DesktopUrl={resolveMediaDesktopUrl(page?.layer2Desktop)}
        layer3DesktopUrl={resolveMediaDesktopUrl(page?.layer3Desktop)}
        layer1MobileUrl={resolveMediaMobileUrl(page?.layer1Mobile)}
        layer2MobileUrl={resolveMediaMobileUrl(page?.layer2Mobile)}
        layer3MobileUrl={resolveMediaMobileUrl(page?.layer3Mobile)}
        layer4MobileUrl={resolveMediaMobileUrl(page?.layer4Mobile)}
      />

      <section
        id="tour-list-intro"
        className="tour-intro-section sarajevo"
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
                No tours found for Sarajevo yet. Check back soon!
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
        <TalesFromTheRoad textureUrl={talesTextureUrl} city="sarajevo" />
      )}

      {showSim && <SimulatorSection {...sim} />}
    </>
  )
}
