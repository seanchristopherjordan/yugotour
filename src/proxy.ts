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
  'sync-reviews',
])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /api/* — allow known endpoints, block everything else
  if (pathname.startsWith('/api/')) {
    const firstSegment = pathname.slice(5).split('/')[0]
    if (firstSegment && !API_ALLOWLIST.has(firstSegment)) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return NextResponse.next()
  }

  // Old WordPress media uploads are permanently gone — 410 tells crawlers to
  // drop these URLs from their index rather than keep retrying.
  if (pathname.startsWith('/wp-content/uploads/')) {
    return new NextResponse('Gone', { status: 410 })
  }

  // Everything else matched by the config matchers below is a dead path
  // from the old WordPress site — kill it at the edge before it wakes Payload.
  return new NextResponse('Not Found', { status: 404 })
}

export const config = {
  matcher: [
    // Unknown API endpoints
    '/api/:path*',
    // Old WordPress URL structures — never exist in this Next.js site
    '/blog/:path*',
    '/category/:path*',
    '/tag/:path*',
    '/author/:path*',
    '/feed/:path*',
    '/wp-content/:path*',
    '/wp-admin/:path*',
    '/wp-includes/:path*',
    '/wp-login.php',
    '/xmlrpc.php',
    '/wp-json/:path*',
    // All PHP files (scanners probing for WordPress, file managers, etc.)
    '/(.*\\.php)',
    // Generic scanner bait
    '/admin/:path*',
    '/phpmyadmin/:path*',
    '/index.php',
    '/.env',
    '/.env.local',
    '/.env.development',
    '/.env.production',
    '/.git/:path*',
    '/.aws/:path*',
    '/env',
    '/config.json',
    '/js/:path*',
    '/backend/:path*',
    '/sitemap.rss',
    // WordPress plugin / theme asset paths
    '/administrator/:path*',
    '/pma/:path*',
    '/dashboard/:path*',
    '/cpanel/:path*',
    '/actuator/:path*',
    '/telescope/:path*',
    '/bull-board/:path*',
    '/express-status-monitor',
    '/package.json',
    '/package-lock.json',
    '/docker-compose.yml',
    '/settings.py',
    '/assets/:path*',
    // Old WordPress / legacy paths with no content on this site
    '/career/:path*',
    // Old iOS icon request
    '/apple-touch-icon-precomposed.png',
    // Well-known / security crawler paths with no real content on this site
    '/.well-known/:path*',
    '/security.txt',
    // WordPress SEO plugin sitemaps — real sitemap is /sitemap.xml
    '/post-sitemap.xml',
    '/post_tag-sitemap.xml',
    '/category-sitemap.xml',
    '/the_grid_sitemap.xml',
    // Ad network bait — this site does not serve ads
    '/ads.txt',
  ],
}
