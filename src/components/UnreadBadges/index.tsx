'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type Counts = { bookings: number; contacts: number }

const BADGE_STYLE = [
  'display:inline-block',
  'width:8px',
  'height:8px',
  'border-radius:50%',
  'background:#22c55e',
  'margin-left:6px',
  'vertical-align:middle',
  'flex-shrink:0',
  'box-shadow:0 0 0 2px rgba(34,197,94,0.3)',
].join(';')

function applyBadge(collection: string, count: number) {
  const badgeId = `unread-badge-${collection}`
  const existing = document.getElementById(badgeId)

  if (count === 0) {
    existing?.remove()
    return
  }

  // Badge already in place — nothing to do
  if (existing) return

  const anchor = document.querySelector<HTMLAnchorElement>(
    `a[href="/yugo-ulaz/collections/${collection}"]:not([data-filter-link])`,
  )
  if (!anchor) return

  const badge = document.createElement('span')
  badge.id = badgeId
  badge.setAttribute('aria-label', `${count} unread`)
  badge.setAttribute('title', `${count} unread`)
  badge.setAttribute('style', BADGE_STYLE)
  anchor.appendChild(badge)
}

export default function UnreadBadges() {
  const [counts, setCounts] = useState<Counts>({ bookings: 0, contacts: 0 })
  const pathname = usePathname()

  async function fetchCounts() {
    try {
      const res = await fetch('/api/unread-counts', { cache: 'no-store' })
      if (res.ok) {
        const data = (await res.json()) as Counts
        setCounts(data)
      }
    } catch {
      // silently ignore network errors
    }
  }

  // Re-fetch whenever the user navigates (e.g. just closed a detail view)
  useEffect(() => {
    fetchCounts()
  }, [pathname])

  // Background polling every 60 s
  useEffect(() => {
    const interval = setInterval(fetchCounts, 60_000)
    return () => clearInterval(interval)
  }, [])

  // Apply / remove badge dots after counts or navigation change.
  // Small delay lets Payload finish re-rendering the nav on route transitions.
  useEffect(() => {
    const timer = setTimeout(() => {
      applyBadge('bookings', counts.bookings)
      applyBadge('contact-messages', counts.contacts)
    }, 150)
    return () => clearTimeout(timer)
  }, [counts, pathname])

  return null
}
