import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCachedGlobal } from './getGlobals'

const resolveImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string | null => {
  if (!image || typeof image !== 'object' || !('url' in image)) return null
  const raw = image.sizes?.og?.url ?? image.url
  if (!raw) return null
  // R2/CDN URLs are already absolute; relative paths need the server origin prepended
  return raw.startsWith('http') ? raw : getServerSideURL() + raw
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const settings = await getCachedGlobal('site-settings', 1)()
  const site = settings?.site as Record<string, unknown> | undefined
  const siteName = (site?.siteTitle as string | undefined) ?? 'Yugotour'

  // Per-page image → site-wide default → static fallback
  const ogImage =
    resolveImageURL(doc?.meta?.image as Media | null) ??
    resolveImageURL(site?.defaultOgImage as Media | null) ??
    getServerSideURL() + '/website-template-OG.webp'

  const title = doc?.meta?.title
    ? `${doc.meta.title} | ${siteName}`
    : siteName

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: [{ url: ogImage }],
      siteName,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
