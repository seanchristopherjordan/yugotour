import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/lib/getMediaUrl'
import { IntroSection } from './index'

export async function IntroSectionServer() {
  const [intro, spomentikUrl, tripadvisorBadgeUrl, carsDesktopUrl, carsMobileUrl] =
    await Promise.all([
      getCachedGlobal('homepage-intro', 0)(),
      getMediaUrl('halftoned-spomenik.webp'),
      getMediaUrl('tripadvisor-travelers-choice-badge.webp'),
      getMediaUrl('yugos-desktop.webp'),
      getMediaUrl('yugos-mobile.webp'),
    ])

  const textureUrl = '/textures/texture-cream.webp'
  const textureRedUrl = '/textures/texture-red.webp'

  const preloadImages = [tripadvisorBadgeUrl, carsMobileUrl].filter(Boolean) as string[]

  return (
    <>
      {preloadImages.map((url) => (
        <link key={url} rel="preload" as="image" href={url} />
      ))}
      <IntroSection
        headlineTop={intro.headlineTop ?? 'YUGOSLAV HISTORY'}
        headlineBottom={intro.headlineBottom ?? 'ON FOUR WHEELS!'}
        bodyText={
          intro.bodyText ??
          'Take a legendary ride from the rise to the fall of Yugoslavia, in the capital cities of Bosnia-Hercegovina and Serbia. Feel, hear, and smell the history of the country with a car named after it: The YUGO!'
        }
        ctaText={intro.ctaText ?? 'MORE ABOUT US'}
        ctaUrl={intro.ctaUrl ?? '/about-us'}
        howItWorksTitle={intro.howItWorksTitle ?? 'How it works:'}
        bullets={[
          intro.bullet1 ?? 'Choose your city & tour',
          intro.bullet2 ?? 'Pick your date & optional extras',
          intro.bullet3 ?? 'Hop in the YUGO & enjoy the ride!',
        ]}
        textureUrl={textureUrl}
        textureRedUrl={textureRedUrl}
        spomentikUrl={spomentikUrl}
        tripadvisorBadgeUrl={tripadvisorBadgeUrl}
        carsDesktopUrl={carsDesktopUrl}
        carsMobileUrl={carsMobileUrl}
      />
    </>
  )
}
