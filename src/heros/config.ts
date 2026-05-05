import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
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
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    // pageHero fields
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
      label: 'Background Image',
      admin: {
        condition: (_, { type } = {}) => type === 'pageHero',
        description: 'Full-bleed background image. Landscape orientation recommended.',
      },
    },
    {
      name: 'heroImageMobile',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image (Mobile)',
      admin: {
        condition: (_, { type } = {}) => type === 'pageHero',
        description: 'Optional portrait crop for mobile. Falls back to the desktop image if not set.',
      },
    },
  ],
  label: false,
}
