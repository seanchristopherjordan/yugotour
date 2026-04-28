import { getMediaUrl } from './getMediaUrl'

export interface SimulatorAssets {
  bgDesktopUrl: string | null
  bgMobileUrl: string | null
  driveVideoUrl: string | null
  carInteriorUrl: string | null
  steeringWheelUrl: string | null
  soundOffUrl: string | null
  soundOnUrl: string | null
  radioAudioUrl: string | null
  hornAudioUrl: string | null
}

export async function getSimulatorAssets(): Promise<SimulatorAssets> {
  const [
    bgDesktopUrl,
    bgMobileUrl,
    driveVideoUrl,
    carInteriorUrl,
    steeringWheelUrl,
    soundOffUrl,
    soundOnUrl,
    radioAudioUrl,
    hornAudioUrl,
  ] = await Promise.all([
    getMediaUrl('space-age-wireframe-desktop.webp'),
    getMediaUrl('space-age-wireframe-mobile.webp'),
    getMediaUrl('yugo-tour-simulator-smallest-possible.webm'),
    getMediaUrl('CarInterior2.webp'),
    getMediaUrl('steering-wheel-570kb.webp'),
    getMediaUrl('sound-off.webp'),
    getMediaUrl('sound-on.webp'),
    getMediaUrl('yugo-simulator-radio-chatter.mp3'),
    getMediaUrl('horn.mp3'),
  ])

  return {
    bgDesktopUrl,
    bgMobileUrl,
    driveVideoUrl,
    carInteriorUrl,
    steeringWheelUrl,
    soundOffUrl,
    soundOnUrl,
    radioAudioUrl,
    hornAudioUrl,
  }
}
