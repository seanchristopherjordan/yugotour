'use client'
import React from 'react'

export default function AdminLogo() {
  const base = (process.env.NEXT_PUBLIC_S3_URL ?? '').replace(/\/$/, '')
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${base}/yugotour-logo-login.png`}
      alt="Yugotour"
      style={{ width: '160px', height: 'auto', display: 'block' }}
    />
  )
}
