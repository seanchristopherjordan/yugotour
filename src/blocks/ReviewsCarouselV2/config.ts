import type { Block } from 'payload'

export const ReviewsCarouselV2: Block = {
  slug: 'reviewsCarouselV2',
  interfaceName: 'ReviewsCarouselV2Block',
  labels: {
    singular: 'Reviews Carousel v2',
    plural: 'Reviews Carousels v2',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Admin Label',
      admin: {
        description: 'Internal label only (e.g. "Homepage Reviews")',
      },
    },
    {
      name: 'city',
      type: 'select',
      required: true,
      defaultValue: 'both',
      options: [
        { label: 'Both Cities', value: 'both' },
        { label: 'Belgrade only', value: 'belgrade' },
        { label: 'Sarajevo only', value: 'sarajevo' },
      ],
      admin: {
        description: 'Which city\'s reviews to display',
      },
    },
    {
      name: 'writeReviewCity',
      type: 'select',
      label: '"Write a Review" button — links to:',
      required: true,
      defaultValue: 'belgrade',
      options: [
        { label: 'Belgrade Google Maps', value: 'belgrade' },
        { label: 'Sarajevo Google Maps', value: 'sarajevo' },
      ],
      admin: {
        condition: (_data, siblingData) => siblingData?.city !== 'both',
        description: 'Only applies in single-city mode — both-city mode uses each city\'s link automatically.',
      },
    },
  ],
}
