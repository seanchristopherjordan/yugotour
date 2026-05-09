import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  TableFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const textBlockLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2'] }),
    UnorderedListFeature(),
    OrderedListFeature(),
    TableFeature(),
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})
