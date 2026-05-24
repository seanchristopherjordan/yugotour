import type { CollectionAfterChangeHook } from 'payload'

export const generateAltText: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  // Skip if this update was triggered by the hook itself
  if (req.context?.skipAltGeneration) return doc

  // Only on create, only when alt is missing, only for raster images
  if (operation !== 'create') return doc
  if (doc.alt && (doc.alt as string).trim().length > 0) return doc
  if (!doc.url) return doc

  const mime = doc.mimeType as string | undefined
  if (!mime || !mime.startsWith('image/') || mime === 'image/svg+xml') return doc

  if (!process.env.ANTHROPIC_API_KEY) return doc

  // Lazy-load the SDK — only runs when an image is actually being uploaded,
  // not on every cold start of every Payload route.
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const response = await client.messages.create({
      // Haiku is fast and cheap — appropriate for this high-frequency automation
      model: 'claude-haiku-4-5',
      max_tokens: 128,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'url', url: doc.url as string },
            },
            {
              type: 'text',
              text: 'Write a concise, descriptive alt text for this image in 10–15 words. Return only the alt text, no quotation marks, no trailing punctuation.',
            },
          ],
        },
      ],
    })

    const block = response.content[0]
    if (block.type !== 'text' || !block.text.trim()) return doc

    const altText = block.text.trim()

    await req.payload.update({
      collection: 'media',
      id: doc.id as number,
      data: { alt: altText },
      context: { skipAltGeneration: true, disableRevalidate: true },
    })

    return { ...doc, alt: altText }
  } catch (err) {
    req.payload.logger.error({ err, mediaId: doc.id }, 'Auto alt-text generation failed')
    return doc
  }
}
