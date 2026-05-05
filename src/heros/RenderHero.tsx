import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { PageHeader } from '@/components/PageHeader'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

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

  const HeroToRender = heroes[type as keyof typeof heroes]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
