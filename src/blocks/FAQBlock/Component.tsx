import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Faq } from '@/payload-types'
import { FAQSection } from '@/components/FAQSection'
import { unstable_cache } from 'next/cache'

const getFAQ = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'faq', depth: 0 }) as Promise<Faq>
  },
  ['faq-global'],
  { tags: ['faq'] },
)

interface FAQBlockProps {
  label?: string | null
  disableInnerContainer?: boolean
}

export async function FAQBlockComponent(_props: FAQBlockProps) {
  const faq = await getFAQ()
  const items = faq.items ?? []

  if (!items.length) return null

  return <FAQSection items={items} />
}
