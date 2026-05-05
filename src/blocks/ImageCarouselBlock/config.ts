import type { Block } from 'payload'

export const ImageCarouselBlock: Block = {
  slug: 'imageCarousel',
  interfaceName: 'ImageCarouselBlock',
  labels: { singular: 'Image Carousel', plural: 'Image Carousels' },
  fields: [
    {
      name: 'slider',
      type: 'relationship',
      relationTo: 'sliders',
      required: true,
      label: 'Slider',
      admin: {
        description: 'Select a pre-configured slider from the Sliders collection.',
      },
    },
  ],
}
