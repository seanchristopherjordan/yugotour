import './video-embed.css'

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\s?]+)/,
  )
  return match?.[1] ?? null
}

interface VideoEmbedBlockProps {
  youtubeUrl?: string | null
  position?: 'full' | 'left' | 'right' | null
  caption?: string | null
  disableInnerContainer?: boolean
}

export function VideoEmbedBlock({ youtubeUrl, position = 'full', caption }: VideoEmbedBlockProps) {
  if (!youtubeUrl) return null

  const videoId = extractYouTubeId(youtubeUrl)
  if (!videoId) return null

  const pos = position ?? 'full'

  return (
    <div className={`video-embed-outer video-embed-outer--${pos}`}>
      <div className="video-embed-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Embedded video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="video-embed-iframe"
        />
      </div>
      {caption && <p className="video-embed-caption">{caption}</p>}
    </div>
  )
}
