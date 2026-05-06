'use client'

import { useState } from 'react'
import type { DefaultNodeTypes, DefaultTypedEditorState, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import './faq-section.css'

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
    htmlEmbed: ({ node }) => (
      <div
        className="faq-html-embed"
        dangerouslySetInnerHTML={{ __html: (node as SerializedBlockNode<{ html?: string | null }>).fields.html ?? '' }}
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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items.length) return null

  return (
    <div className="faq-section container">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.id ?? index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? null : index)}
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
