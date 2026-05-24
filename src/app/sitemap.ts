import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const revalidate = 86400 // 24 hours — revalidation hooks handle immediate updates

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://yugotour.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })

  const [toursData, pagesData, postsData] = await Promise.all([
    payload.find({
      collection: 'tours',
      draft: false,
      limit: 1000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      pagination: false,
      overrideAccess: true,
      where: { _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const tourEntries: MetadataRoute.Sitemap = toursData.docs.map((tour) => ({
    url: `${BASE_URL}/tours/${tour.slug}`,
    lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Filter out the home page slug — it maps to / not /home
  const pageEntries: MetadataRoute.Sitemap = pagesData.docs
    .filter((page) => page.slug !== 'home')
    .map((page) => ({
      url: `${BASE_URL}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const postEntries: MetadataRoute.Sitemap = postsData.docs
    .filter((post) => Boolean(post.slug))
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/belgrade-tours`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sarajevo-tours`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/in-the-media`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  return [...staticEntries, ...tourEntries, ...pageEntries, ...postEntries]
}
