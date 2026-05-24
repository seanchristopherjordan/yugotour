'use client'

import { useState, useTransition } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { submitComment } from '../actions'

interface CommentFormProps {
  postId: number
  postSlug: string
}

export function CommentForm({ postId, postSlug }: CommentFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    if (siteKey && !turnstileToken) {
      setError('Please complete the security check.')
      return
    }

    startTransition(async () => {
      try {
        await submitComment(postId, postSlug, {
          authorName: name.trim(),
          authorEmail: email.trim(),
          content: message.trim(),
        }, turnstileToken)
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
      {siteKey && (
        <div className="comment-form-captcha">
          <Turnstile
            siteKey={siteKey}
            options={{ theme: 'light' }}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken('')}
            onError={() => setTurnstileToken('')}
          />
        </div>
      )}
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
