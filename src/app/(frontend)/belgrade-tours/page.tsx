import type { Metadata } from 'next'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media } from '@/payload-types'

import { TourListHeader } from '@/components/TourListHeader'
import { TourTile } from '@/components/TourTile'
import RichText from '@/components/RichText'

export const metadata: Metadata = {
  title: 'Belgrade Tours — Yugotour',
  description:
    'Explore socialist Belgrade in a vintage Yugo. Brutalist architecture, Tito history, and scars of war — all from the back seat of a Yugoslav time machine.',
}

function resolveMediaUrl(field: number | Media | null | undefined): string | null {
  if (!field || typeof field !== 'object') return null
  return (field as Media).url ?? null
}

export default async function BelgradeToursPage() {
  const payload = await getPayload({ config: configPromise })

  const [pageResult, toursResult] = await Promise.all([
    payload.find({
      collection: 'tour-list-pages',
      where: { city: { equals: 'belgrade' } },
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: 'tours',
      where: { city: { equals: 'belgrade' } },
      limit: 50,
      depth: 1,
    }),
  ])

  const page = pageResult.docs[0] ?? null
  const tours = toursResult.docs

  const bgUrl =
    resolveMediaUrl(page?.backgroundImage) ??
    '/tour-headers/belgrade-list-page-background.webp'

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
            {(page?.introHeaderBlack || page?.introHeaderRed) && (
              <h1 className="intro-headline">
                <span className="part-black">{page?.introHeaderBlack}</span>
                {page?.introHeaderRed && (
                  <>{' '}<span className="part-red">{page.introHeaderRed}</span></>
                )}
              </h1>
            )}
            {page?.introBodyText && (
              <div className="intro-copy-rich">
                <RichText
                  data={page.introBodyText as Parameters<typeof RichText>[0]['data']}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            )}
          </div>

          <section className="tour-grid">
            {tours.map((tour) => (
              <TourTile key={tour.id} tour={tour} />
            ))}
            {tours.length === 0 && (
              <p className="font-fakt text-yugo-black">
                No tours found for Belgrade yet. Check back soon!
              </p>
            )}
          </section>
        </div>
      </section>
    </>
  )
}
