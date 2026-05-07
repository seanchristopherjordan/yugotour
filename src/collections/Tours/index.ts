import type { CollectionConfig, CollectionSlug } from 'payload'
import { slugField } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateTour, revalidateTourDelete } from './hooks/revalidateTour'

const bodyEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'duration', 'priceGroup', 'updatedAt'],
    group: 'Tours',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateTour],
    afterDelete: [revalidateTourDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    // ── Sidebar ──────────────────────────────────────────────────
    {
      name: 'city',
      type: 'select',
      required: true,
      options: [
        { label: 'Belgrade', value: 'belgrade' },
        { label: 'Sarajevo', value: 'sarajevo' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'tourId',
      type: 'number',
      label: 'Tour ID',
      admin: {
        position: 'sidebar',
        description: '1x = Belgrade, 2x = Sarajevo. Used by the booking system.',
      },
    },

    // ── Tabbed content ────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ─── OVERVIEW ───────────────────────────────────────────
        {
          label: 'Overview',
          fields: [
            {
              name: 'lede',
              type: 'textarea',
              label: 'Lede / Tile List Description',
              admin: {
                description:
                  'Short pitch shown on tour listing cards and at the top of the tour page.',
              },
            },
            {
              name: 'duration',
              type: 'text',
              admin: { description: 'e.g. "4 hours" or "6–7 hours"' },
            },
            {
              name: 'priceGroup',
              type: 'number',
              label: 'Price per Person — Group (€)',
            },
            {
              name: 'priceSolo',
              type: 'number',
              label: 'Price per Person — Solo (€)',
            },
            {
              name: 'includes',
              type: 'textarea',
              label: "What's Included",
              admin: {
                description:
                  'One item per line. Rendered as a bulleted list on the tour page.',
              },
            },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              label: 'Google My Maps Embed URL',
              admin: {
                description:
                  'Paste the embed src URL from Google My Maps (Share → Embed on a website → copy the src="…" value).',
              },
            },
          ],
        },

        // ─── CONTENT ─────────────────────────────────────────────
        {
          label: 'Content',
          fields: [
            {
              name: 'introText',
              type: 'richText',
              label: 'Intro / About the Tour',
              editor: bodyEditor,
            },
          ],
        },

        // ─── IMAGES ──────────────────────────────────────────────
        {
          label: 'Images',
          fields: [
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
              label: 'Tour Thumbnail',
              admin: {
                description: 'Used on listing tiles and social sharing.',
              },
            },
            {
              name: 'headerDesktop',
              type: 'upload',
              relationTo: 'media',
              label: 'Header Background — Desktop',
            },
            {
              name: 'headerMobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Header Background — Mobile',
            },
            {
              name: 'fullBleedImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Full-Bleed Parallax Image',
              admin: {
                description:
                  'Wide landscape photo displayed full-bleed between the tour steps and the map. 2:1 aspect ratio (e.g. 2400×1200 px) recommended.',
              },
            },
          ],
        },

        // ─── EXTRAS ──────────────────────────────────────────────
        {
          label: 'Extras',
          fields: [
            {
              name: 'extras',
              type: 'array',
              label: 'Optional Extras',
              admin: {
                description:
                  'Select optional extras available for this tour. Drag rows to reorder. Options are filtered to match the tour\'s city.',
              },
              fields: [
                {
                  name: 'extra',
                  type: 'relationship',
                  relationTo: 'optional-extras' as unknown as CollectionSlug,
                  required: true,
                  filterOptions: ({ data }) => {
                    const city = (data as Record<string, unknown>)?.city
                    if (!city) return true
                    return { city: { equals: city } }
                  },
                },
              ],
            },
          ],
        },

        // ─── STEPS ───────────────────────────────────────────────
        {
          label: 'Steps',
          fields: [
            {
              name: 'steps',
              type: 'array',
              label: 'Tour Steps',
              admin: {
                description:
                  'Itinerary stops displayed on the tour page. Each step has a title, description, and optional photo.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'richText',
                  editor: bodyEditor,
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
      ],
    },

    // ── Slug (auto-generated from title) ─────────────────────────
    slugField(),
  ],
}
