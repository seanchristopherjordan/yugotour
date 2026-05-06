import type { GlobalConfig, Block } from 'payload'
import {
  BlocksFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '@/access/authenticated'
import { revalidateFAQ } from './hooks/revalidateFAQ'

const HtmlEmbedBlock: Block = {
  slug: 'htmlEmbed',
  labels: { singular: 'HTML Embed', plural: 'HTML Embeds' },
  fields: [
    {
      name: 'html',
      type: 'code',
      label: 'HTML Code',
      admin: { language: 'html' },
    },
  ],
}

export const FAQ: GlobalConfig = {
  slug: 'faq',
  label: 'FAQs',
  admin: { group: 'Collections' },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateFAQ],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'FAQ Items',
      labels: {
        singular: 'Question',
        plural: 'Questions',
      },
      admin: {
        components: {
          RowLabel: '@/FAQ/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'richText',
          label: 'Answer',
          editor: lexicalEditor({
            features: [
              ParagraphFeature(),
              BoldFeature(),
              ItalicFeature(),
              UnderlineFeature(),
              LinkFeature({
                enabledCollections: ['pages', 'posts'],
              }),
              BlocksFeature({ blocks: [HtmlEmbedBlock] }),
            ],
          }),
        },
      ],
    },
  ],
}
