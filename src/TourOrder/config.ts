import type { GlobalConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateTourOrder } from './hooks/revalidateTourOrder'

export const TourOrder: GlobalConfig = {
  slug: 'tour-order',
  hooks: {
    afterChange: [revalidateTourOrder],
  },
  admin: {
    group: 'Tours',
    description:
      'Drag rows to set the display order of tours on each city\'s listing page. Only tours added here will appear in the grid — unordered tours go to the bottom.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'belgrade',
      type: 'array',
      label: 'Belgrade Tours — drag to reorder',
      fields: [
        {
          name: 'tour',
          type: 'relationship',
          relationTo: 'tours',
          required: true,
          filterOptions: {
            city: { equals: 'belgrade' },
          },
        },
      ],
    },
    {
      name: 'sarajevo',
      type: 'array',
      label: 'Sarajevo Tours — drag to reorder',
      fields: [
        {
          name: 'tour',
          type: 'relationship',
          relationTo: 'tours',
          required: true,
          filterOptions: {
            city: { equals: 'sarajevo' },
          },
        },
      ],
    },
  ],
}
