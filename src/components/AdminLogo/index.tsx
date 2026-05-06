import React from 'react'

export default function AdminLogo() {
  const base = (process.env.NEXT_PUBLIC_S3_URL ?? '').replace(/\/$/, '')
  return (
    <img
      src={`${base}/yugotour-logo-login.png`}
      alt="Yugotour"
      style={{ width: '180px', height: 'auto', display: 'block' }}
    />
  )
}
