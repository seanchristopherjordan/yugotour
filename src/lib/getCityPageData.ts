import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Tour } from '@/payload-types'

type OrderRow = { tour: number | { id: number } | null }
type TourOrderGlobal = { belgrade?: OrderRow[]; sarajevo?: OrderRow[] }

export const getCachedCityListPage = (city: 'belgrade' | 'sarajevo') =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'tour-list-pages',
        where: { city: { equals: city } },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    [`city-list-page-${city}`],
    { tags: ['tour-list-pages'] },
  )

export const getCachedCityTours = (city: 'belgrade' | 'sarajevo') =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const [toursResult, orderResult] = await Promise.all([
        payload.find({
          collection: 'tours',
          where: { city: { equals: city } },
          limit: 50,
          depth: 1,
        }),
        payload.findGlobal({ slug: 'tour-order', depth: 1 }),
      ])

      const allTours = toursResult.docs as Tour[]
      const to = orderResult as unknown as TourOrderGlobal
      const orderedRefs = to[city] ?? []
      const orderedIds = orderedRefs
        .map((row) =>
          row.tour == null
            ? null
            : typeof row.tour === 'object'
              ? row.tour.id
              : row.tour,
        )
        .filter((id): id is number => id != null)

      return [
        ...orderedIds
          .map((id) => allTours.find((t) => t.id === id))
          .filter((t): t is Tour => t !== undefined),
        ...allTours.filter((t) => !orderedIds.includes(t.id)),
      ]
    },
    [`city-tours-${city}`],
    { tags: [`tours-${city}`, 'tour-order'] },
  )
