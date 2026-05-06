'use client'

import { useState } from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import './faq-section.css'

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
                    <RichText
                      data={item.answer}
                      enableGutter={false}
                      enableProse={false}
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
