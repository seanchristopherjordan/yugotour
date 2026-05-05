import type { Block } from 'payload'

export const FullBleedParallax: Block = {
  slug: 'fullBleedParallax',
  interfaceName: 'FullBleedParallaxBlock',
  labels: { singular: 'Full-Bleed Image (Parallax)', plural: 'Full-Bleed Images (Parallax)' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
      admin: {
        description: 'Landscape image recommended. Will scroll with a parallax effect.',
      },
    },
  ],
}
