import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { GenerateDescription } from '@payloadcms/plugin-seo/types'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// Recursively extract plain text from a Lexical JSON node tree
function lexicalToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as Record<string, unknown>
  if (typeof n.text === 'string') return n.text
  const children = Array.isArray(n.children) ? n.children : Array.isArray((n.root as Record<string, unknown>)?.children) ? (n.root as Record<string, unknown>).children as unknown[] : null
  if (children) return children.map(lexicalToText).join(' ').replace(/\s+/g, ' ').trim()
  return ''
}

function truncate(text: string, max = 160): string {
  const clean = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : clean.slice(0, max - 1).replace(/\s\S*$/, '') + '…'
}

const generateTitle: GenerateTitle = ({ doc }) => {
  const d = doc as Record<string, unknown>
  const city = d?.city as string | undefined
  const cityLabel = city === 'belgrade' ? 'Belgrade' : city === 'sarajevo' ? 'Sarajevo' : null
  if (!d?.title) return 'Yugotour'
  return cityLabel
    ? `${d.title} | ${cityLabel} | Yugotour`
    : `${d.title} | Yugotour`
}

const generateDescription: GenerateDescription = ({ doc }) => {
  const d = doc as Record<string, unknown>

  // Tours — use the lede field
  if (typeof d.lede === 'string' && d.lede) return truncate(d.lede)

  // TourListPages — combine headline parts
  if (typeof d.introHeaderBlack === 'string' || typeof d.introHeaderRed === 'string') {
    const combined = [d.introHeaderBlack, d.introHeaderRed].filter(Boolean).join(' ')
    if (combined) return truncate(combined)
  }

  // Posts — use the content richtext field
  if (d.content) return truncate(lexicalToText(d.content))

  // Pages — use the first content-type block in layout
  if (Array.isArray(d.layout)) {
    for (const block of d.layout) {
      const b = block as Record<string, unknown>
      if (b.blockType === 'content' && b.richText) return truncate(lexicalToText(b.richText))
      if (b.blockType === 'textContainer' && b.content) return truncate(lexicalToText(b.content))
    }
  }

  return ''
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      admin: { group: 'Collections' },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateDescription,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      admin: { hidden: true },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      admin: { hidden: true },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: { hidden: true },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
