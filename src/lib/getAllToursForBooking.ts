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

    const [result, tourOrder] = await Promise.all([
      payload.find({
        collection: 'tours',
        draft: false,
        limit: 500,
        depth: 1, // resolve the optional-extras relationship inside extras[]
        pagination: false,
      }),
      payload.findGlobal({ slug: 'tour-order', depth: 0 }),
    ])

    // Build a position map keyed by tour ID from the ordered global arrays.
    // depth:0 means each `tour` field is the raw numeric ID.
    const orderMap: Record<string, number> = {}
    type OrderRow = { tour: number | { id: number } | null }
    const to = tourOrder as unknown as { belgrade?: OrderRow[]; sarajevo?: OrderRow[] }
    for (const [, rows] of Object.entries({ belgrade: to.belgrade, sarajevo: to.sarajevo })) {
      rows?.forEach((row, i) => {
        const id = row.tour == null ? null : typeof row.tour === 'object' ? row.tour.id : row.tour
        if (id != null) orderMap[String(id)] = i
      })
    }

    const docs = result.docs.map((doc) => {
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

    // Tours in the order list sort by their index; anything not listed goes to the bottom.
    return docs.sort((a, b) => {
      const ai = orderMap[String(a.id)] ?? Infinity
      const bi = orderMap[String(b.id)] ?? Infinity
      return ai - bi
    })
  },
  ['booking-tours'],
  { tags: ['tours', 'tour-order'] },
)
