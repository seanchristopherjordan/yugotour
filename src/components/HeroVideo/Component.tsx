import { getMediaUrl } from '@/lib/getMediaUrl'
import { HeroVideo } from './index'

export async function HeroVideoServer() {
  const [videoUrl, posterUrl, logoUrl] = await Promise.all([
    getMediaUrl('header-hero-video-notitle.webm'),
    getMediaUrl('webm-fallback0.webp'),
    getMediaUrl('yugotour-logo-video-overlay.webp'),
  ])

  return (
    <>
      {videoUrl && <link rel="preload" as="video" href={videoUrl} type="video/webm" />}
      <HeroVideo videoUrl={videoUrl} posterUrl={posterUrl} logoUrl={logoUrl} />
    </>
  )
}
