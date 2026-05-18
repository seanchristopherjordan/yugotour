import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'

import { cn } from '@/utilities/ui'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { FloatingBookNow } from '@/components/FloatingBookNow'
import { LazyFade } from '@/components/LazyFade'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { BookingModalProvider, type BookingModalImages, type BookingTimeSettings, type BookingSuccessContent } from '@/providers/BookingModal'
import { ContactModalProvider } from '@/providers/ContactModal'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getAllToursForBooking } from '@/lib/getAllToursForBooking'
import { getMediaUrl } from '@/lib/getMediaUrl'
import { draftMode } from 'next/headers'

import './globals.css'
import '@/components/BookingModal/booking-modal.css'
import '@/components/HeroVideo/hero-video.css'
import '@/components/CityPicker/city-picker.css'
import '@/blocks/ImageSlider/image-slider.css'
import '@/blocks/TvSection/tv-section.css'
import '@/Footer/footer.css'
import '@/components/TourListHeader/tour-list-header.css'
import '@/components/IntroSection/tour-intro.css'
import '@/components/TourTile/tour-tile.css'
import '@/components/SimulatorSection/simulator.css'
import '@/components/TourDetailHeader/tour-detail.css'
import '@/components/FloatingBookNow/floating-book-now.css'
import '@/components/LazyFade/lazy-fade.css'
import '@/components/TalesFromTheRoad/tales.css'
import '@/blocks/ReviewsCarouselV2/reviews-carousel-v2.css'
import '@/components/OptionalExtrasModal/optional-extras-modal.css'
import '@/components/CookieBanner/cookie-banner.css'
import { getServerSideURL } from '@/utilities/getURL'
import { CookieBanner } from '@/components/CookieBanner/CookieBanner'
import Script from 'next/script'

const faktPro = localFont({
  src: [
    { path: './fonts/FaktPro-Normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/FaktPro-NormalItalic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/FaktPro-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/FaktPro-MediumItalic.woff2', weight: '500', style: 'italic' },
    { path: './fonts/FaktPro-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/FaktPro-Bold.woff2', weight: '700', style: 'normal' },
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

const cooperBoldCondensed = localFont({
  src: './fonts/CooperBlackEFCE-BoldCon.woff',
  variable: '--font-cooper-bold-condensed',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const [siteSettings, allTours, bookNowButtonUrl, kolaciUrl, bookingImages] = await Promise.all([
    getCachedGlobal('site-settings', 1)(),
    getAllToursForBooking(),
    getMediaUrl('booknowbutton.webp'),
    getMediaUrl('kolaci.webp'),
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
      getMediaUrl('inline-icon-pickup.webp'),
      getMediaUrl('inline-icon-time.webp'),
      getMediaUrl('little-white-star.webp'),
      getMediaUrl('price-tag-icon.webp'),
      getMediaUrl('red-star.webp'),
      getMediaUrl('tito-success-badge.webp'),
      getMediaUrl('tito-success-speech-bubble-desktop.webp'),
      getMediaUrl('tito-success-speech-bubble-mobile.webp'),
    ]).then(([headerImage, headerImageMobile, checkmarkCircle, cityBelgrade, citySarajevo, iconComment, iconDate, iconEmail, iconName, iconPhone, iconPickup, iconTime, littleWhiteStar, priceTag, redStar, titoSuccessBadge, titoSuccessSpeechBubbleDesktop, titoSuccessSpeechBubbleMobile]): BookingModalImages => ({
      headerImage, headerImageMobile, checkmarkCircle, cityBelgrade, citySarajevo,
      iconComment, iconDate, iconEmail, iconName, iconPhone, iconPickup, iconTime,
      littleWhiteStar, priceTag, redStar,
      titoSuccessBadge, titoSuccessSpeechBubbleDesktop, titoSuccessSpeechBubbleMobile,
    })),
  ])

  const bookingTab = (siteSettings as unknown as Record<string, unknown>).booking as Record<string, string> | undefined
  const timeSettings: BookingTimeSettings = {
    tourTimeStart: bookingTab?.tourTimeStart ?? '09:00',
    tourTimeEnd: bookingTab?.tourTimeEnd ?? '17:00',
    airportTimeStart: bookingTab?.airportTimeStart ?? '08:00',
    airportTimeEnd: bookingTab?.airportTimeEnd ?? '20:00',
  }
  const successContent: BookingSuccessContent = {
    line1: bookingTab?.successLine1 ?? 'The Marshal of Yugoslavia is pleased to confirm receipt of your booking request.',
    line2: bookingTab?.successLine2 ?? "We'll be in touch via email to firm up the details. Thank you for booking with Yugotour! <i>Ajmo!</i>",
  }
  const faviconMedia = siteSettings.site?.favicon
  const faviconUrl =
    typeof faviconMedia === 'object' && faviconMedia !== null ? faviconMedia.url ?? null : null

  return (
    <html
      className={cn(
        faktPro.variable,
        flArtGrotesk.variable,
        cooperBlackPro.variable,
        jobClarendon.variable,
        jobClarendonExtraBold.variable,
        tungstenCompressed.variable,
        zipperStd.variable,
        steelfishBold.variable,
        cooperBoldCondensed.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link rel="preconnect" href="https://media.yugotour-assets.workers.dev" />
        {faviconUrl ? (
          <link href={faviconUrl} rel="icon" />
        ) : (
          <>
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          </>
        )}
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-1F5QQJVZ8S"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1F5QQJVZ8S');
        `}
      </Script>
      <body suppressHydrationWarning>
        <ContactModalProvider
          textureUrl="/textures/texture-blue.webp"
          images={{
            headerImage: bookingImages.headerImage,
            headerImageMobile: bookingImages.headerImageMobile,
            iconName: bookingImages.iconName,
            iconEmail: bookingImages.iconEmail,
            iconComment: bookingImages.iconComment,
          }}
        >
        <BookingModalProvider tours={allTours} textureUrl="/textures/texture-blue.webp" images={bookingImages} timeSettings={timeSettings} successContent={successContent}>
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header />
            {children}
            <Footer />
            <FloatingBookNow imageUrl={bookNowButtonUrl} />
            <CookieBanner kolaciUrl={kolaciUrl} />
            <LazyFade />
          </Providers>
        </BookingModalProvider>
        </ContactModalProvider>
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal('site-settings', 0)()
  const site = settings.site as Record<string, unknown> | undefined
  const siteTitle = (site?.siteTitle as string | undefined) ?? 'Yugotour'
  const siteDescription = (site?.siteDescription as string | undefined) ?? undefined

  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: siteTitle,
      template: `%s — ${siteTitle}`,
    },
    description: siteDescription,
    referrer: 'no-referrer',
    openGraph: mergeOpenGraph({ siteName: siteTitle, title: siteTitle, description: siteDescription ?? '' }),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
