import type { Block } from 'payload'
import { textBlockLexical } from '@/fields/textBlockLexical'

export const TextContainer: Block = {
  slug: 'textContainer',
  interfaceName: 'TextContainerBlock',
  labels: { singular: 'Text Container', plural: 'Text Containers' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Body Text',
      editor: textBlockLexical,
      required: true,
    },
    {
      name: 'image',
      type: 'group',
      label: 'Inline Image (optional)',
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
        {
          name: 'position',
          type: 'select',
          label: 'Position',
          defaultValue: 'none',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.media),
          },
          options: [
            { label: 'None', value: 'none' },
            { label: 'Float Left (text flows right)', value: 'left' },
            { label: 'Float Right (text flows left)', value: 'right' },
            { label: 'Full Width (below text)', value: 'full' },
          ],
        },
        {
          name: 'widthPercent',
          type: 'number',
          label: 'Width (%)',
          defaultValue: 42,
          min: 15,
          max: 75,
          admin: {
            description: 'Percentage of the container width the image occupies. Left/Right positions only.',
            condition: (_, siblingData) =>
              siblingData?.position === 'left' || siblingData?.position === 'right',
            step: 1,
          },
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption (optional)',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.media),
          },
        },
      ],
    },
  ],
}
