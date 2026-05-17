import { NextResponse, type NextRequest } from 'next/server'

// Known /api/ first-segments. Anything else → instant 404 at the edge.
// Payload never initialises and Neon never receives a connection.
const API_ALLOWLIST = new Set([
  // Payload collections
  'pages',
  'posts',
  'media',
  'users',
  'sliders',
  'categories',
  'bookings',
  'contact-messages',
  'email-templates',
  'optional-extras',
  'reviews',
  'tour-list-pages',
  'tours',
  'redirects',
  // Payload internals
  'payload-preferences',
  'payload-migrations',
  'payload-jobs',
  'payload-locked-documents',
  // Payload misc endpoints
  'globals',
  'access',
  // Custom app/api/* routes
  'booking',
  'contact',
  'unread-counts',
  'sync-reviews',
])

// Multi-segment paths that have real server-rendered content.
// Everything else with 2+ segments is a guaranteed 404 — no point waking Payload.
const VALID_PREFIXES = ['/tours/', '/posts/', '/yugo-ulaz/']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Guard 1: unknown /api/* endpoints
  if (pathname.startsWith('/api/')) {
    const firstSegment = pathname.slice(5).split('/')[0]
    if (firstSegment && !API_ALLOWLIST.has(firstSegment)) {
      return new NextResponse('Not Found', { status: 404 })
    }
    return NextResponse.next()
  }

  // Guard 2: multi-segment frontend paths that can't match real content.
  // Single-segment paths (/belgrade, /sarajevo, etc.) are fine — skip them.
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length >= 2 && !VALID_PREFIXES.some((p) => pathname.startsWith(p))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  // Run on everything except Next.js internals and static assets.
  matcher: ['/((?!_next/static|_next/image|textures/|favicon\\.ico).*)'],
}
