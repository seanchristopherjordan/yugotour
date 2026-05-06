'use client'

import { useState, useMemo } from 'react'
import type { DefaultNodeTypes, DefaultTypedEditorState, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import './faq-section.css'

// Recursively extract plain text from a Lexical serialized node tree,
// including htmlEmbed blocks (stripped of tags).
function extractText(node: any): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (node.fields?.blockType === 'htmlEmbed' && typeof node.fields?.html === 'string') {
    return node.fields.html.replace(/<[^>]+>/g, ' ')
  }
  if (Array.isArray(node.children)) return node.children.map(extractText).join(' ')
  return ''
}

type FAQNodeTypes = DefaultNodeTypes | SerializedBlockNode<{ html?: string | null }>

const faqConverters: JSXConvertersFunction<FAQNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const { value, relationTo } = linkNode.fields.doc!
      if (typeof value !== 'object') throw new Error('Expected value to be an object')
      return relationTo === 'posts' ? `/posts/${value.slug}` : `/${value.slug}`
    },
  }),
  blocks: {
    htmlEmbed: ({ node }: { node: SerializedBlockNode<{ html?: string | null }> }) => (
      <div
        className="faq-html-embed"
        dangerouslySetInnerHTML={{ __html: node.fields.html ?? '' }}
      />
    ),
  },
})

interface FAQItem {
  question: string
  answer?: DefaultTypedEditorState | null
  id?: string | null
}

interface FAQSectionProps {
  items: FAQItem[]
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openKey, setOpenKey] = useState<string | number | null>(null)
  const [filterQuery, setFilterQuery] = useState('')

  // Build searchable strings once per items array
  const searchIndex = useMemo(
    () =>
      items.map((item, i) => ({
        item,
        key: item.id ?? i,
        searchText: [
          item.question,
          item.answer ? extractText((item.answer as any).root) : '',
        ]
          .join(' ')
          .toLowerCase(),
      })),
    [items],
  )

  const visibleItems = useMemo(() => {
    const q = filterQuery.trim().toLowerCase()
    if (q.length < 4) return searchIndex
    return searchIndex.filter(({ searchText }) => searchText.includes(q))
  }, [filterQuery, searchIndex])

  if (!items.length) return null

  return (
    <div className="faq-section container">
      <div className="faq-filter-wrap">
        <input
          type="search"
          className="faq-filter"
          placeholder="Filter"
          value={filterQuery}
          onChange={(e) => {
            setFilterQuery(e.target.value)
            setOpenKey(null)
          }}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {visibleItems.map(({ item, key }) => {
        const isOpen = openKey === key
        return (
          <div key={key} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setOpenKey(isOpen ? null : key)}
              aria-expanded={isOpen}
              type="button"
            >
              <span className="faq-question-text">{item.question}</span>
              <span className="faq-icon" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div className={`faq-answer-wrapper${isOpen ? ' faq-answer-wrapper--open' : ''}`}>
              <div className="faq-answer-inner">
                <div className="faq-answer-body">
                  {item.answer != null && (
                    <ConvertRichText
                      data={item.answer as DefaultTypedEditorState}
                      converters={faqConverters}
                      className="faq-answer-rich"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
