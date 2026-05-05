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
      label: 'Image',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption (optional)',
    },
  ],
}
