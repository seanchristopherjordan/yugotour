import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
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
    EXPERIMENTAL_TableFeature(),
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})
