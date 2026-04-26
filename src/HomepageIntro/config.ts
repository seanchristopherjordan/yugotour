import type { GlobalConfig } from 'payload'
import { revalidateHomepageIntro } from './hooks/revalidateHomepageIntro'

export const HomepageIntro: GlobalConfig = {
  slug: 'homepage-intro',
  label: 'Homepage — Intro Section',
  access: { read: () => true },
  admin: {
    description: 'Text content for the intro section below the hero video.',
  },
  fields: [
    {
      name: 'headlineTop',
      type: 'text',
      label: 'Headline — Line 1 (black)',
      defaultValue: 'YUGOSLAV HISTORY',
      required: true,
    },
    {
      name: 'headlineBottom',
      type: 'text',
      label: 'Headline — Line 2 (red)',
      defaultValue: 'ON FOUR WHEELS!',
      required: true,
    },
    {
      name: 'bodyText',
      type: 'textarea',
      label: 'Body Paragraph',
      defaultValue:
        'Take a legendary ride from the rise to the fall of Yugoslavia, in the capital cities of Bosnia-Hercegovina and Serbia. Feel, hear, and smell the history of the country with a car named after it: The YUGO!',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Button Text',
      defaultValue: 'MORE ABOUT US',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA Button URL',
      defaultValue: '/about-us',
    },
    {
      name: 'howItWorksTitle',
      type: 'text',
      label: '"How It Works" Title',
      defaultValue: 'How it works:',
    },
    {
      name: 'bullet1',
      type: 'text',
      label: 'Bullet 1',
      defaultValue: 'Choose your city & tour',
    },
    {
      name: 'bullet2',
      type: 'text',
      label: 'Bullet 2',
      defaultValue: 'Pick your date & optional extras',
    },
    {
      name: 'bullet3',
      type: 'text',
      label: 'Bullet 3',
      defaultValue: 'Hop in the YUGO & enjoy the ride!',
    },
  ],
  hooks: {
    afterChange: [revalidateHomepageIntro],
  },
}
