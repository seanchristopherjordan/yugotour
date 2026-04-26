import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

const cityFields = (label: string) => [
  {
    name: 'instagram',
    type: 'text' as const,
    label: `${label} Instagram URL`,
    admin: { placeholder: 'https://instagram.com/yugotour_belgrade' },
  },
  {
    name: 'facebook',
    type: 'text' as const,
    label: `${label} Facebook URL`,
    admin: { placeholder: 'https://facebook.com/yugotourbelgrade' },
  },
  {
    name: 'tripadvisor',
    type: 'text' as const,
    label: `${label} TripAdvisor URL`,
    admin: { placeholder: 'https://tripadvisor.com/...' },
  },
  {
    name: 'googleReviews',
    type: 'text' as const,
    label: `${label} Google Reviews URL`,
    admin: { placeholder: 'https://g.page/r/...' },
  },
  {
    name: 'address',
    type: 'textarea' as const,
    label: 'Street Address',
    admin: { placeholder: 'Knez Mihailova 10\nBelgrade, Serbia' },
  },
  {
    name: 'phone',
    type: 'text' as const,
    label: 'Phone',
    admin: { placeholder: '+381 11 000 0000' },
  },
  {
    name: 'email',
    type: 'email' as const,
    label: 'Email',
  },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Global links, contact info, and social profiles used across the header, footer, and megamenu.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Belgrade',
          name: 'belgrade',
          fields: cityFields('Belgrade'),
        },
        {
          label: 'Sarajevo',
          name: 'sarajevo',
          fields: cityFields('Sarajevo'),
        },
        {
          label: 'Site & Media',
          name: 'site',
          fields: [
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: 'Recommended: 32×32 .ico or 64×64 .png',
              },
            },
            {
              name: 'youtubeVideoUrl',
              type: 'text',
              label: 'Homepage TV — YouTube URL',
              admin: {
                placeholder: 'https://www.youtube.com/watch?v=...',
                description: 'The video that plays inside the vintage TV on the homepage.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
