'use client'

import { useActionState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { submitContact, type ContactFormState } from '@/app/(frontend)/contact/actions'
import './contact-form.css'

const initialState: ContactFormState = { status: 'idle' }

export function ContactForm() {
  const [state, action, isPending] = useActionState(submitContact, initialState)
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? ''

  if (state.status === 'success') {
    return (
      <div className="contact-success">
        <p>Thanks for getting in touch — we&apos;ll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" action={action}>
      {state.status === 'error' && (
        <p className="contact-error">{state.message}</p>
      )}

      <div className="contact-field">
        <label htmlFor="contact-name" className="contact-label">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          className="contact-input"
          required
          autoComplete="name"
        />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-email" className="contact-label">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          className="contact-input"
          required
          autoComplete="email"
        />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message" className="contact-label">Message</label>
        <textarea
          id="contact-message"
          name="message"
          className="contact-textarea"
          rows={6}
          required
        />
      </div>

      {siteKey && (
        <div className="contact-captcha">
          <Turnstile siteKey={siteKey} options={{ theme: 'light' }} />
        </div>
      )}

      <button
        type="submit"
        className="contact-submit"
        disabled={isPending}
      >
        {isPending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
