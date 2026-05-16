import type { CollectionAfterReadHook } from 'payload'

export const markContactRead: CollectionAfterReadHook = async ({ doc, req, findMany }) => {
  if (findMany) return doc
  if (doc.status !== 'new') return doc
  if (req.context?.skipMarkRead) return doc

  try {
    await req.payload.update({
      collection: 'contact-messages',
      id: doc.id as number,
      data: { status: 'read' },
      context: { skipMarkRead: true },
      overrideAccess: true,
    })
    return { ...doc, status: 'read' }
  } catch {
    return doc
  }
}
