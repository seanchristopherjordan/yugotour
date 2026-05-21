import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateSlider: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating slider cache after update: ${doc?.name}`)
  revalidateTag('sliders')
  return doc
}

export const revalidateSliderDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating slider cache after delete: ${doc?.name}`)
  revalidateTag('sliders')
  return doc
}
