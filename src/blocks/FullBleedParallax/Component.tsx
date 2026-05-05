import { TourFullBleedImage } from '@/components/TourFullBleedImage'

interface FullBleedParallaxBlockProps {
  image?: { url?: string | null; alt?: string | null } | string | null
  disableInnerContainer?: boolean
}

export function FullBleedParallaxBlock({ image }: FullBleedParallaxBlockProps) {
  const imageObj = typeof image === 'object' && image !== null ? image : null
  const imageUrl = imageObj?.url ?? null

  if (!imageUrl) return null

  return <TourFullBleedImage imageUrl={imageUrl} alt={imageObj?.alt ?? ''} />
}
