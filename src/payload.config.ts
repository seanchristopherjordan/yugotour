import { s3Storage } from '@payloadcms/storage-s3'
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Bookings } from './collections/Bookings'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Tours } from './collections/Tours'
import { TourListPages } from './collections/TourListPages'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './SiteSettings/config'
import { HomepageIntro } from './HomepageIntro/config'
import { TourOrder } from './TourOrder/config'
import { plugins as existingPlugins } from './plugins' // Renamed to avoid conflict
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    // 1. Add this React Query block to kill the devtools "bug"
    reactQuery: {
      devtools: false,
    },
    // 2. This is also where you'd set your favicon PNG for the admin panel
    meta: {
      titleSuffix: '- Yugotour',
      favicon: '/favicon.png', // Ensure this file is in your /public folder
    },
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [Pages, Posts, Media, Categories, Tours, TourListPages, Users, Bookings],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings, HomepageIntro, TourOrder],
  
  // --- PLUGINS SECTION ---
  plugins: [
    ...existingPlugins, // Keeps your boilerplate plugins (like Search, SEO, etc.)
    s3Storage({
      collections: {
        [Media.slug]: {
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
            const cdnBase = (process.env.NEXT_PUBLIC_S3_URL ?? '').replace(/\/$/, '')
            const key = prefix ? `${prefix}/${filename}` : filename
            return `${cdnBase}/${key}`
          },
        },
      },
      bucket: process.env.S3_BUCKET ?? 'yugotour-assets',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
        },
      },
    }),
  ],
  
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        if (!secret) return false
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})