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
    // /in-the-media now has its own page
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

    // ── Yugopedia ─────────────────────────────────────────────────────────────
    ...both('/yugo', '/yugopedia'),

    // ── City page redirects ───────────────────────────────────────────────────
    ...both('/yugotour-belgrade', '/belgrade-tours'),
    ...both('/yugotour-sarajevo', '/sarajevo-tours'),
    ...both('/yugotour/sarajevo', '/sarajevo-tours'),

    // ── Blog: /blog and /blog/[slug] are now real pages — no redirect needed ───
    // Redirect the old /posts listing to the canonical /blog
    ...both('/posts', '/blog'),

    // ── Legacy WP media assets ────────────────────────────────────────────────
    { source: '/wp-content/yugoslavia.jpg', destination: '/blog/yugoslavia-intro', permanent: true },

    // ── Legacy WP section wildcards → homepage ────────────────────────────────
    ...both('/media-clipping', 'https://www.yugotour.com'),
    { source: '/media-clipping/:path+', destination: 'https://www.yugotour.com', permanent: true },
  ]
}
