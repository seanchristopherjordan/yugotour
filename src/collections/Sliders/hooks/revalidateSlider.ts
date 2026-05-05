import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateSlider: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating all slider pages after slider update: ${doc?.name}`)
  revalidatePath('/')
  revalidatePath('/belgrade-tours')
  revalidatePath('/sarajevo-tours')
  return doc
}

export const revalidateSliderDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating all slider pages after slider delete: ${doc?.name}`)
  revalidatePath('/')
  revalidatePath('/belgrade-tours')
  revalidatePath('/sarajevo-tours')
  return doc
}
