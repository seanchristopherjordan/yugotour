import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import type { Slider } from '@/payload-types'

const payloadPromise = getPayload({ config: configPromise })

export const getSliderById = unstable_cache(
  async (id: number): Promise<Slider | null> => {
    const payload = await payloadPromise
    try {
      const doc = await payload.findByID({ collection: 'sliders', id, depth: 1 })
      return (doc as Slider) ?? null
    } catch {
      return null
    }
  },
  ['slider-by-id'],
  { tags: ['sliders'] },
)
