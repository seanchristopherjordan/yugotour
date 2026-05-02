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

export const getAllToursForBooking = unstable_cache(
  async (): Promise<BookingTour[]> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'tours',
      draft: false,
      limit: 500,
      pagination: false,
    })
    return result.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      return {
        id: doc.id,
        title: doc.title as string,
        tourId: (d.tourId as number) ?? null,
        city: d.city as 'belgrade' | 'sarajevo',
        priceGroup: (d.priceGroup as number) ?? null,
        priceSolo: (d.priceSolo as number) ?? null,
        duration: (d.duration as string) ?? null,
        includes: (d.includes as string) ?? null,
        extras: (d.extras ?? []) as BookingTour['extras'],
      }
    })
  },
  ['booking-tours'],
  { tags: ['tours'] },
)
