import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateTourOrder: GlobalAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info('Revalidating booking tours cache after tour order update')
  revalidateTag('tour-order', {})
  return doc
}
