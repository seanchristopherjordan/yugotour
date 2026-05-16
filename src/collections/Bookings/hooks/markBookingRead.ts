import type { CollectionAfterReadHook } from 'payload'

export const markBookingRead: CollectionAfterReadHook = async ({ doc, req, findMany }) => {
  if (findMany) return doc
  if (doc.isRead) return doc
  if (req.context?.skipMarkRead) return doc

  try {
    await req.payload.update({
      collection: 'bookings',
      id: doc.id as number,
      data: { isRead: true },
      context: { skipMarkRead: true },
      overrideAccess: true,
    })
    return { ...doc, isRead: true }
  } catch {
    return doc
  }
}
