import { createLocalReq, getPayload } from 'payload'
import { seedTourListPages } from '@/endpoints/seed/tour-list-pages'
import config from '@payload-config'
import { headers } from 'next/headers'

export const maxDuration = 60

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const req = await createLocalReq({ user }, payload)
    await seedTourListPages({ payload, req })
    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding tour list pages' })
    return new Response('Error seeding tour list pages.', { status: 500 })
  }
}
