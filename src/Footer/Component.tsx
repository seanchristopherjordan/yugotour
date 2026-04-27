import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/lib/getMediaUrl'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Book Now', href: '#book' },
  { label: 'Belgrade Tours', href: '/belgrade' },
  { label: 'Sarajevo Tours', href: '/sarajevo' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Yugopedia', href: '/yugopedia' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Media', href: '/media' },
  { label: 'Contact Us', href: '/contact' },
]

const FINE_PRINT_LINKS = [
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Accessibility', href: '/accessibility' },
]

const h5Class =
  'font-fakt font-bold text-[0.8rem] min-[402px]:text-[0.85rem] tracking-[1px] uppercase text-black/35 leading-none m-0 mb-[1.6rem] min-[402px]:mb-[2rem]'

const bodyTextClass =
  'font-fakt text-yugo-cream text-[1rem] min-[402px]:text-[1.1rem] leading-[1.4] m-0'

// Nav link: cream text, relative container for the sliding underline span
const navLinkClass =
  'relative inline-block font-fakt text-yugo-cream no-underline text-[1rem] min-[402px]:text-[1.1rem] leading-[1.4] group'

export async function Footer() {
  const [
    siteSettings,
    textureRedUrl,
    stampUrl,
    footerLogoUrl,
    qrCodeUrl,
    tripadvisorIconUrl,
  ] = await Promise.all([
    getCachedGlobal('site-settings', 0)(),
    getMediaUrl('texture-red.webp'),
    getMediaUrl('jugotura-logo.webp'),
    getMediaUrl('yugotour-footer-logo.webp'),
    getMediaUrl('yugotour-googlereview-qrcode.webp'),
    getMediaUrl('tripadvisor_icon1.png'),
  ])

  const belgrade = siteSettings.belgrade
  const sarajevo = siteSettings.sarajevo
  const year = new Date().getFullYear()

  return (
    <div id="wrapper-footer" className="m-0 p-0 overflow-hidden bg-yugo-black">
      <footer
        id="colophon"
        className="relative overflow-hidden pt-[40px] font-fakt"
        style={{
          backgroundImage: textureRedUrl ? `url('${textureRedUrl}')` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#C6363C',
        }}
      >
        {/* Jugotura stamp — partially offscreen bottom-right */}
        {stampUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stampUrl}
            alt=""
            aria-hidden="true"
            className="absolute right-0 bottom-[20px] w-[280px] min-[992px]:w-[360px] opacity-60 min-[992px]:opacity-100 pointer-events-none z-[1]"
            style={{ transform: 'translateX(15%)' }}
          />
        )}

        <div className="container relative z-[2]">
          {/* ── Footer grid — layout controlled entirely by .footer-grid in globals.css ── */}
          <div className="footer-grid">

            {/* Col 1 — Brand */}
            <div className="order-1 min-[992px]:mt-[55px]">
              {footerLogoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={footerLogoUrl}
                  alt="Yugotour"
                  className="w-[165px] min-[992px]:w-[190px] mb-[2rem] min-[992px]:mb-[2.2rem] min-[992px]:-mt-[16px]"
                />
              )}

              {/* Belgrade address block */}
              <div className="mb-[1.8rem]">
                <strong className={`${bodyTextClass} font-bold block`}>Yugotour Belgrade</strong>
                {belgrade?.address && (
                  <p className={bodyTextClass} style={{ whiteSpace: 'pre-line' }}>
                    {belgrade.address.trim()}
                  </p>
                )}
                {belgrade?.phone && (
                  <p className={bodyTextClass}>
                    Tel./WhatsApp:{' '}
                    <span className="inline-block whitespace-nowrap">{belgrade.phone}</span>
                  </p>
                )}
                {belgrade?.email && (
                  <p className={bodyTextClass}>{belgrade.email}</p>
                )}
              </div>

              {/* Sarajevo address block */}
              <div>
                <strong className={`${bodyTextClass} font-bold block`}>Yugotour Sarajevo</strong>
                {sarajevo?.address && (
                  <p className={bodyTextClass} style={{ whiteSpace: 'pre-line' }}>
                    {sarajevo.address.trim()}
                  </p>
                )}
                {sarajevo?.phone && (
                  <p className={bodyTextClass}>
                    Tel./WhatsApp:{' '}
                    <span className="inline-block whitespace-nowrap">{sarajevo.phone}</span>
                  </p>
                )}
                {sarajevo?.email && (
                  <p className={bodyTextClass}>{sarajevo.email}</p>
                )}
              </div>
            </div>

            {/* Col 2 — Navigate */}
            <div className="order-2 mt-[71px] min-[992px]:mt-[120px]">
              <h5 className={h5Class}>NAVIGATE</h5>
              <ul className="list-none p-0 m-0">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={href} className="mb-[1.2rem] min-[992px]:mb-[1.55rem] last:mb-0">
                    <Link href={href} className={navLinkClass}>
                      {label}
                      <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 mobile → Col 5 desktop — Follow */}
            <div className="order-3 min-[992px]:order-5 min-[992px]:mt-[120px]">
              <h5 className={h5Class}>FOLLOW</h5>
              <CityIcons
                city="Belgrade"
                instagramHref={belgrade?.instagram ?? null}
                facebookHref={belgrade?.facebook ?? null}
                bodyTextClass={bodyTextClass}
              />
              <CityIcons
                city="Sarajevo"
                instagramHref={sarajevo?.instagram ?? null}
                facebookHref={sarajevo?.facebook ?? null}
                bodyTextClass={bodyTextClass}
              />
            </div>

            {/* Col 4 — Gas Us Up */}
            <div className="order-4 min-[992px]:mt-[120px]">
              <h5 className={h5Class}>GAS US UP</h5>
              <CityReviewIcons
                city="Belgrade"
                googleHref={belgrade?.googleReviews ?? null}
                tripadvisorHref={belgrade?.tripadvisor ?? null}
                tripadvisorIconUrl={tripadvisorIconUrl}
                bodyTextClass={bodyTextClass}
              />
              <CityReviewIcons
                city="Sarajevo"
                googleHref={sarajevo?.googleReviews ?? null}
                tripadvisorHref={sarajevo?.tripadvisor ?? null}
                tripadvisorIconUrl={tripadvisorIconUrl}
                bodyTextClass={bodyTextClass}
              />
              {qrCodeUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrCodeUrl}
                  alt="Google Review QR Code"
                  className="hidden min-[992px]:block w-[105px] mt-[20px]"
                  style={{ mixBlendMode: 'multiply' }}
                />
              )}
            </div>

            {/* Col 5 mobile → Col 3 desktop — Fine Print */}
            <div className="order-5 min-[992px]:order-3 min-[992px]:mt-[120px]">
              <h5 className={h5Class}>FINE PRINT</h5>
              <ul className="list-none p-0 m-0">
                {FINE_PRINT_LINKS.map(({ label, href }) => (
                  <li key={href} className="mb-[1.2rem] min-[992px]:mb-[1.55rem] last:mb-0">
                    <Link href={href} className={navLinkClass}>
                      {label}
                      <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="mt-[40px] pb-[30px]">
            <p className="font-fakt text-[1rem] min-[402px]:text-[1.1rem] leading-[1.4] m-0 text-black/35">
              Site by Sean J
              <br />
              Copyright © {year} Yugotour
            </p>
          </div>
        </div>

        {/* Black bar — bridges footer to yugo-black wrapper */}
        <div className="h-[30px] bg-yugo-black w-full -mb-[10px]" />
      </footer>
    </div>
  )
}

/* ── Sub-components ── */

interface CityIconsProps {
  city: string
  instagramHref: string | null
  facebookHref: string | null
  bodyTextClass: string
}

function CityIcons({ city, instagramHref, facebookHref, bodyTextClass }: CityIconsProps) {
  return (
    <div className="mb-[15px] last:mb-0">
      <span className={`${bodyTextClass} block`}>{city}</span>
      <div className="flex gap-[15px] min-[992px]:gap-[22px] mt-[8px] mb-[15px] items-center">
        {facebookHref && (
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${city} Facebook`}
            className="opacity-90 hover:opacity-100 transition-opacity duration-200"
          >
            <FacebookIcon className="w-[1.8rem] min-[992px]:w-[2.1rem] h-auto text-yugo-cream" />
          </a>
        )}
        {instagramHref && (
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${city} Instagram`}
            className="opacity-90 hover:opacity-100 transition-opacity duration-200"
          >
            <InstagramIcon className="w-[1.8rem] min-[992px]:w-[2.1rem] h-auto text-yugo-cream" />
          </a>
        )}
      </div>
    </div>
  )
}

interface CityReviewIconsProps {
  city: string
  googleHref: string | null
  tripadvisorHref: string | null
  tripadvisorIconUrl: string | null
  bodyTextClass: string
}

function CityReviewIcons({
  city,
  googleHref,
  tripadvisorHref,
  tripadvisorIconUrl,
  bodyTextClass,
}: CityReviewIconsProps) {
  return (
    <div className="mb-[15px] last:mb-0">
      <span className={`${bodyTextClass} block`}>{city}</span>
      <div className="flex gap-[15px] min-[992px]:gap-[22px] mt-[8px] mb-[15px] items-center">
        {googleHref && (
          <a
            href={googleHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${city} Google Reviews`}
            className="opacity-90 hover:opacity-100 transition-opacity duration-200"
          >
            <GoogleIcon className="w-[1.8rem] min-[992px]:w-[2.1rem] h-auto text-yugo-cream" />
          </a>
        )}
        {tripadvisorHref && (
          <a
            href={tripadvisorHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${city} TripAdvisor`}
            className="opacity-90 hover:opacity-100 transition-opacity duration-200"
          >
            {tripadvisorIconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tripadvisorIconUrl}
                alt="TripAdvisor"
                className="w-[2rem] h-auto object-contain"
              />
            ) : (
              <TripAdvisorIcon className="w-[2rem] h-auto text-yugo-cream" />
            )}
          </a>
        )}
      </div>
    </div>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function TripAdvisorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.5c0 .83-.67 1.5-1.5 1.5S7 11.33 7 10.5 7.67 9 8.5 9s1.5.67 1.5 1.5zm7 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S14.67 9 15.5 9s1.5.67 1.5 1.5zM12 15.5c-1.8 0-3.35-.95-4.24-2.38l1.3-.75c.64 1.11 1.82 1.88 3.2 1.88 1.18 0 2.23-.58 2.9-1.48l1.19.87C15.36 14.74 13.77 15.5 12 15.5z" />
    </svg>
  )
}
