'use client'

import { useBookingModal } from '@/providers/BookingModal'

const navLinkClass =
  'relative inline-block font-fakt text-yugo-cream no-underline text-[1.04rem] min-[402px]:text-[1.144rem] min-[992px]:text-[1.1rem] leading-[1.4] group cursor-pointer bg-transparent border-none p-0'

export function FooterBookNowLink() {
  const { open } = useBookingModal()
  return (
    <button type="button" className={navLinkClass} onClick={() => open()}>
      Book Now
      <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-yugo-cream transition-[width] duration-200 ease-in-out group-hover:w-full" />
    </button>
  )
}
