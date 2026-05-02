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
import { BookingModalProvider, type BookingModalImages, type BookingTimeSettings } from '@/providers/BookingModal'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getAllToursForBooking } from '@/lib/getAllToursForBooking'
import { getMediaUrl } from '@/lib/getMediaUrl'
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
    { path: './fonts/FLArtGroteskAmpleRegular.woff', weight: '300', style: 'normal' },
    { path: './fonts/FLArtGroteskAmpleMedium.woff', weight: '500', style: 'normal' },
    { path: './fonts/FLArtGroteskAmpleBold.woff', weight: '700', style: 'normal' },
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

const jobClarendonExtraBold = localFont({
  src: './fonts/JobClarendon-ExtraBold.woff',
  weight: '800',
  variable: '--font-job-clarendon-extra-bold',
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
  const [siteSettings, allTours, menuTextureUrl, bookingImages] = await Promise.all([
    getCachedGlobal('site-settings', 1)(),
    getAllToursForBooking(),
    getMediaUrl('texture-blue.webp'),
    Promise.all([
      getMediaUrl('booking-form-header.webp'),
      getMediaUrl('booking-form-header-mobile.webp'),
      getMediaUrl('checkmark-circle-icon.webp'),
      getMediaUrl('belgrade-untitled-thumbnail.webp'),
      getMediaUrl('sarajevo-untitled-thumbnail.webp'),
      getMediaUrl('inline-icon-comment.webp'),
      getMediaUrl('inline-icon-date.webp'),
      getMediaUrl('inline-icon-email.webp'),
      getMediaUrl('inline-icon-name.webp'),
      getMediaUrl('inline-icon-phone.webp'),
      getMediaUrl('inline-icon-time.webp'),
      getMediaUrl('little-white-star.webp'),
      getMediaUrl('price-tag-icon.webp'),
      getMediaUrl('red-star.webp'),
    ]).then(([headerImage, headerImageMobile, checkmarkCircle, cityBelgrade, citySarajevo, iconComment, iconDate, iconEmail, iconName, iconPhone, iconTime, littleWhiteStar, priceTag, redStar]): BookingModalImages => ({
      headerImage, headerImageMobile, checkmarkCircle, cityBelgrade, citySarajevo,
      iconComment, iconDate, iconEmail, iconName, iconPhone, iconTime,
      littleWhiteStar, priceTag, redStar,
    })),
  ])

  const bookingTab = (siteSettings as unknown as Record<string, unknown>).booking as Record<string, string> | undefined
  const timeSettings: BookingTimeSettings = {
    tourTimeStart: bookingTab?.tourTimeStart ?? '09:00',
    tourTimeEnd: bookingTab?.tourTimeEnd ?? '17:00',
    airportTimeStart: bookingTab?.airportTimeStart ?? '08:00',
    airportTimeEnd: bookingTab?.airportTimeEnd ?? '20:00',
  }
  const faviconMedia = siteSettings.site?.favicon
  const faviconUrl =
    typeof faviconMedia === 'object' && faviconMedia !== null ? faviconMedia.url ?? null : null

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        faktPro.variable,
        flArtGrotesk.variable,
        cooperBlackPro.variable,
        jobClarendon.variable,
        jobClarendonExtraBold.variable,
        tungstenCompressed.variable,
        zipperStd.variable,
        steelfishBold.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        {faviconUrl ? (
          <link href={faviconUrl} rel="icon" />
        ) : (
          <>
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          </>
        )}
      </head>
      <body suppressHydrationWarning>
        <BookingModalProvider tours={allTours} textureUrl={menuTextureUrl} images={bookingImages} timeSettings={timeSettings}>
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
        </BookingModalProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  referrer: 'no-referrer',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
