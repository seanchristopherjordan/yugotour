import { getMediaUrl } from '@/lib/getMediaUrl'
import { TalesFromTheRoad } from '@/components/TalesFromTheRoad'

export interface ReviewsSectionBlockProps {
  blockType: 'reviewsSection'
  label?: string | null
}

export async function ReviewsSectionBlock({}: ReviewsSectionBlockProps) {
  const textureUrl = await getMediaUrl('texture-gold.webp')
  return <TalesFromTheRoad textureUrl={textureUrl} />
}
