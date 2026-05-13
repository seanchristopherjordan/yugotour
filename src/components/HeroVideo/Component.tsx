import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/lib/getMediaUrl'
import { HeroVideo } from './index'
import type { Media } from '@/payload-types'

function mediaUrl(field: unknown): string | null {
  if (field && typeof field === 'object' && 'url' in field) {
    return (field as Media).url ?? null
  }
  return null
}

export async function HeroVideoServer() {
  const [
    siteSettings,
    logoUrl,
    mobileH265Url,
    mobileH264Url,
    desktopH265Url,
    desktopH264Url,
  ] = await Promise.all([
    getCachedGlobal('site-settings', 1)(),
    getMediaUrl('yugotour-logo-video-overlay.webp'),
    getMediaUrl('homepage-video-mobile-h265.mp4'),
    getMediaUrl('homepage-video-mobile-h264.mp4'),
    getMediaUrl('homepage-video-desktop-h265.mp4'),
    getMediaUrl('homepage-video-desktop-h264.mp4'),
  ])

  const site = siteSettings.site as Record<string, unknown> | undefined
  const videoUrl = mediaUrl(site?.heroVideoDesktop)
  const mobileVideoUrl = mediaUrl(site?.heroVideoMobile)
  const posterDesktopUrl = mediaUrl(site?.heroCoverDesktop)
  const posterMobileUrl = mediaUrl(site?.heroCoverMobile)

  return (
    <>
      {/* Preload desktop WebM for Chrome/Firefox */}
      {videoUrl && (
        <link
          rel="preload"
          as="video"
          href={videoUrl}
          type="video/webm"
          fetchPriority="high"
          media="(min-width: 992px)"
        />
      )}
      {/* Preload mobile WebM for desktop Chrome/Firefox on narrow viewports */}
      {mobileVideoUrl && (
        <link
          rel="preload"
          as="video"
          href={mobileVideoUrl}
          type="video/webm"
          fetchPriority="high"
          media="(max-width: 991px)"
        />
      )}
      {/* Preload mobile H265 for iOS */}
      {mobileH265Url && (
        <link
          rel="preload"
          as="video"
          href={mobileH265Url}
          type='video/mp4; codecs="hvc1"'
          fetchPriority="high"
          media="(max-width: 991px)"
        />
      )}
      <HeroVideo
        videoUrl={videoUrl}
        mobileVideoUrl={mobileVideoUrl}
        mobileH265Url={mobileH265Url}
        mobileH264Url={mobileH264Url}
        desktopH265Url={desktopH265Url}
        desktopH264Url={desktopH264Url}
        posterDesktopUrl={posterDesktopUrl}
        posterMobileUrl={posterMobileUrl}
        logoUrl={logoUrl}
      />
    </>
  )
}
