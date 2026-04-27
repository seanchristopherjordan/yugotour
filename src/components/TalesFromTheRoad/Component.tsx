import { getMediaUrl } from '@/lib/getMediaUrl'
import { TalesFromTheRoad } from './index'

export async function TalesFromTheRoadServer() {
  const textureUrl = await getMediaUrl('texture-gold.webp')
  return <TalesFromTheRoad textureUrl={textureUrl} />
}
