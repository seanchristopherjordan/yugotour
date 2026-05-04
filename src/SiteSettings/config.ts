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
          label: 'Booking',
          name: 'booking',
          fields: [
            {
              name: 'tourTimeStart',
              type: 'text' as const,
              label: 'Tour Start Time — Earliest',
              defaultValue: '09:00',
              admin: {
                description: '24h HH:MM format. First option in the "Preferred Start Time" dropdown.',
                placeholder: '09:00',
              },
            },
            {
              name: 'tourTimeEnd',
              type: 'text' as const,
              label: 'Tour Start Time — Latest',
              defaultValue: '17:00',
              admin: {
                description: '24h HH:MM format. Last option in the "Preferred Start Time" dropdown.',
                placeholder: '17:00',
              },
            },
            {
              name: 'airportTimeStart',
              type: 'text' as const,
              label: 'Airport Transfer Time — Earliest',
              defaultValue: '08:00',
              admin: {
                description: '24h HH:MM format. First option in airport transfer time dropdowns.',
                placeholder: '08:00',
              },
            },
            {
              name: 'airportTimeEnd',
              type: 'text' as const,
              label: 'Airport Transfer Time — Latest',
              defaultValue: '20:00',
              admin: {
                description: '24h HH:MM format. Last option in airport transfer time dropdowns.',
                placeholder: '20:00',
              },
            },
            {
              name: 'successLine1',
              type: 'textarea' as const,
              label: 'Booking Success — Confirmation Message',
              defaultValue: 'The Marshal of Yugoslavia is pleased to confirm receipt of your booking request.',
              admin: {
                description: 'First paragraph shown on the booking success screen.',
              },
            },
            {
              name: 'successLine2',
              type: 'textarea' as const,
              label: 'Booking Success — Follow-up Message',
              defaultValue: "We'll be in touch via email to firm up the details. Thank you for booking with Yugotour! <i>Ajmo!</i>",
              admin: {
                description: 'Second paragraph on the success screen. Basic HTML tags like <i> are supported.',
              },
            },
          ],
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
