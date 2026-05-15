import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { TourListPage } from '../../../payload-types'

export const revalidateTourListPage: CollectionAfterChangeHook<TourListPage> = ({ doc, req: { payload } }) => {
  const path = doc.city === 'belgrade' ? '/belgrade-tours' : '/sarajevo-tours'
  payload.logger.info(`Revalidating ${path} after tour list page update`)
  revalidatePath(path)
  revalidateTag('tour-list-pages', {})
  return doc
}

export const revalidateTourListPageDelete: CollectionAfterDeleteHook<TourListPage> = ({ doc, req: { payload } }) => {
  const path = doc?.city === 'belgrade' ? '/belgrade-tours' : '/sarajevo-tours'
  payload.logger.info(`Revalidating ${path} after tour list page delete`)
  revalidatePath(path)
  revalidateTag('tour-list-pages', {})
  return doc
}
