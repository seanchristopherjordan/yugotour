'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import type { ContactModalImages } from '@/providers/ContactModal'

// ─── Style constants (mirror BookingModal) ────────────────────────────────────

const FORM_CARD = 'rounded-[8px] p-[22px] min-[480px]:p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.18)]'
const INPUT_ROW = 'flex items-center gap-[10px] bg-[#fcf9ea] border border-[#c9b898] rounded-[5px] px-[12px] py-[9px] focus-within:border-[#C25E5E] transition-colors duration-200'
const MAX_FORM_W = 'w-full max-w-[660px] min-[992px]:max-w-[790px]'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Close button — identical to BookingModal ─────────────────────────────────

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close contact form"
      className="flex items-center cursor-pointer bg-transparent border-none p-0 h-[24px] relative group"
    >
      <span className="mr-[8px] font-grotesk text-[1.1rem] max-[991px]:text-[1.3rem] font-light leading-none text-yugo-cream">
        close
      </span>
      <div className="flex flex-col justify-center gap-[6px] w-[22px] max-[991px]:w-[26px] h-[20px] overflow-visible">
        <span
          className="block w-[20px] max-[991px]:w-[24px] h-[2.5px] bg-yugo-cream rounded-[5px] origin-center"
          style={{ transform: 'translateY(4.25px) rotate(45deg)' }}
        />
        <span
          className="block w-[20px] max-[991px]:w-[24px] h-[2.5px] bg-yugo-cream rounded-[5px] origin-center"
          style={{ transform: 'translateY(-4.25px) rotate(-45deg)' }}
        />
      </div>
      <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-yugo-cream transition-[width] duration-300 group-hover:w-full" />
    </button>
  )
}

// ─── Input field — mirrors BookingModal's InputField ──────────────────────────

function InputField({
  imgSrc,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
}: {
  imgSrc: string | null
  placeholder: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: boolean
}) {
  return (
    <div className={INPUT_ROW} style={error ? { boxShadow: '0 0 0 3px #C25E5E' } : undefined}>
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} width="18" height="18" alt="" aria-hidden="true" className="flex-shrink-0" />
      )}
      <input
        type={type}
        className="flex-1 border-none bg-transparent font-fakt text-[0.93rem] text-[#212121] outline-none min-w-0 placeholder:text-[#b09070] [color-scheme:light]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingTop: '2px' }}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ContactModal({
  isOpen,
  onClose,
  textureUrl,
  images,
}: {
  isOpen: boolean
  onClose: () => void
  textureUrl: string | null
  images: ContactModalImages
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [phase, setPhase] = useState<'form' | 'success'>('form')
  const turnstileRef = useRef<TurnstileInstance>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return
    setName('')
    setEmail('')
    setMessage('')
    setFieldErrors(new Set())
    setSubmitError(null)
    setTurnstileToken(null)
    setPhase('form')
    turnstileRef.current?.reset()
    const t = setTimeout(() => turnstileRef.current?.execute(), 150)
    return () => clearTimeout(t)
  }, [isOpen])

  // Scroll lock
  useEffect(() => {
    document.documentElement.classList.toggle('modal-active', isOpen)
    document.body.classList.toggle('modal-active', isOpen)
    return () => {
      document.documentElement.classList.remove('modal-active')
      document.body.classList.remove('modal-active')
    }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  function clearError(field: string) {
    setFieldErrors((prev) => { const n = new Set(prev); n.delete(field); return n })
  }

  const handleSubmit = useCallback(async () => {
    // Validate
    const errors = new Set<string>()
    if (!name.trim()) errors.add('name')
    if (!emailRegex.test(email)) errors.add('email')
    if (!message.trim()) errors.add('message')
    if (errors.size > 0) { setFieldErrors(errors); return }
    if (!turnstileToken) { setSubmitError('Please complete the security check.'); return }

    setFieldErrors(new Set())
    setIsSubmitting(true)
    setSubmitError(null)
    const token = turnstileToken
    setTurnstileToken(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim(), turnstileToken: token }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error ?? 'Submission failed')
      }
      setPhase('success')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      turnstileRef.current?.reset()
      setTimeout(() => turnstileRef.current?.execute(), 150)
    } finally {
      setIsSubmitting(false)
    }
  }, [name, email, message, turnstileToken])

  return (
    <div
      id="contact-modal"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className={[
        'fixed inset-0 z-[10000] flex flex-col',
        'transition-[opacity,visibility] duration-[600ms] ease-[ease]',
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
      ].join(' ')}
      style={{
        backgroundImage: textureUrl ? `url('${textureUrl}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1a3558',
      }}
    >
      {/* Close button bar — identical height to booking modal */}
      <div className="booking-close-bar flex-none flex items-center justify-end pr-[20px] min-[992px]:pr-[30px] z-[10010]">
        <CloseButton onClick={onClose} />
      </div>

      {/* 8px gap — mirrors booking modal */}
      <div className="flex-none" style={{ height: '8px' }} aria-hidden="true" />

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto booking-modal-body">
        <div className="flex flex-col items-center px-4 pt-2 pb-16">

          {/* Heading — same Zipper font, same sizing class, no stars, no subheading */}
          <div className={`text-center mb-[30px] ${MAX_FORM_W}`}>
            <h2
              className="booking-ready-heading text-yugo-cream text-center m-0"
              style={{ fontFamily: 'var(--font-zipper)', lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              Contact Us
            </h2>
          </div>

          {/* Form card */}
          <div className={`${FORM_CARD} bg-[#fcf9ea] ${MAX_FORM_W}`}>

            {phase === 'success' ? (
              /* ── Inline success message ── */
              <div className="py-[20px] text-center">
                <p
                  className="font-fakt text-[1rem] leading-[1.6] text-[#212121] m-0"
                >
                  Message received! Thanks for reaching out. We&rsquo;ll get back to you soon via email.
                </p>
              </div>
            ) : (
              /* ── Form fields ── */
              <>
                {/* Name */}
                <div className="mb-[10px]">
                  <InputField
                    imgSrc={images.iconName}
                    placeholder="Your Name"
                    value={name}
                    error={fieldErrors.has('name')}
                    onChange={(v) => { clearError('name'); setName(v) }}
                  />
                </div>

                {/* Email */}
                <div className="mb-[10px]">
                  <InputField
                    imgSrc={images.iconEmail}
                    type="email"
                    placeholder="Email"
                    value={email}
                    error={fieldErrors.has('email')}
                    onChange={(v) => { clearError('email'); setEmail(v) }}
                  />
                </div>

                {/* Message — same size as booking's comments textarea */}
                <div className="mb-[10px]">
                  <div
                    className={`${INPUT_ROW} items-start`}
                    style={fieldErrors.has('message') ? { boxShadow: '0 0 0 3px #C25E5E' } : undefined}
                  >
                    {images.iconComment && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={images.iconComment} width="18" height="18" alt="" aria-hidden="true" className="flex-shrink-0 mt-[2px]" />
                    )}
                    <textarea
                      className="flex-1 border-none bg-transparent font-fakt text-[0.93rem] text-[#212121] outline-none resize-y min-h-[90px] leading-[1.5] placeholder:text-[#b09070]"
                      placeholder="Your Message"
                      value={message}
                      rows={4}
                      onChange={(e) => { clearError('message'); setMessage(e.target.value) }}
                    />
                  </div>
                </div>

                {submitError && (
                  <p style={{ color: '#C25E5E' }} className="font-fakt text-sm text-center mt-2 mb-2">{submitError}</p>
                )}

                {/* Turnstile */}
                <div className="flex justify-center">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                    options={{ theme: 'light', size: 'normal', appearance: 'execute' }}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken(null)}
                    onExpire={() => { setTurnstileToken(null); turnstileRef.current?.reset() }}
                  />
                </div>

                {/* Send button — same style as BOOK MY YUGOTOUR */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className={[
                    'booking-submit-btn',
                    'flex items-center justify-center gap-[12px] w-full mt-[16px]',
                    'px-[20px] py-[14px] rounded-[6px] border-none cursor-pointer',
                  ].join(' ')}
                  style={{
                    background: '#C25E5E',
                    color: '#FCF9EB',
                    fontFamily: 'var(--font-grotesk)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {isSubmitting ? (
                    <div className="booking-spinner" />
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
