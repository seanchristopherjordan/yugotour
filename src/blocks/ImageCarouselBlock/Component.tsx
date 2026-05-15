import { ImageSliderBlock } from '@/blocks/ImageSlider/Component'
import { getSliderById } from '@/lib/getSlider'
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
    sliderDoc = await getSliderById(Number(slider))
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
