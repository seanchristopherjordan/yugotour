import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'
import type { Tour } from '../../../payload-types'

export const revalidateTour: CollectionAfterChangeHook<Tour> = ({ doc, previousDoc, req: { payload } }) => {
  const listPath = doc.city === 'belgrade' ? '/belgrade-tours' : '/sarajevo-tours'
  payload.logger.info(`Revalidating ${listPath} after tour update: ${doc.title}`)
  revalidatePath(listPath)
  if (doc.slug) revalidatePath(`/tours/${doc.slug}`)
  // If the slug changed, revalidate the old path too so it doesn't serve stale content
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidatePath(`/tours/${previousDoc.slug}`)
  }
  return doc
}

export const revalidateTourDelete: CollectionAfterDeleteHook<Tour> = ({ doc, req: { payload } }) => {
  const listPath = doc?.city === 'belgrade' ? '/belgrade-tours' : '/sarajevo-tours'
  payload.logger.info(`Revalidating ${listPath} after tour delete: ${doc?.title}`)
  revalidatePath(listPath)
  if (doc?.slug) revalidatePath(`/tours/${doc.slug}`)
  return doc
}
