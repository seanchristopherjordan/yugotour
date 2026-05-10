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

type SliderDoc = {
  id: number
  mobileImages?: (number | Media)[] | null
  desktopImages?: (number | Media)[] | null
}

function resolveSliderImages(images?: (number | Media)[] | null): Media[] {
  if (!images) return []
  return images.filter((img): img is Media => typeof img !== 'number' && img !== null)
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

  const [pageResult, toursResult, orderResult, sim] = await Promise.all([
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
    getSimulatorAssets(),
  ])
  const talesTextureUrl = '/textures/texture-gold.webp'

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
    slider?: number | SliderDoc | null
    showTales?: boolean | null
    showSimulator?: boolean | null
  }

  const sliderDoc  = p?.slider && typeof p.slider === 'object' ? (p.slider as SliderDoc) : null
  const sliderMobile  = resolveSliderImages(sliderDoc?.mobileImages)
  const sliderDesktop = resolveSliderImages(sliderDoc?.desktopImages)
  const hasSlider     = sliderMobile.length > 0 || sliderDesktop.length > 0

  const showTales    = p?.showTales    !== false
  const showSim      = false // disabled for isolation testing

  return (
    <>
      <TourListHeader
        title={page?.title ?? 'Belgrade Tours'}
        city="belgrade"
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

      {hasSlider && (
        <ImageSliderBlock
          blockType="imageSlider"
          mobileImages={sliderMobile}
          desktopImages={sliderDesktop}
        />
      )}

      {showTales && (
        <TalesFromTheRoad textureUrl={talesTextureUrl} city="belgrade" />
      )}

      {showSim && <SimulatorSection {...sim} />}
    </>
  )
}
