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
      name: 'spacing',
      type: 'group',
      label: 'Vertical Spacing',
      admin: { description: 'Override the default top/bottom padding of this block.' },
      fields: [
        {
          name: 'top',
          type: 'select',
          label: 'Top',
          defaultValue: 'standard',
          options: [
            { label: 'Standard (2.5rem)', value: 'standard' },
            { label: 'None', value: 'none' },
            { label: 'Custom', value: 'custom' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'topCustom',
          type: 'number',
          label: 'Custom top (rem)',
          admin: {
            width: '50%',
            step: 0.5,
            condition: (_, siblingData) => siblingData?.top === 'custom',
          },
        },
        {
          name: 'bottom',
          type: 'select',
          label: 'Bottom',
          defaultValue: 'standard',
          options: [
            { label: 'Standard (2.5rem)', value: 'standard' },
            { label: 'None', value: 'none' },
            { label: 'Custom', value: 'custom' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'bottomCustom',
          type: 'number',
          label: 'Custom bottom (rem)',
          admin: {
            width: '50%',
            step: 0.5,
            condition: (_, siblingData) => siblingData?.bottom === 'custom',
          },
        },
      ],
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
