import Image from 'next/image'
import type { Media } from '@/payload-types'
import { tvConfig } from './tv-config'

export interface TvSectionBlockProps {
  blockType: 'tvSection'
  youtubeUrl?: string | null
  mobileImage?: string | Media | null
  desktopImage?: string | Media | null
  label?: string | null
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
      return u.pathname.replace('/embed/', '').split('?')[0] ?? null
    }
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v')
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('?')[0] ?? null
    }
  } catch {
    // not a valid URL
  }
  return null
}

export function TvSectionBlock({ youtubeUrl, mobileImage, desktopImage }: TvSectionBlockProps) {
  const { mobile: mob, desktop: desk, youtubeParams } = tvConfig

  const videoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?${youtubeParams}`
    : null

  const mobileImg = typeof mobileImage !== 'string' && mobileImage ? mobileImage : null
  const desktopImg = typeof desktopImage !== 'string' && desktopImage ? desktopImage : null

  const borderBar = <div style={{ height: '25px', backgroundColor: '#212121' }} />

  // Pass positioning values to CSS via custom properties on the container.
  // globals.css media queries consume these via var(--tv-*).
  const cssVars = {
    '--tv-mob-top': mob.top,
    '--tv-mob-left': mob.left,
    '--tv-mob-width': mob.width,
    '--tv-mob-scale': String(mob.iframeScale),
    '--tv-desk-top': desk.top,
    '--tv-desk-left': desk.left,
    '--tv-desk-width': desk.width,
    '--tv-desk-scale': String(desk.iframeScale),
  } as React.CSSProperties

  return (
    <div className="tv-section-outer">
      {borderBar}

      <div className="tv-container" style={cssVars}>
        {/* ── Video layer — sits behind the TV overlay ── */}
        {embedUrl && (
          <div className="tv-video-layer">
            <iframe
              src={embedUrl}
              title="Vintage TV Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="tv-video-iframe"
            />
          </div>
        )}

        {/* ── Mobile overlay — hidden at 992 px+ ── */}
        {mobileImg && (
          <div className="tv-overlay min-[992px]:hidden">
            <Image
              src={mobileImg.url ?? ''}
              alt={mobileImg.alt ?? 'Vintage television'}
              width={mobileImg.width ?? 750}
              height={mobileImg.height ?? 600}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              loading="lazy"
            />
          </div>
        )}

        {/* ── Desktop overlay — hidden below 992 px ── */}
        {desktopImg && (
          <div className="tv-overlay hidden min-[992px]:block">
            <Image
              src={desktopImg.url ?? ''}
              alt={desktopImg.alt ?? 'Vintage television'}
              width={desktopImg.width ?? 1200}
              height={desktopImg.height ?? 400}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              loading="lazy"
            />
          </div>
        )}

        {/* ── Vintage glass reflection ── */}
        <div className="tv-glass-effect" aria-hidden="true" />
      </div>

      {borderBar}
    </div>
  )
}
