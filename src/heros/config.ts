import type { Field } from 'payload'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'pageHero',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Page Hero',
          value: 'pageHero',
        },
      ],
      required: true,
    },
    {
      name: 'heroHeadline',
      type: 'text',
      label: 'Headline',
      admin: {
        condition: (_, { type } = {}) => type === 'pageHero',
        description: 'Displayed in all-caps Tungsten Compressed across the header.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image (Desktop)',
      required: true,
      admin: {
        condition: (_, { type } = {}) => type === 'pageHero',
        description: 'Full-bleed desktop background. Landscape orientation recommended.',
      },
    },
    {
      name: 'heroImageMobile',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image (Mobile)',
      required: true,
      admin: {
        condition: (_, { type } = {}) => type === 'pageHero',
        description: 'Portrait crop for mobile devices.',
      },
    },
  ],
  label: false,
}
