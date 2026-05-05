import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ImageSliderBlock } from '@/blocks/ImageSlider/Component'
import type { Slider } from '@/payload-types'

interface ImageCarouselBlockProps {
  slider?: string | Slider | null
  disableInnerContainer?: boolean
}

export async function ImageCarouselBlockComponent({ slider }: ImageCarouselBlockProps) {
  let sliderDoc: Slider | null = null

  if (typeof slider === 'object' && slider !== null) {
    sliderDoc = slider
  } else if (typeof slider === 'string' && slider) {
    const payload = await getPayload({ config: configPromise })
    sliderDoc = await payload.findByID({ collection: 'sliders', id: slider, depth: 1 })
  }

  if (!sliderDoc) return null

  return (
    <ImageSliderBlock
      blockType="imageSlider"
      mobileImages={sliderDoc.mobileImages}
      desktopImages={sliderDoc.desktopImages}
    />
  )
}
