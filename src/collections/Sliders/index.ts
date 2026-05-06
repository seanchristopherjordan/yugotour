import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateSlider, revalidateSliderDelete } from './hooks/revalidateSlider'

export const Sliders: CollectionConfig = {
  slug: 'sliders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    group: 'Collections',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateSlider],
    afterDelete: [revalidateSliderDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name (e.g. "Homepage Slider", "Belgrade Slider")',
      },
    },
    {
      name: 'mobileImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 12,
      label: 'Mobile Images',
      admin: {
        description: 'Shown on mobile (< 992 px). Portrait orientation recommended (700 × 1100 px).',
      },
    },
    {
      name: 'desktopImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 12,
      label: 'Desktop Images',
      admin: {
        description: 'Shown on desktop (≥ 992 px). Landscape orientation recommended (1200 × 750 px).',
      },
    },
  ],
}
