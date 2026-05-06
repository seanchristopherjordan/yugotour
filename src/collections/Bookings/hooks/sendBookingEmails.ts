import type { CollectionAfterChangeHook } from 'payload'
import { sendEmail } from '@/lib/sendEmail'

function buildOptionalExtras(doc: Record<string, any>): string {
  const extras = (doc.extras ?? []) as { title: string }[]
  if (!extras.length) return ''

  const guestCount = parseInt(String(doc.guests ?? '1'), 10) || 1
  const cars = Math.ceil(guestCount / 3)
  const carLabel = cars === 1 ? 'car' : 'cars'
  const direction = doc.airportDirection === 'dropoff' ? 'Drop-off' : 'Pick-up'
  const flightTime = doc.flightTime ? ` ${doc.flightTime}` : ''

  return extras
    .map((extra) => {
      if (extra.title.toLowerCase().includes('airport')) {
        return `Airport ${direction} ${cars} ${carLabel}${flightTime}`
      }
      return extra.title
    })
    .join(', ')
}

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
    optional_extras: buildOptionalExtras(doc),
    pickup_spot: doc.pickupSpot ?? '',
  }

  const guestReplyTo = city === 'sarajevo' ? 'sarajevo@yugotour.com' : 'info@yugotour.com'

  await Promise.all([
    // Guest confirmation — to: is always the booker's email
    sendEmail('booking_guest_confirmation', variables, doc.email, guestReplyTo).catch((err) =>
      console.error('[sendBookingEmails] guest confirmation failed:', err),
    ),
    // Staff notification — to: comes from the template's recipients array
    sendEmail(staffKey, variables).catch((err) =>
      console.error('[sendBookingEmails] staff notification failed:', err),
    ),
  ])

  return doc
}
