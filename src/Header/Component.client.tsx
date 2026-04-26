'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import type { MegaMenuProps } from '@/components/MegaMenu'
import { MegaMenu } from '@/components/MegaMenu'

export interface HeaderClientProps {
  logoUrl: string | null
  navTextureUrl: string | null
  megaMenuProps: Omit<MegaMenuProps, 'isOpen' | 'onClose'>
}

export function HeaderClient({ logoUrl, navTextureUrl, megaMenuProps }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNavHidden, setIsNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  // Nav hide-on-scroll-down — mirrors handleNavScroll from custom-javascript.js
  useEffect(() => {
    function onScroll() {
      if (isMenuOpen) return
      if (ticking.current) return

      requestAnimationFrame(() => {
        const currentY = window.scrollY
        if (Math.abs(currentY - lastScrollY.current) < 10) {
          ticking.current = false
          return
        }
        setIsNavHidden(currentY > lastScrollY.current && currentY > 100)
        lastScrollY.current = currentY
        ticking.current = false
      })
      ticking.current = true
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMenuOpen])

  // Scroll lock while megamenu is open
  useEffect(() => {
    document.documentElement.classList.toggle('modal-active', isMenuOpen)
    document.body.classList.toggle('modal-active', isMenuOpen)
    return () => {
      document.documentElement.classList.remove('modal-active')
      document.body.classList.remove('modal-active')
    }
  }, [isMenuOpen])

  return (
    <>
      <header
        className={[
          'fixed top-0 w-full z-[9999] overflow-visible',
          'transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          isNavHidden ? '-translate-y-[calc(100%+40px)]' : 'translate-y-0',
        ].join(' ')}
      >
        <nav
          className="relative flex items-center overflow-visible border-b border-black/10 shadow-[inset_0_10px_12px_-10px_rgba(0,0,0,0.2)] min-h-[50px] min-[992px]:min-h-[42px]"
          style={{
            height: '3.4vh',
            backgroundImage: navTextureUrl ? `url('${navTextureUrl}')` : undefined,
            backgroundSize: 'cover',
          }}
        >
          <div className="flex items-center justify-end h-full w-full pr-[20px] min-[992px]:pr-[30px]">
            {/* Logo — absolute, spills below the nav bar */}
            <Link
              href="/"
              className="absolute top-0 left-[15px] min-[992px]:left-[25px] z-[1040] leading-[0]"
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="YugoTour"
                  className="w-[106px] min-[992px]:w-[96px] h-auto block transition-[filter] duration-300"
                  style={{ filter: 'brightness(1) drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.filter =
                      'brightness(1.3) drop-shadow(0 2px 2px rgba(0,0,0,0.2))')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.filter =
                      'brightness(1) drop-shadow(0 2px 2px rgba(0,0,0,0.2))')
                  }
                />
              ) : (
                <span className="font-tungsten text-yugo-red text-2xl font-bold">YugoTour</span>
              )}
            </Link>

            {/* Desktop city + book now links */}
            <div className="hidden min-[992px]:flex items-center">
              <NavLink href="/belgrade">belgrade</NavLink>
              <NavLink href="/sarajevo">sarajevo</NavLink>
              <button
                id="headerBookNow"
                type="button"
                className="mr-[50px] font-grotesk text-yugo-red text-[1.1rem] font-light bg-transparent border-none p-0 cursor-pointer relative group"
                onClick={() => {
                  // TODO: dispatch booking modal open
                }}
              >
                book now
                <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-yugo-red transition-[width] duration-300 group-hover:w-full" />
              </button>
            </div>

            {/* Hamburger trigger */}
            <HamburgerTrigger
              isActive={isMenuOpen}
              onToggle={() => setIsMenuOpen((v) => !v)}
              color="yugo-red"
            />
          </div>
        </nav>
      </header>

      <MegaMenu {...megaMenuProps} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mr-[50px] font-grotesk text-yugo-red no-underline text-[1.1rem] font-light relative group"
    >
      {children}
      <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-yugo-red transition-[width] duration-300 group-hover:w-full" />
    </Link>
  )
}

interface HamburgerTriggerProps {
  isActive: boolean
  onToggle: () => void
  /** Tailwind colour token name without the `text-` prefix, e.g. "yugo-red" */
  color: string
}

export function HamburgerTrigger({ isActive, onToggle, color }: HamburgerTriggerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isActive ? 'Close menu' : 'Open menu'}
      aria-expanded={isActive}
      className={`flex items-center cursor-pointer bg-transparent border-none p-0 relative group text-${color}`}
    >
      <span className="mr-[8px] font-grotesk text-[1.1rem] max-[991px]:text-[1.3rem] font-light leading-none text-inherit">
        menu
      </span>
      <div className="flex flex-col justify-center gap-[6px] w-[22px] max-[991px]:w-[26px] h-[20px] overflow-visible">
        <span
          className="block w-[20px] max-[991px]:w-[24px] h-[2px] rounded-[5px] bg-current transition-transform duration-300 origin-center"
          style={{
            transform: isActive ? 'translateY(4.25px) rotate(45deg)' : 'none',
          }}
        />
        <span
          className="block w-[20px] max-[991px]:w-[24px] h-[2px] rounded-[5px] bg-current transition-transform duration-300 origin-center"
          style={{
            transform: isActive ? 'translateY(-4.25px) rotate(-45deg)' : 'none',
          }}
        />
      </div>
      <span
        className={`absolute bottom-[-4px] left-0 h-[2px] w-0 bg-${color} transition-[width] duration-300 group-hover:w-full`}
      />
    </button>
  )
}
