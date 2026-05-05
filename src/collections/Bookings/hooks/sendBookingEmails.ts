import type { CollectionAfterChangeHook } from 'payload'
import { sendEmail } from '@/lib/sendEmail'

export const sendBookingEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  const city = (doc.city as string) ?? ''
  const staffKey = city === 'sarajevo' ? 'booking_staff_sarajevo' : 'booking_staff_belgrade'

  const variables = {
    booking_id: String(doc.id),
    guest_name: doc.name ?? '',
    guest_email: doc.email ?? '',
    guest_phone: doc.phone ?? '',
    tour_name: doc.tourTitle ?? '',
    tour_date: doc.date ?? '',
    group_size: doc.guests ?? '',
    city: city === 'sarajevo' ? 'Sarajevo' : 'Belgrade',
    start_time: doc.startTime ?? '',
    total_price: doc.totalPrice != null ? `€${doc.totalPrice}` : '',
    comments: doc.comments ?? '',
  }

  await Promise.all([
    // Guest confirmation — to: is always the booker's email
    sendEmail('booking_guest_confirmation', variables, doc.email).catch((err) =>
      console.error('[sendBookingEmails] guest confirmation failed:', err),
    ),
    // Staff notification — to: comes from the template's recipients array
    sendEmail(staffKey, variables).catch((err) =>
      console.error('[sendBookingEmails] staff notification failed:', err),
    ),
  ])

  return doc
}
