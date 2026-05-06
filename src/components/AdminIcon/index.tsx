'use client'
import React from 'react'

export default function AdminIcon() {
  const base = (process.env.NEXT_PUBLIC_S3_URL ?? '').replace(/\/$/, '')
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${base}/yugotour-icon-payload.png`}
      alt="Yugotour"
      style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block' }}
    />
  )
}
