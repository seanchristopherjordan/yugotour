'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'

export interface MegaMenuImages {
  default: string | null
  belgrade: string | null
  sarajevo: string | null
  yugopedia: string | null
  aboutUs: string | null
  bookNow: string | null
}

export interface MegaMenuSocialCity {
  city: string
  igHref: string | null
  fbHref: string | null
}

export interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
  textureUrl: string | null
  images: MegaMenuImages
  socialLinks: MegaMenuSocialCity[]
  socialIcons: {
    ig: string | null
    fb: string | null
  }
}

const MAIN_LINKS = [
  { label: 'belgrade', href: '/belgrade', imgKey: 'belgrade' as keyof MegaMenuImages },
  { label: 'sarajevo', href: '/sarajevo', imgKey: 'sarajevo' as keyof MegaMenuImages },
  { label: 'yugopedia', href: '/yugopedia', imgKey: 'yugopedia' as keyof MegaMenuImages },
  { label: 'about us', href: '/about-us', imgKey: 'aboutUs' as keyof MegaMenuImages },
  { label: 'book now', href: '#book', imgKey: 'bookNow' as keyof MegaMenuImages, isBookNow: true },
]

const SECONDARY_LINKS = [
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Media', href: '/media' },
]

export function MegaMenu({ isOpen, onClose, textureUrl, images, socialLinks, socialIcons }: MegaMenuProps) {
  // Mirrors the layerA/layerB crossfade logic from custom-javascript.js exactly
  const [activeSlot, setActiveSlot] = useState<'a' | 'b' | null>(null)
  const [imgA, setImgA] = useState<string | null>(null)
  const [imgB, setImgB] = useState<string | null>(null)
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleLinkEnter(imgKey: keyof MegaMenuImages) {
    if (revertTimer.current) clearTimeout(revertTimer.current)
    const url = images[imgKey]
    if (!url) return
    if (activeSlot !== 'a') {
      setImgA(url)
      setActiveSlot('a')
    } else {
      setImgB(url)
      setActiveSlot('b')
    }
  }

  function handleLinkLeave() {
    revertTimer.current = setTimeout(() => setActiveSlot(null), 50)
  }

  const mainLinkClass =
    'font-clarendon font-bold text-yugo-cream no-underline whitespace-nowrap tracking-[0.03rem] lowercase transition-colors duration-300 hover:text-yugo-red bg-transparent border-none p-0 cursor-pointer text-left'

  return (
    <div
      id="yugo-modal"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className={[
        'fixed inset-0 w-full h-screen overflow-hidden z-[10000] flex',
        'transition-[opacity,visibility] duration-[600ms] ease-[ease]',
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
      ].join(' ')}
      style={{
        backgroundImage: textureUrl ? `url('${textureUrl}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Image split — desktop only */}
      <div className="relative hidden min-[992px]:block w-1/2 h-screen bg-pure-black overflow-hidden flex-shrink-0">
        {images.default && (
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none z-[1]"
            style={{ backgroundImage: `url('${images.default}')` }}
          />
        )}
        <div
          className={`absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-[600ms] ease-in-out ${activeSlot === 'a' ? 'opacity-100 z-[3]' : 'opacity-0 z-[2]'}`}
          style={{ backgroundImage: imgA ? `url('${imgA}')` : undefined }}
        />
        <div
          className={`absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-[600ms] ease-in-out ${activeSlot === 'b' ? 'opacity-100 z-[3]' : 'opacity-0 z-[2]'}`}
          style={{ backgroundImage: imgB ? `url('${imgB}')` : undefined }}
        />
      </div>

      {/* Content wrap */}
      <div className="flex-1 flex flex-col relative max-w-full overflow-hidden">
        {/* Close button — mirrors header trigger position exactly */}
        <div
          className="absolute top-0 right-0 z-[10010] flex items-center justify-end overflow-hidden min-h-[50px] min-[992px]:min-h-[42px] pr-[20px] min-[992px]:pr-[30px]"
          style={{ height: '3.4vh' }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center cursor-pointer bg-transparent border-none p-0 h-[24px] relative group"
          >
            <span className="mr-[8px] font-grotesk text-[1.1rem] max-[991px]:text-[1.3rem] font-light leading-none text-yugo-cream">
              close
            </span>
            <div className="flex flex-col justify-center gap-[6px] w-[22px] max-[991px]:w-[26px] h-[20px] overflow-visible">
              <span
                className="block w-[20px] max-[991px]:w-[24px] h-[2.5px] bg-yugo-cream rounded-[5px] transition-transform duration-300 origin-center"
                style={{ transform: 'translateY(4.25px) rotate(45deg)' }}
              />
              <span
                className="block w-[20px] max-[991px]:w-[24px] h-[2.5px] bg-yugo-cream rounded-[5px] transition-transform duration-300 origin-center"
                style={{ transform: 'translateY(-4.25px) rotate(-45deg)' }}
              />
            </div>
            <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-yugo-cream transition-[width] duration-300 group-hover:w-full" />
          </button>
        </div>

        {/* Nav body — bottom-aligned */}
        <nav
          className="mt-auto flex flex-col pt-[60px] pb-[60px]"
          style={{ paddingLeft: 'clamp(32px, 6vw, 94px)' }}
        >
          {/* Main links */}
          <ul className="list-none p-0 m-0 mb-[50px]">
            {MAIN_LINKS.map((link) =>
              link.isBookNow ? (
                <li key={link.imgKey} className="mb-[1.3rem] leading-none last:mb-0">
                  <button
                    id="menuBookNow"
                    type="button"
                    className={mainLinkClass}
                    style={{ fontSize: 'clamp(3.4rem, 1rem + 3.5vw, 5.5rem)' }}
                    onMouseEnter={() => handleLinkEnter(link.imgKey)}
                    onMouseLeave={handleLinkLeave}
                    onClick={() => {
                      // TODO: dispatch booking modal open event
                      onClose()
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ) : (
                <li key={link.imgKey} className="mb-[1.3rem] leading-none last:mb-0">
                  <Link
                    href={link.href}
                    className={mainLinkClass}
                    style={{ fontSize: 'clamp(3.4rem, 1rem + 3.5vw, 5.5rem)' }}
                    onMouseEnter={() => handleLinkEnter(link.imgKey)}
                    onMouseLeave={handleLinkLeave}
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* Secondary links — 2-column grid */}
          <div
            className="grid gap-x-[1px] gap-y-[1.4rem] mb-[1.4rem]"
            style={{ gridTemplateColumns: '140px 140px' }}
          >
            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative w-fit font-fakt text-[1.2rem] text-yugo-cream no-underline leading-[1.4] group"
                onClick={onClose}
              >
                {link.label}
                <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-yugo-cream transition-[width] duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Social footer — driven by site-settings global */}
          <div className="flex gap-[1px]">
            {socialLinks.map(({ city, igHref, fbHref }) => (
              <div key={city} className="flex-[0_0_140px]">
                <span className="block font-fakt text-[1.2rem] leading-[1.2] text-[#a6b0b1] mb-[0.2rem]">
                  {city}
                </span>
                <div className="flex gap-[19px]">
                  {igHref && (
                    <a
                      href={igHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${city} Instagram`}
                      className="transition-opacity duration-200 hover:opacity-100 opacity-70"
                    >
                      {socialIcons.ig ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={socialIcons.ig}
                          alt="Instagram"
                          className="w-[2.4rem] h-[2.4rem] object-contain"
                        />
                      ) : (
                        <InstagramIcon className="w-[2.4rem] h-[2.4rem] text-[#a6b0b1]" />
                      )}
                    </a>
                  )}
                  {fbHref && (
                    <a
                      href={fbHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${city} Facebook`}
                      className="transition-opacity duration-200 hover:opacity-100 opacity-70"
                    >
                      {socialIcons.fb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={socialIcons.fb}
                          alt="Facebook"
                          className="w-[2.4rem] h-[2.4rem] object-contain"
                        />
                      ) : (
                        <FacebookIcon className="w-[2.4rem] h-[2.4rem] text-[#a6b0b1]" />
                      )}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </nav>
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
