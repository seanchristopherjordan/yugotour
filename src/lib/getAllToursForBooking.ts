import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export interface BookingTour {
  id: string | number
  title: string
  tourId: number | null
  city: 'belgrade' | 'sarajevo'
  priceGroup: number | null
  priceSolo: number | null
  duration: string | null
  includes: string | null
  extras: Array<{
    id?: string | null
    title: string
    priceGroup?: string | null
    priceSolo?: string | null
  }>
}

type RawExtraRef = {
  id?: string | null
  extra?:
    | {
        id?: number | string | null
        title?: string | null
        priceGroup?: string | null
        priceSolo?: string | null
      }
    | number
    | null
}

export const getAllToursForBooking = unstable_cache(
  async (): Promise<BookingTour[]> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'tours',
      draft: false,
      limit: 500,
      depth: 1, // resolve the optional-extras relationship inside extras[]
      pagination: false,
    })
    return result.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const rawExtras = (d.extras ?? []) as RawExtraRef[]
      return {
        id: doc.id,
        title: doc.title as string,
        tourId: (d.tourId as number) ?? null,
        city: d.city as 'belgrade' | 'sarajevo',
        priceGroup: (d.priceGroup as number) ?? null,
        priceSolo: (d.priceSolo as number) ?? null,
        duration: (d.duration as string) ?? null,
        includes: (d.includes as string) ?? null,
        extras: rawExtras
          .map((item) => {
            const ex = typeof item.extra === 'object' && item.extra !== null ? item.extra : null
            if (!ex || !ex.title) return null
            return {
              id: ex.id != null ? String(ex.id) : null,
              title: ex.title,
              priceGroup: ex.priceGroup ?? null,
              priceSolo: ex.priceSolo ?? null,
            }
          })
          .filter((e): e is NonNullable<typeof e> => e !== null),
      }
    })
  },
  ['booking-tours'],
  { tags: ['tours'] },
)
