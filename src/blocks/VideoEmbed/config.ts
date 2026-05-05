import type { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  interfaceName: 'VideoEmbedBlock',
  labels: { singular: 'Video Embed', plural: 'Video Embeds' },
  fields: [
    {
      name: 'youtubeUrl',
      type: 'text',
      required: true,
      label: 'YouTube URL',
      admin: {
        description: 'Paste a YouTube video URL (e.g. https://www.youtube.com/watch?v=abc123)',
      },
    },
    {
      name: 'position',
      type: 'select',
      label: 'Position',
      defaultValue: 'full',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Float Left (text flows right)', value: 'left' },
        { label: 'Float Right (text flows left)', value: 'right' },
      ],
      admin: {
        description: 'On mobile, videos are always full-width regardless of this setting.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption (optional)',
    },
  ],
}
