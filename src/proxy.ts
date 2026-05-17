import { NextResponse, type NextRequest } from 'next/server'

// Known /api/ first-segments for this project.
// Anything not in this set is bot/scanner traffic — blocked at the edge so
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    const firstSegment = pathname.slice(5).split('/')[0]
    if (firstSegment && !API_ALLOWLIST.has(firstSegment)) {
      return new NextResponse('Not Found', { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
