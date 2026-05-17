import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

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
  fields: [
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
      required: true,
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
