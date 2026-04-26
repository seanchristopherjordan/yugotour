import type { Metadata } from 'next'
import localFont from 'next/font/local'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const faktPro = localFont({
  src: [
    { path: './fonts/FaktPro-Normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/FaktPro-NormalItalic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/FaktPro-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/FaktPro-MediumItalic.woff2', weight: '500', style: 'italic' },
    { path: './fonts/FaktPro-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/FaktPro-SemiBoldItalic.woff2', weight: '600', style: 'italic' },
    { path: './fonts/FaktPro-Bold.woff2', weight: '700', style: 'normal' },
    { path: './fonts/FaktPro-BoldItalic.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--font-fakt-pro',
  display: 'swap',
})

const flArtGrotesk = localFont({
  src: [
    { path: './fonts/FLArtGroteskAmpleRegular.woff2', weight: '300', style: 'normal' },
    { path: './fonts/FLArtGroteskAmpleMedium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/FLArtGroteskAmpleBold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-art-grotesk',
  display: 'swap',
})

const cooperBlackPro = localFont({
  src: './fonts/CooperBlackPro.woff2',
  variable: '--font-cooper-black',
  display: 'swap',
})

const jobClarendon = localFont({
  src: './fonts/JobClarendon-Bold.woff2',
  weight: '700',
  variable: '--font-job-clarendon',
  display: 'swap',
})

const tungstenCompressed = localFont({
  src: './fonts/TungstenCompressedBold.woff2',
  weight: '700',
  variable: '--font-tungsten-compressed',
  display: 'swap',
})

const zipperStd = localFont({
  src: './fonts/ZipperStd.woff2',
  variable: '--font-zipper-std',
  display: 'swap',
})

const steelfishBold = localFont({
  src: './fonts/Steelfish-Bold.woff2',
  weight: '700',
  variable: '--font-steelfish-bold',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        faktPro.variable,
        flArtGrotesk.variable,
        cooperBlackPro.variable,
        jobClarendon.variable,
        tungstenCompressed.variable,
        zipperStd.variable,
        steelfishBold.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
