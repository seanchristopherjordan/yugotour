import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { revalidateReviews, revalidateReviewsDelete } from './hooks/revalidateReviews'
import { BoldFeature, FixedToolbarFeature, InlineToolbarFeature, ParagraphFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'reviewerName',
    defaultColumns: ['reviewerName', 'city', 'rating', 'publishedAt'],
    group: 'Site',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateReviews],
    afterDelete: [revalidateReviewsDelete],
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'google',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'TripAdvisor', value: 'tripadvisor' },
      ],
      admin: {
        description: 'Platform this review was sourced from',
      },
    },
    {
      name: 'city',
      type: 'select',
      required: true,
      options: [
        { label: 'Belgrade', value: 'belgrade' },
        { label: 'Sarajevo', value: 'sarajevo' },
      ],
    },
    {
      name: 'reviewerName',
      type: 'text',
      required: true,
    },
    {
      name: 'reviewerAvatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo — downloaded from Google during sync',
      },
    },
    {
      name: 'reviewerAvatarUrl',
      type: 'text',
      admin: {
        description: 'Source URL from Google — used by sync to detect changes (do not edit manually)',
        position: 'sidebar',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'reviewText',
      type: 'textarea',
      admin: {
        description: 'Plain text review body — used for Google reviews.',
        condition: (data) => !data?.source || data?.source === 'google',
      },
    },
    {
      name: 'reviewTextRich',
      type: 'richText',
      label: 'Review Text',
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          BoldFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Rich text review body — supports bold and line breaks. Used for TripAdvisor reviews.',
        condition: (data) => data?.source === 'tripadvisor',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
    },
    {
      name: 'googleReviewId',
      type: 'text',
      admin: {
        description: 'Auto-populated by sync — do not edit manually',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
