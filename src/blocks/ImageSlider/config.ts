import type { Block } from 'payload'

export const ImageSlider: Block = {
  slug: 'imageSlider',
  interfaceName: 'ImageSliderBlock',
  labels: {
    singular: 'Image Slider',
    plural: 'Image Sliders',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Admin Label',
      admin: {
        description: 'Internal label to identify this slider (e.g. "Homepage Carousel")',
      },
    },
    {
      name: 'mobileImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 10,
      required: true,
      label: 'Mobile Images (portrait · 700 × 1100 px)',
      admin: {
        description: 'Shown on screens narrower than 992 px. Upload portrait-oriented photos.',
      },
    },
    {
      name: 'desktopImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 10,
      required: true,
      label: 'Desktop Images (landscape · 1200 × 750 px)',
      admin: {
        description: 'Shown on screens 992 px and wider. Upload landscape-oriented photos.',
      },
    },
  ],
}
