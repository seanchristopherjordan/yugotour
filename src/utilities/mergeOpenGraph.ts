import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Drive Yugoslavia in a vintage Yugo.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'Yugotour',
  title: 'Yugotour',
}

export const mergeOpenGraph = (og?: Metadata['openGraph'] & { siteName?: string }): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
