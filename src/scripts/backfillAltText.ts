import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'
import { getPayload } from 'payload'
import config from '../../src/payload.config'

const client = new Anthropic()

async function generateAlt(url: string): Promise<string | null> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 128,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'url', url } },
          {
            type: 'text',
            text: 'Write a concise, descriptive alt text for this image in 10–15 words. Return only the alt text, no quotation marks, no trailing punctuation.',
          },
        ],
      },
    ],
  })

  const block = response.content[0]
  return block.type === 'text' && block.text.trim() ? block.text.trim() : null
}

async function run() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'media',
    where: {
      or: [
        { alt: { equals: '' } },
        { alt: { exists: false } },
      ],
    },
    limit: 1000,
    pagination: false,
  })

  const images = docs.filter((doc) => {
    const mime = doc.mimeType as string | undefined
    return doc.url && mime && mime.startsWith('image/') && mime !== 'image/svg+xml'
  })

  console.log(`Found ${images.length} images without alt text.`)
  if (images.length === 0) {
    process.exit(0)
  }

  let updated = 0
  let failed = 0

  for (const doc of images) {
    try {
      const altText = await generateAlt(doc.url as string)
      if (!altText) { failed++; continue }

      await payload.update({
        collection: 'media',
        id: doc.id as number,
        data: { alt: altText },
        context: { skipAltGeneration: true, disableRevalidate: true },
      })

      console.log(`[${++updated}/${images.length}] ${doc.filename} → "${altText}"`)
    } catch (err) {
      console.error(`Failed for ${doc.filename}:`, err)
      failed++
    }
  }

  console.log(`\nDone. Updated: ${updated}, Failed: ${failed}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
