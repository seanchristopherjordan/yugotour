import Image from 'next/image'
import { tvConfig } from './tv-config'

const TV_MOBILE_URL  = 'https://media.yugotour-assets.workers.dev/television-mobile.webp'
const TV_DESKTOP_URL = 'https://media.yugotour-assets.workers.dev/television-desktop.webp'

export interface TvSectionBlockProps {
  blockType: 'tvSection'
  youtubeUrl?: string | null
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

export function TvSectionBlock({ youtubeUrl }: TvSectionBlockProps) {
  const { mobile: mob, desktop: desk, youtubeParams } = tvConfig

  const videoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?${youtubeParams}`
    : null

  const borderBar = <div style={{ height: '25px', backgroundColor: '#212121' }} />

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
        <div className="tv-overlay min-[992px]:hidden">
          <Image
            src={TV_MOBILE_URL}
            alt="Vintage television"
            width={750}
            height={600}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            loading="lazy"
            unoptimized
          />
        </div>

        {/* ── Desktop overlay — hidden below 992 px ── */}
        <div className="tv-overlay hidden min-[992px]:block">
          <Image
            src={TV_DESKTOP_URL}
            alt="Vintage television"
            width={1200}
            height={400}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            loading="lazy"
            unoptimized
          />
        </div>

        {/* ── Vintage glass reflection ── */}
        <div className="tv-glass-effect" aria-hidden="true" />
      </div>

      {borderBar}
    </div>
  )
}
