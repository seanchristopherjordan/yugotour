import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

const descriptionEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const OptionalExtras: CollectionConfig = {
  slug: 'optional-extras',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'priceGroup', 'priceSolo'],
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
      name: 'priceGroup',
      type: 'text',
      label: 'Price — Group / PP',
      admin: {
        description: 'Numeric only, e.g. "15". For Airport extras, enter the per-car rate here.',
        width: '50%',
      },
    },
    {
      name: 'priceSolo',
      type: 'text',
      label: 'Price — Solo / Single',
      admin: { width: '50%' },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      editor: descriptionEditor,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    },
  ],
}
