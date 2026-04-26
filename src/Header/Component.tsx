import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/lib/getMediaUrl'
import { HeaderClient } from './Component.client'

export async function Header() {
  const [
    siteSettings,
    logoUrl,
    navTextureUrl,
    menuTextureUrl,
    menuDefaultUrl,
    menuBelgradeUrl,
    menuSarajevoUrl,
    menuYugopediaUrl,
    menuAboutUrl,
    menuBookNowUrl,
  ] = await Promise.all([
    getCachedGlobal('site-settings', 0)(),
    getMediaUrl('yugotour-header-logo.svg'),
    getMediaUrl('texture-cream.webp'),
    getMediaUrl('texture-blue.webp'),
    getMediaUrl('menu-default.webp'),
    getMediaUrl('menu-belgrade.webp'),
    getMediaUrl('menu-sarajevo.webp'),
    getMediaUrl('menu-yugopedia.webp'),
    getMediaUrl('menu-aboutus.webp'),
    getMediaUrl('menu-booknow.webp'),
  ])

  return (
    <HeaderClient
      logoUrl={logoUrl}
      navTextureUrl={navTextureUrl}
      megaMenuProps={{
        textureUrl: menuTextureUrl,
        images: {
          default: menuDefaultUrl,
          belgrade: menuBelgradeUrl,
          sarajevo: menuSarajevoUrl,
          yugopedia: menuYugopediaUrl,
          aboutUs: menuAboutUrl,
          bookNow: menuBookNowUrl,
        },
        socialLinks: [
          {
            city: 'Belgrade',
            igHref: siteSettings.belgrade?.instagram ?? null,
            fbHref: siteSettings.belgrade?.facebook ?? null,
          },
          {
            city: 'Sarajevo',
            igHref: siteSettings.sarajevo?.instagram ?? null,
            fbHref: siteSettings.sarajevo?.facebook ?? null,
          },
        ],
      }}
    />
  )
}
