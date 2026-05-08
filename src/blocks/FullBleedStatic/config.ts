import type { Block } from 'payload'

export const FullBleedStatic: Block = {
  slug: 'fullBleedStatic',
  interfaceName: 'FullBleedStaticBlock',
  labels: { singular: 'Full-Bleed Image (Static)', plural: 'Full-Bleed Images (Static)' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image (Desktop)',
    },
    {
      name: 'imageMobile',
      type: 'upload',
      relationTo: 'media',
      label: 'Image (Mobile, optional — falls back to desktop)',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption (optional)',
    },
  ],
}
