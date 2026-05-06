'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

const filters = [
  { label: 'All Cities', href: '/admin/collections/bookings' },
  { label: 'Belgrade', href: '/admin/collections/bookings?where[city][equals]=belgrade' },
  { label: 'Sarajevo', href: '/admin/collections/bookings?where[city][equals]=sarajevo' },
]

export default function BookingsNavFilters() {
  const pathname = usePathname() ?? ''
  if (!pathname.includes('/collections/bookings')) return null

  return (
    <div
      style={{
        padding: '10px 16px 14px',
        borderTop: '1px solid var(--theme-border-color)',
        marginTop: '4px',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--theme-text-dim)',
          margin: '0 0 6px',
        }}
      >
        Filter by City
      </p>
      {filters.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          style={{
            display: 'block',
            padding: '5px 10px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '13px',
            color: 'var(--theme-text)',
            marginBottom: '2px',
          }}
        >
          {label}
        </a>
      ))}
    </div>
  )
}
