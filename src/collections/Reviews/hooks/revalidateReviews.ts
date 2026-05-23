import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateReviews: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating reviews cache after change: ${doc?.reviewerName}`)
  revalidateTag('reviews', {})
  return doc
}

export const revalidateReviewsDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating reviews cache after delete: ${doc?.reviewerName}`)
  revalidateTag('reviews', {})
  return doc
}
