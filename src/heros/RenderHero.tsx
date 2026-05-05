import React from 'react'

import type { Page } from '@/payload-types'

import { PageHeader } from '@/components/PageHeader'

export const RenderHero: React.FC<Page['hero']> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heroData = props as any
  const { type } = heroData || {}

  if (!type || type === 'none') return null

  if (type === 'pageHero') {
    return (
      <PageHeader
        heroHeadline={heroData.heroHeadline}
        heroImage={heroData.heroImage}
        heroImageMobile={heroData.heroImageMobile}
      />
    )
  }

  return null
}
