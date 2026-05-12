import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6"
      style={{ minHeight: '60vh', paddingTop: '6rem', paddingBottom: '6rem' }}
    >
      <p
        style={{
          fontFamily: 'var(--font-tungsten-compressed)',
          fontWeight: 700,
          fontSize: 'clamp(11rem, 28vw, 25rem)',
          lineHeight: 0.85,
          color: '#D4B96A',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        E JBG
      </p>

      <p
        style={{
          fontFamily: 'var(--font-tungsten-compressed)',
          fontWeight: 700,
          fontSize: 'clamp(5rem, 14vw, 13rem)',
          lineHeight: 0.85,
          color: '#212121',
          margin: '0 0 1.5rem',
          textTransform: 'uppercase',
        }}
      >
        404.
      </p>

      <p
        style={{
          fontFamily: 'var(--font-cooper-black)',
          fontWeight: 400,
          fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          color: '#212121',
          margin: '0 0 2.5rem',
        }}
      >
        We couldn&apos;t find that page.
      </p>

      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-art-grotesk)',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--color-yugo-cream)',
          backgroundImage: "url('/textures/texture-red.webp')",
          backgroundRepeat: 'repeat',
          backgroundColor: 'var(--color-yugo-red)',
          padding: '14px 32px',
          borderRadius: '3px',
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        Go Home
      </Link>
    </div>
  )
}
