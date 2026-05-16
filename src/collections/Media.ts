import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { revalidateTag } from 'next/cache'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { generateAltText } from './Media/hooks/generateAltText'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media Asset', plural: 'Media Assets' },
  admin: {
    group: 'Collections',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false, // Recommended for SEO on your tour images
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  hooks: {
    afterChange: [
      generateAltText,
      ({ doc, req: { context } }) => {
        if (!context.disableRevalidate) {
          revalidateTag('media', 'page')
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req: { context } }) => {
        if (!context.disableRevalidate) {
          revalidateTag('media', {})
        }
        return doc
      },
    ],
    beforeOperation: [
      ({ args, operation }) => {
        if ((operation === 'create' || operation === 'update') && args.req?.file) {
          const mimeType: string = args.req.file.mimetype ?? ''
          if (mimeType === 'image/svg+xml') {
            ;(args.req.file as unknown as Record<string, unknown>).sizes = {}
          }
        }
        return args
      },
    ],
  },
  upload: {
    // When using a storage adapter like Uploadthing, staticDir is ignored by the cloud,
    // but it's good to keep a simple string here for local development reference.
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    formatOptions: {
      format: 'webp',
      options: { quality: 92 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}