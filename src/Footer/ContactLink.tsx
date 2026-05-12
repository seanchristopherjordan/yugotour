'use client'

import { useContactModal } from '@/providers/ContactModal'

const navLinkClass =
  'relative inline-block font-fakt text-yugo-cream no-underline text-[1.04rem] min-[402px]:text-[1.144rem] min-[992px]:text-[1.1rem] leading-[1.4] group cursor-pointer bg-transparent border-none p-0'

export function FooterContactLink() {
  const { open } = useContactModal()
  return (
    <button type="button" className={navLinkClass} onClick={open}>
      Contact Us
      <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
    </button>
  )
}
