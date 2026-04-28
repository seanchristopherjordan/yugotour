import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

const bodyEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const TourListPages: CollectionConfig = {
  slug: 'tour-list-pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'updatedAt'],
    group: 'Tours',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Displayed in the parallax header (e.g. "Belgrade Tours")' },
    },
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
      type: 'tabs',
      tabs: [
        {
          label: 'Intro',
          fields: [
            {
              name: 'introHeaderBlack',
              type: 'text',
              label: 'Intro Headline — Black Part',
            },
            {
              name: 'introHeaderRed',
              type: 'text',
              label: 'Intro Headline — Red Part',
            },
            {
              name: 'introBodyText',
              type: 'richText',
              label: 'Intro Body Text',
              editor: bodyEditor,
            },
          ],
        },
        {
          label: 'Header Images',
          fields: [
            {
              name: 'layer1Desktop',
              type: 'upload',
              relationTo: 'media',
              label: 'Layer 1 — Desktop (Foreground, no parallax)',
            },
            {
              name: 'layer2Desktop',
              type: 'upload',
              relationTo: 'media',
              label: 'Layer 2 — Desktop (Midground, 0.39× parallax)',
            },
            {
              name: 'layer3Desktop',
              type: 'upload',
              relationTo: 'media',
              label: 'Layer 3 — Desktop (Background, 0.6× parallax)',
            },
            {
              name: 'layer1Mobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Layer 1 — Mobile (Foreground, no parallax)',
            },
            {
              name: 'layer2Mobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Layer 2 — Mobile (Architecture, 0.3× parallax)',
            },
            {
              name: 'layer3Mobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Layer 3 — Mobile (Background, 0.5× parallax)',
            },
            {
              name: 'layer4Mobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Layer 4 — Mobile (Deep background, 0.7× parallax, optional)',
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Intro Section Fixed Background Image',
              admin: {
                description:
                  'The frozen right-side background visible throughout the tour list and grid.',
              },
            },
          ],
        },
      ],
    },
  ],
}
