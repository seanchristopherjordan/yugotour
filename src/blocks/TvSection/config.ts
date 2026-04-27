import type { Block } from 'payload'

export const TvSection: Block = {
  slug: 'tvSection',
  interfaceName: 'TvSectionBlock',
  labels: {
    singular: 'TV Section',
    plural: 'TV Sections',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Admin Label',
      admin: {
        description: 'Internal label to identify this block (e.g. "Homepage TV")',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube Video URL',
      required: true,
      admin: {
        description:
          'Paste any YouTube URL — watch URL (youtube.com/watch?v=…) or short URL (youtu.be/…).',
      },
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Mobile TV Image (portrait WebP)',
      admin: {
        description:
          'TV overlay shown on screens narrower than 992 px. Must have a transparent screen area.',
      },
    },
    {
      name: 'desktopImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Desktop TV Image (landscape WebP)',
      admin: {
        description:
          'TV overlay shown on screens 992 px and wider. Must have a transparent screen area.',
      },
    },
  ],
}
