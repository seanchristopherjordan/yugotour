import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Tour } from '../../../payload-types'

export const revalidateTour: CollectionAfterChangeHook<Tour> = ({ doc, previousDoc, req: { payload } }) => {
  const listPath = doc.city === 'belgrade' ? '/belgrade-tours' : '/sarajevo-tours'
  const cityTag = doc.city === 'belgrade' ? 'tours-belgrade' : 'tours-sarajevo'
  payload.logger.info(`Revalidating ${listPath} after tour update: ${doc.title}`)
  revalidatePath(listPath)
  revalidateTag(cityTag, {})
  if (doc.slug) revalidatePath(`/tours/${doc.slug}`)
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidatePath(`/tours/${previousDoc.slug}`)
  }
  return doc
}

export const revalidateTourDelete: CollectionAfterDeleteHook<Tour> = ({ doc, req: { payload } }) => {
  const listPath = doc?.city === 'belgrade' ? '/belgrade-tours' : '/sarajevo-tours'
  const cityTag = doc?.city === 'belgrade' ? 'tours-belgrade' : 'tours-sarajevo'
  payload.logger.info(`Revalidating ${listPath} after tour delete: ${doc?.title}`)
  revalidatePath(listPath)
  revalidateTag(cityTag, {})
  if (doc?.slug) revalidatePath(`/tours/${doc.slug}`)
  return doc
}
