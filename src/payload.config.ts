import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Bookings } from './collections/Bookings'
import { Categories } from './collections/Categories'
import { ContactMessages } from './collections/ContactMessages'
import { EmailTemplates } from './collections/EmailTemplates'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Tours } from './collections/Tours'
import { OptionalExtras } from './collections/OptionalExtras'
import { TourListPages } from './collections/TourListPages'
import { Sliders } from './collections/Sliders'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './SiteSettings/config'
import { HomepageIntro } from './HomepageIntro/config'
import { TourOrder } from './TourOrder/config'
import { FAQ } from './FAQ/config'
import { plugins as existingPlugins } from './plugins' // Renamed to avoid conflict
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { seedEmailTemplates } from './seed/emailTemplates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: getServerSideURL(),
  routes: {
    admin: '/yugo-ulaz',
  },
  admin: {
    meta: {
      titleSuffix: '- Yugotour',
    },
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      afterNavLinks: ['@/components/BookingsNavFilters'],
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
  email: resendAdapter({
    defaultFromAddress: 'noreply@send.yugotour.com',
    defaultFromName: 'Yugotour',
    apiKey: process.env.YUGOTOUR_RESEND_KEY ?? '',
  }),
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    // Collections
    Posts, Media, Users, Sliders, Categories,
    // Site
    Pages,
    // Tours
    Tours, OptionalExtras, TourListPages,
    // Comms
    ContactMessages, Bookings, EmailTemplates,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [
    // Collections
    FAQ,
    // Site
    Header, Footer, SiteSettings, HomepageIntro,
    // Tours
    TourOrder,
  ],
  
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
          generateMetadata: () => ({
            CacheControl: 'public, max-age=31536000, immutable',
          }),
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
  
  onInit: async (payload) => {
    await seedEmailTemplates(payload)
  },
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