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

// File extensions and path prefixes that are never part of a Next.js app.
// Blocking these at the edge prevents scanner bots from waking Payload at all.
const BOT_EXTENSION = /\.(php|asp|aspx|jsp|cgi|env|git|sql|bak|sh|bash|py|pl|rb|xml|conf|ini)$/i
const BOT_PREFIX = /^\/(wp-admin|wp-login|wp-content|wp-includes|phpMyAdmin|\.env|\.git|\.htaccess|\.htpasswd|admin|administrator)/i

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Guard 1: known-bad scanner patterns
  if (BOT_EXTENSION.test(pathname) || BOT_PREFIX.test(pathname)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Guard 2: unknown /api/* endpoints
  if (pathname.startsWith('/api/')) {
    const firstSegment = pathname.slice(5).split('/')[0]
    if (firstSegment && !API_ALLOWLIST.has(firstSegment)) {
      return new NextResponse('Not Found', { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|textures/|favicon\\.ico).*)'],
}
