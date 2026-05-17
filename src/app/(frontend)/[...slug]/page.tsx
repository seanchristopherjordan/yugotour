import { notFound } from 'next/navigation'

// Multi-segment paths have no real content on this site.
// Returning notFound() here directly avoids loading the Payload bundle
// (39 MB) just to produce a 404 for bot traffic hitting deep paths.
export default function CatchAllPage() {
  notFound()
}
