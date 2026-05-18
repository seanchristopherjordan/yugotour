import type { NextConfig } from 'next'

type Redirect = Awaited<ReturnType<Exclude<NextConfig['redirects'], undefined>>>[number]

// Returns both /path and /path/ variants so trailing-slash differences never matter.
function both(source: string, destination: string): Redirect[] {
  const clean = source.replace(/\/$/, '')
  return [
    { source: clean, destination, permanent: true },
    { source: `${clean}/`, destination, permanent: true },
  ]
}

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect: Redirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  return [
    internetExplorerRedirect,

    // Redirect any request hitting the raw Vercel deployment URL to production.
    // Bots discover *.vercel.app URLs and hammer them directly, bypassing CDN protection.
    {
      source: '/:path*',
      has: [{ type: 'host' as const, value: '.*\\.vercel\\.app' }],
      destination: 'https://www.yugotour.com/:path*',
      permanent: false,
    },

    // ── Page redirects ────────────────────────────────────────────────────────
    ...both('/about',         '/about-us'),
    ...both('/accommodation', 'https://www.yugotour.com'),
    ...both('/dislaimer',     '/terms-of-service'),
    ...both('/in-the-media',  'https://www.yugotour.com'),
    ...both('/map',           'https://www.yugotour.com'),

    // ── Tour slug changes (old WP slugs → new Next.js slugs) ─────────────────
    ...both('/architecture-tour',                  '/tours/architecture-tour-brutalism-in-socialist-yugoslavia'),
    ...both('/belgrade-highlights',                '/tours/belgrade-highlights-tour'),
    ...both('/brutalist-zenica-yugo-tour',         '/tours/brutalist-zenica-yugotour'),
    ...both('/grand-yugotour',                     '/tours/grand-yugotour'),
    ...both('/neretva-yugo-tour',                  '/tours/neretva-yugotour'),
    ...both('/olympic-yugo-tour',                  '/tours/olympic-yugotour'),
    ...both('/sarajevo-yugo-tour',                 '/tours/sarajevo-yugotour'),
    ...both('/siege-of-sarajevo-yugo-tour',        '/tours/siege-of-sarajevo-yugotour'),
    ...both('/sutjeska-yugo-tour',                 '/tours/sutjeska-yugotour'),
    ...both('/the-rise-and-fall-of-a-nation-tour', '/tours/rise--fall-of-a-nation-tour'),

    // ── City page redirects ───────────────────────────────────────────────────
    ...both('/yugotour-belgrade', '/belgrade-tours'),
    ...both('/yugotour-sarajevo', '/sarajevo-tours'),
    ...both('/yugotour/sarajevo', '/sarajevo-tours'),

    // ── Blog: specific entry first, then wildcard ─────────────────────────────
    // /blog alone → posts index; /blog/* → homepage (old WP posts have no equivalent)
    { source: '/blog',        destination: '/posts',                   permanent: true },
    { source: '/blog/:path+', destination: 'https://www.yugotour.com', permanent: true },

    // ── Legacy WP section wildcards → homepage ────────────────────────────────
    ...both('/media-clipping', 'https://www.yugotour.com'),
    { source: '/media-clipping/:path+', destination: 'https://www.yugotour.com', permanent: true },
  ]
}
