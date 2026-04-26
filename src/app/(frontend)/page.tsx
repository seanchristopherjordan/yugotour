import type { Metadata } from 'next'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HeroVideoServer } from '@/components/HeroVideo/Component'
import { IntroSectionServer } from '@/components/IntroSection/Component'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const page = await queryHomePage()

  return (
    <>
      <PayloadRedirects disableNotFound url="/" />
      {draft && <LivePreviewListener />}

      {/* Hero video — full bleed, sits behind the fixed nav, no top offset */}
      <HeroVideoServer />

      {/* Intro section — cream, spomentik parallax, cars image */}
      <IntroSectionServer />

      {/* Page blocks — no pt since they start right after the 100svh hero */}
      {page?.layout && (
        <main className="pb-24">
          <RenderBlocks blocks={page.layout} />
        </main>
      )}
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryHomePage()
  return generateMeta({ doc: page })
}

const queryHomePage = cache(async (): Promise<RequiredDataFromCollectionSlug<'pages'> | null> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: 'home' } },
  })

  return result.docs?.[0] ?? null
})
