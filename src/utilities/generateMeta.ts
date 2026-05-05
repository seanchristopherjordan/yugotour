import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCachedGlobal } from './getGlobals'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

async function getSiteTitle(): Promise<string> {
  const settings = await getCachedGlobal('site-settings', 0)()
  const site = settings.site as Record<string, unknown> | undefined
  return (site?.siteTitle as string | undefined) ?? 'Yugotour'
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const [ogImage, siteName] = await Promise.all([
    Promise.resolve(getImageURL(doc?.meta?.image)),
    getSiteTitle(),
  ])

  const title = doc?.meta?.title
    ? `${doc.meta.title} | ${siteName}`
    : siteName

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      siteName,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
