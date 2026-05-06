import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Verify Cloudflare Turnstile token
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (!turnstileSecret) {
      console.warn('[booking] CLOUDFLARE_TURNSTILE_SECRET_KEY is not set — skipping Turnstile verification')
    } else if (!body.turnstileToken) {
      console.warn('[booking] No Turnstile token in request body')
      return NextResponse.json({ error: 'Security check failed' }, { status: 400 })
    } else {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: turnstileSecret, response: body.turnstileToken }),
      })
      const verifyData = await verifyRes.json() as { success: boolean; 'error-codes'?: string[] }
      console.log('[booking] Turnstile result:', JSON.stringify(verifyData))
      if (!verifyData.success) {
        const codes = verifyData['error-codes'] ?? []
        // If the secret key itself is misconfigured on our side, log and continue
        // so legitimate users aren't blocked by our own config errors
        const ourConfigError = codes.some((c) =>
          ['missing-input-secret', 'invalid-input-secret'].includes(c),
        )
        if (ourConfigError) {
          console.error('[booking] Turnstile secret key misconfiguration:', codes)
        } else {
          return NextResponse.json({ error: 'Security check failed' }, { status: 400 })
        }
      }
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'bookings',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || undefined,
        city: body.city,
        tourTitle: body.tourTitle,
        tourId: body.tourId || undefined,
        guests: String(body.guests),
        totalPrice: body.totalPrice ?? undefined,
        date: body.date,
        startTime: body.startTime || undefined,
        pickupSpot: body.pickupSpot || undefined,
        extras: body.extras || [],
        airportDirection: body.airportDirection || undefined,
        flightTime: body.flightTime || undefined,
        comments: body.comments || undefined,
        submittedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[booking]', message, err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
