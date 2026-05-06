import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contactBlock',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Contact Us',
    },
    {
      name: 'lede',
      type: 'textarea',
      label: 'Lede Text',
      defaultValue:
        "Questions about a tour, a booking, or something else? Drop us a line and we'll get back to you as soon as we can.",
    },
  ],
}
