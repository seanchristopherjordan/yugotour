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
  ],
}
