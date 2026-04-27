import type { Block } from 'payload'

export const ReviewsSection: Block = {
  slug: 'reviewsSection',
  interfaceName: 'ReviewsSectionBlock',
  labels: {
    singular: 'Reviews Section',
    plural: 'Reviews Sections',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Admin Label',
      admin: {
        description: 'Internal label to identify this block (e.g. "Homepage Reviews")',
      },
    },
  ],
}
