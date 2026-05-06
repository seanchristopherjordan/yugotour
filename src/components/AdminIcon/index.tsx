import React from 'react'

export default function AdminIcon() {
  const base = (process.env.NEXT_PUBLIC_S3_URL ?? '').replace(/\/$/, '')
  return (
    <img
      src={`${base}/yugotour-icon-payload.png`}
      alt="Yugotour"
      style={{ width: '36px', height: '36px', objectFit: 'contain', display: 'block' }}
    />
  )
}
