import { getMediaUrl } from '@/lib/getMediaUrl'
import { CityPicker } from './index'

export async function CityPickerServer() {
  const [
    textureUrl,
    starUrl,
    flagRibbonUrl,
    mapUrl,
    belgradSignUrl,
    sarajevoSignUrl,
    partizanGirlUrl,
  ] = await Promise.all([
    getMediaUrl('texture-blue.webp'),
    getMediaUrl('star.webp'),
    getMediaUrl('flag-ribbon.webp'),
    getMediaUrl('yugo-map.webp'),
    getMediaUrl('belgrade-sign.webp'),
    getMediaUrl('sarajevo-sign.webp'),
    getMediaUrl('partizan-girl.webp'),
  ])

  return (
    <CityPicker
      textureUrl={textureUrl}
      starUrl={starUrl}
      flagRibbonUrl={flagRibbonUrl}
      mapUrl={mapUrl}
      belgradSignUrl={belgradSignUrl}
      sarajevoSignUrl={sarajevoSignUrl}
      partizanGirlUrl={partizanGirlUrl}
    />
  )
}
