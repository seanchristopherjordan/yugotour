import { TalesFromTheRoad } from '@/components/TalesFromTheRoad'

export interface ReviewsSectionBlockProps {
  blockType: 'reviewsSection'
  label?: string | null
}

export async function ReviewsSectionBlock({}: ReviewsSectionBlockProps) {
  return <TalesFromTheRoad textureUrl="/textures/texture-gold.webp" />
}
