import type { Metadata } from 'next'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HeroVideoServer } from '@/components/HeroVideo/Component'
import { IntroSectionServer } from '@/components/IntroSection/Component'
import { CityPickerServer } from '@/components/CityPicker/Component'
import { ImageSliderBlock } from '@/blocks/ImageSlider/Component'
import { getCachedGlobal } from '@/utilities/getGlobals'

type SliderDoc = {
  id: number
  mobileImages?: (number | Media)[] | null
  desktopImages?: (number | Media)[] | null
}

function resolveSliderImages(images?: (number | Media)[] | null): Media[] {
  if (!images) return []
  return images.filter((img): img is Media => typeof img !== 'number' && img !== null)
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const [page, siteSettings] = await Promise.all([
    queryHomePage(),
    getCachedGlobal('site-settings', 1)(),
  ])

  const site = (siteSettings as typeof siteSettings & { homepageSlider?: number | SliderDoc | null }).site
  const sliderDoc = site?.homepageSlider && typeof site.homepageSlider === 'object'
    ? (site.homepageSlider as SliderDoc)
    : null

  const sliderMobile  = resolveSliderImages(sliderDoc?.mobileImages)
  const sliderDesktop = resolveSliderImages(sliderDoc?.desktopImages)
  const hasSlider     = sliderMobile.length > 0 || sliderDesktop.length > 0

  return (
    <>
      <PayloadRedirects disableNotFound url="/" />
      {draft && <LivePreviewListener />}

      {/* Hero video — full bleed, sits behind the fixed nav, no top offset */}
      <HeroVideoServer />

      {/* Intro section — cream, spomentik parallax, cars image */}
      <IntroSectionServer />

      {/* City picker — Yugoslavia map with pulsing Belgrade / Sarajevo signs */}
      <CityPickerServer />

      {/* Homepage slider — managed via Sliders collection in site settings */}
      {hasSlider && (
        <ImageSliderBlock
          blockType="imageSlider"
          mobileImages={sliderMobile}
          desktopImages={sliderDesktop}
        />
      )}

      {/* Page blocks — remaining layout blocks (TV section, etc.) */}
      {page?.layout && (
        <main>
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
