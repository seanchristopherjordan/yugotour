import type { Block } from 'payload'

export const ImageCarouselBlock: Block = {
  slug: 'imageCarousel',
  interfaceName: 'ImageCarouselBlock',
  labels: { singular: 'Image Slider', plural: 'Image Sliders' },
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
