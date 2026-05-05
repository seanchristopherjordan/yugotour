'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { verifyTurnstile } from '@/lib/verifyTurnstile'
import { headers } from 'next/headers'

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const message = (formData.get('message') as string | null)?.trim() ?? ''
  const turnstileToken = (formData.get('cf-turnstile-response') as string | null) ?? ''

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in all fields.' }
  }

  const verified = await verifyTurnstile(turnstileToken)
  if (!verified) {
    return { status: 'error', message: 'Captcha verification failed. Please try again.' }
  }

  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    undefined

  try {
    const payload = await getPayload({ config: configPromise })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.create as any)({
      collection: 'contact-messages',
      data: { name, email, message, ipAddress: ip },
    })
  } catch (err) {
    console.error('[submitContact] failed to save message:', err)
    return { status: 'error', message: 'Something went wrong. Please try again shortly.' }
  }

  return { status: 'success' }
}
