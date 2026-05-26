import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Verify Cloudflare Turnstile token
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (!turnstileSecret) {
      console.warn('[contact] CLOUDFLARE_TURNSTILE_SECRET_KEY is not set — skipping Turnstile verification')
    } else if (!body.turnstileToken) {
      return NextResponse.json({ error: 'Security check failed' }, { status: 400 })
    } else {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: turnstileSecret, response: body.turnstileToken }),
      })
      const verifyData = await verifyRes.json() as { success: boolean; 'error-codes'?: string[] }
      if (!verifyData.success) {
        const codes = verifyData['error-codes'] ?? []
        const ourConfigError = codes.some((c) =>
          ['missing-input-secret', 'invalid-input-secret'].includes(c),
        )
        if (ourConfigError) {
          console.error('[contact] Turnstile secret key misconfiguration:', codes)
        } else {
          return NextResponse.json({ error: 'Security check failed' }, { status: 400 })
        }
      }
    }

    const { name, email, message } = body
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      undefined

    const payload = await getPayload({ config: configPromise })

    const trimmedName = String(name).trim()
    const trimmedEmail = String(email).trim()
    const trimmedMessage = String(message).trim()

    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: {
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        status: 'new',
        ipAddress: ip,
      },
    })

    console.log('[contact] sending notification email...')
    await sendEmail('contact_staff_notification', {
      sender_name: trimmedName,
      sender_email: trimmedEmail,
      message: trimmedMessage,
    }, undefined, trimmedEmail)
    console.log('[contact] notification email sent successfully')

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[contact]', message, err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
