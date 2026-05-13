import { PayloadRedirects } from '@/components/PayloadRedirects'

type Args = {
  params: Promise<{ slug: string[] }>
}

// Catch-all handler for multi-segment paths (e.g. /yugotour/sarajevo).
// Single-segment paths are handled by /[slug]/page.tsx.
// This only exists to give PayloadRedirects a chance to fire before 404.
export default async function CatchAllPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const url = '/' + slug.join('/')
  return <PayloadRedirects url={url} />
}
