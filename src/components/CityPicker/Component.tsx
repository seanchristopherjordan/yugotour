import { getMediaUrl } from '@/lib/getMediaUrl'
import { getMediaDoc } from '@/lib/getMediaUrl'
import { CityPicker } from './index'

export async function CityPickerServer() {
  const [
    textureUrl,
    starUrl,
    flagRibbonUrl,
    mapDoc,
    belgradSignDoc,
    sarajevoSignDoc,
    partizanGirlDoc,
  ] = await Promise.all([
    getMediaUrl('texture-blue.webp'),
    getMediaUrl('star.webp'),
    getMediaUrl('flag-ribbon.webp'),
    getMediaDoc('yugo-map.webp'),
    getMediaDoc('belgrade-sign.webp'),
    getMediaDoc('sarajevo-sign.webp'),
    getMediaDoc('partizan-girl.webp'),
  ])

  return (
    <CityPicker
      textureUrl={textureUrl}
      starUrl={starUrl}
      flagRibbonUrl={flagRibbonUrl}
      mapUrl={mapDoc?.url ?? null}
      mapMobileUrl={mapDoc?.sizes?.medium?.url ?? mapDoc?.url ?? null}
      belgradSignUrl={belgradSignDoc?.url ?? null}
      sarajevoSignUrl={sarajevoSignDoc?.url ?? null}
      partizanGirlUrl={partizanGirlDoc?.url ?? null}
      partizanGirlMobileUrl={partizanGirlDoc?.sizes?.small?.url ?? partizanGirlDoc?.url ?? null}
    />
  )
}
