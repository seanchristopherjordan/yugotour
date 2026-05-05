import type { CollectionAfterChangeHook } from 'payload'
import { sendEmail } from '@/lib/sendEmail'

export const sendContactNotification: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  const variables = {
    sender_name: doc.name ?? '',
    sender_email: doc.email ?? '',
    message: doc.message ?? '',
  }

  sendEmail('contact_staff_notification', variables).catch((err) =>
    console.error('[sendContactNotification] failed:', err),
  )

  return doc
}
