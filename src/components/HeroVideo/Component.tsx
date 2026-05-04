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
  const [siteSettings, logoUrl] = await Promise.all([
    getCachedGlobal('site-settings', 1)(),
    getMediaUrl('yugotour-logo-video-overlay.webp'),
  ])

  const site = siteSettings.site as Record<string, unknown> | undefined
  const videoUrl = mediaUrl(site?.heroVideoDesktop)
  const mobileVideoUrl = mediaUrl(site?.heroVideoMobile)
  const posterDesktopUrl = mediaUrl(site?.heroCoverDesktop)
  const posterMobileUrl = mediaUrl(site?.heroCoverMobile)

  return (
    <>
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
      <HeroVideo
        videoUrl={videoUrl}
        mobileVideoUrl={mobileVideoUrl}
        posterDesktopUrl={posterDesktopUrl}
        posterMobileUrl={posterMobileUrl}
        logoUrl={logoUrl}
      />
    </>
  )
}
