'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { submitComment } from '../actions'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      remove: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
    }
  }
}

interface CommentFormProps {
  postId: number
  postSlug: string
}

export function CommentForm({ postId, postSlug }: CommentFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    const init = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
        theme: 'light',
      })
    }

    if (window.turnstile) {
      init()
      return
    }

    // Script not yet loaded — inject it once
    if (!document.querySelector('script[data-turnstile]')) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.dataset.turnstile = 'true'
      script.onload = init
      document.head.appendChild(script)
    } else {
      // Script tag exists but hasn't loaded yet — wait for it
      const existing = document.querySelector('script[data-turnstile]')!
      existing.addEventListener('load', init, { once: true })
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    const token = widgetIdRef.current ? window.turnstile?.getResponse(widgetIdRef.current) : undefined
    if (!token) {
      setError('Please complete the security check.')
      return
    }

    startTransition(async () => {
      try {
        await submitComment(postId, postSlug, {
          authorName: name.trim(),
          authorEmail: email.trim(),
          content: message.trim(),
        }, token)
        setSubmitted(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="comment-form-success">
        Thanks for your comment — it has been received.
      </div>
    )
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      <div className="comment-form-row">
        <div className="comment-form-field">
          <label className="comment-form-label" htmlFor="comment-name">
            Name *
          </label>
          <input
            id="comment-name"
            className="comment-form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isPending}
          />
        </div>
        <div className="comment-form-field">
          <label className="comment-form-label" htmlFor="comment-email">
            Email
          </label>
          <input
            id="comment-email"
            className="comment-form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </div>
      </div>
      <div className="comment-form-field">
        <label className="comment-form-label" htmlFor="comment-message">
          Comment *
        </label>
        <textarea
          id="comment-message"
          className="comment-form-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          disabled={isPending}
        />
      </div>
      <div ref={containerRef} />
      {error && <p className="comment-form-error">{error}</p>}
      <button
        type="submit"
        className="comment-form-submit btn-spring-hover"
        disabled={isPending || !name.trim() || !message.trim()}
      >
        {isPending ? 'Submitting…' : 'Post Comment'}
      </button>
    </form>
  )
}
