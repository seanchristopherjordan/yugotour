import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

function invalidateSliderCaches() {
  // Slider docs are embedded at depth:2 inside site-settings (homepage)
  // and inside tour-list-pages (city tour pages) — both caches must be busted.
  revalidateTag('global_site-settings', {})
  revalidateTag('tour-list-pages', {})
}

export const revalidateSlider: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating slider cache after update: ${doc?.name}`)
  invalidateSliderCaches()
  return doc
}

export const revalidateSliderDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating slider cache after delete: ${doc?.name}`)
  invalidateSliderCaches()
  return doc
}
