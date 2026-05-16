import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    const [bookingsResult, contactsResult] = await Promise.all([
      payload.find({
        collection: 'bookings',
        where: { isRead: { equals: false } },
        limit: 1,
        overrideAccess: true,
        context: { skipMarkRead: true },
      }),
      payload.find({
        collection: 'contact-messages',
        where: { status: { equals: 'new' } },
        limit: 1,
        overrideAccess: true,
        context: { skipMarkRead: true },
      }),
    ])

    return NextResponse.json({
      bookings: bookingsResult.totalDocs,
      contacts: contactsResult.totalDocs,
    })
  } catch {
    return NextResponse.json({ bookings: 0, contacts: 0 })
  }
}
