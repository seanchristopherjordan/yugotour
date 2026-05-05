import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'FAQBlock',
  labels: { singular: 'FAQ Section', plural: 'FAQ Sections' },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Admin Label',
      admin: {
        description: 'Internal label only — not shown on the frontend.',
      },
    },
  ],
}
