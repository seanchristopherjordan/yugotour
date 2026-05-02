'use client'

import { useCallback, useEffect, useReducer, useState } from 'react'
import { useBookingModal } from '@/providers/BookingModal'
import type { BookingTour } from '@/lib/getAllToursForBooking'

// ─── Pricing helpers ──────────────────────────────────────────────────────────

function parsePrice(s: string | null | undefined): number {
  if (!s) return 0
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0
}

function isAirportExtra(title: string) {
  return title.toLowerCase().includes('airport')
}

function calcExtraPrice(extra: BookingTour['extras'][0], guestCount: number): number {
  const isAirport = isAirportExtra(extra.title)
  const priceStr =
    guestCount === 1
      ? (extra.priceSolo ?? extra.priceGroup ?? '0')
      : (extra.priceGroup ?? '0')
  const price = parsePrice(priceStr)
  return isAirport ? Math.ceil(guestCount / 3) * price : price
}

function formatExtraLabel(extra: BookingTour['extras'][0]): string {
  if (isAirportExtra(extra.title)) {
    const price = parsePrice(extra.priceGroup)
    return price ? `€${price} per car` : ''
  }
  const group = parsePrice(extra.priceGroup)
  const solo = parsePrice(extra.priceSolo)
  if (group && solo && solo !== group) return `€${group} / €${solo}`
  if (group) return `€${group}`
  return ''
}

function calcTotal(
  tour: BookingTour,
  guests: number | '10+',
  selectedExtras: string[],
): number {
  if (guests === '10+') return 0
  const count = guests as number
  const base = count === 1 ? (tour.priceSolo ?? 0) : (tour.priceGroup ?? 0) * count
  return (
    base +
    selectedExtras.reduce((sum, title) => {
      const extra = tour.extras.find((e) => e.title === title)
      return extra ? sum + calcExtraPrice(extra, count) : sum
    }, 0)
  )
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  city: 'belgrade' | 'sarajevo' | null
  selectedTourDocId: string | null
  guests: number | '10+'
  selectedExtras: string[]
  airportDirection: 'pickup' | 'dropoff'
  flightTime: string
  name: string
  email: string
  phone: string
  date: string
  startTime: string
  comments: string
}

const defaultForm: FormState = {
  city: null,
  selectedTourDocId: null,
  guests: 2,
  selectedExtras: [],
  airportDirection: 'pickup',
  flightTime: '',
  name: '',
  email: '',
  phone: '',
  date: '',
  startTime: '',
  comments: '',
}

type FormAction =
  | { type: 'SET_CITY'; city: 'belgrade' | 'sarajevo' }
  | { type: 'SET_TOUR'; tourDocId: string | null }
  | { type: 'SET_GUESTS'; guests: number | '10+' }
  | { type: 'TOGGLE_EXTRA'; title: string }
  | { type: 'SET_AIRPORT_DIR'; dir: 'pickup' | 'dropoff' }
  | { type: 'SET_FLIGHT_TIME'; time: string }
  | { type: 'SET_FIELD'; field: keyof FormState; value: string }
  | { type: 'RESET'; init: Partial<FormState> }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.city, selectedTourDocId: null, selectedExtras: [], airportDirection: 'pickup', flightTime: '' }
    case 'SET_TOUR':
      return { ...state, selectedTourDocId: action.tourDocId, selectedExtras: [], airportDirection: 'pickup', flightTime: '' }
    case 'SET_GUESTS':
      return { ...state, guests: action.guests, selectedExtras: [], airportDirection: 'pickup', flightTime: '' }
    case 'TOGGLE_EXTRA': {
      const has = state.selectedExtras.includes(action.title)
      return {
        ...state,
        selectedExtras: has
          ? state.selectedExtras.filter((t) => t !== action.title)
          : [...state.selectedExtras, action.title],
        ...(isAirportExtra(action.title) && has ? { airportDirection: 'pickup' as const, flightTime: '' } : {}),
      }
    }
    case 'SET_AIRPORT_DIR':
      return { ...state, airportDirection: action.dir }
    case 'SET_FLIGHT_TIME':
      return { ...state, flightTime: action.time }
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return { ...defaultForm, guests: 2, ...action.init }
    default:
      return state
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isFormValid(state: FormState, tourSelected: boolean): boolean {
  if (!state.city || !tourSelected) return false
  if (!state.name.trim()) return false
  if (!emailRegex.test(state.email)) return false
  if (!state.date.trim()) return false
  if (!state.startTime.trim()) return false
  return true
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
    </svg>
  )
}
function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  )
}
function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  )
}
function PriceTagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  )
}
function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

// ─── Shared style constants ───────────────────────────────────────────────────

const FORM_CARD = 'rounded-xl p-[22px] min-[480px]:p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.18)]'
const INPUT_ROW = 'flex items-center gap-[10px] bg-white border border-[#c9b898] rounded-[6px] px-[12px] py-[9px] focus-within:border-yugo-red transition-colors duration-200'

// ─── Sub-components ───────────────────────────────────────────────────────────

function BookingCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close booking"
      className="flex items-center cursor-pointer bg-transparent border-none p-0 h-[24px] relative group"
    >
      <span className="mr-[8px] font-grotesk text-[1.1rem] max-[991px]:text-[1.3rem] font-light leading-none text-yugo-cream">
        close
      </span>
      <div className="flex flex-col justify-center gap-[6px] w-[22px] max-[991px]:w-[26px] h-[20px] overflow-visible">
        <span
          className="block w-[20px] max-[991px]:w-[24px] h-[2.5px] bg-yugo-cream rounded-[5px] origin-center"
          style={{ transform: 'translateY(4.25px) rotate(45deg)' }}
        />
        <span
          className="block w-[20px] max-[991px]:w-[24px] h-[2.5px] bg-yugo-cream rounded-[5px] origin-center"
          style={{ transform: 'translateY(-4.25px) rotate(-45deg)' }}
        />
      </div>
      <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-yugo-cream transition-[width] duration-300 group-hover:w-full" />
    </button>
  )
}

function BookingDivider() {
  return (
    <div className="flex items-center w-full max-w-[660px] mb-5">
      <div className="flex-1 flex flex-col gap-[3px]">
        <span className="h-[3px] w-full rounded-[1px]" style={{ background: 'var(--color-yugo-blue)' }} />
        <span className="h-[3px] w-full rounded-[1px]" style={{ background: 'rgba(252,249,235,0.8)' }} />
        <span className="h-[3px] w-full rounded-[1px]" style={{ background: 'var(--color-yugo-red)' }} />
      </div>
      <div className="flex-shrink-0 w-[44px] h-[44px] mx-[14px]" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="22" r="20.5" stroke="#FCF9EB" strokeWidth="2" />
          <text x="22" y="27" textAnchor="middle" fill="#FCF9EB" fontSize="18" fontWeight="bold" fontFamily="serif">Y</text>
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-[3px]">
        <span className="h-[3px] w-full rounded-[1px]" style={{ background: 'var(--color-yugo-red)' }} />
        <span className="h-[3px] w-full rounded-[1px]" style={{ background: 'rgba(252,249,235,0.8)' }} />
        <span className="h-[3px] w-full rounded-[1px]" style={{ background: 'var(--color-yugo-blue)' }} />
      </div>
    </div>
  )
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="absolute inset-0 z-[10020] flex items-center justify-center bg-black/70">
      <div
        className="bg-yugo-cream rounded-xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl"
        role="alertdialog"
      >
        <p className="font-fakt text-yugo-black text-base mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onConfirm}
            className="font-grotesk text-[0.95rem] font-medium px-[22px] py-[9px] rounded-[5px] bg-yugo-red text-yugo-cream border-none cursor-pointer hover:brightness-110 transition-[filter] duration-200"
          >
            OK
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="font-grotesk text-[0.95rem] font-medium px-[22px] py-[9px] rounded-[5px] bg-[#e8dfc8] text-yugo-black border-none cursor-pointer hover:brightness-95 transition-[filter] duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function InputField({
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
}: {
  icon: 'person' | 'email' | 'phone' | 'calendar' | 'clock'
  placeholder: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className={INPUT_ROW}>
      <span className="flex-shrink-0 text-[#b09070] flex items-center">
        {icon === 'person' && <PersonIcon />}
        {icon === 'email' && <EmailIcon />}
        {icon === 'phone' && <PhoneIcon />}
        {icon === 'calendar' && <CalendarIcon />}
        {icon === 'clock' && <ClockIcon />}
      </span>
      <input
        type={type}
        className="flex-1 border-none bg-transparent font-fakt text-[0.93rem] text-[#212121] outline-none min-w-0 placeholder:text-[#b09070] [color-scheme:light]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BookingModal() {
  const { isOpen, close, tours, initialOpts, textureUrl } = useBookingModal()
  const [formState, dispatch] = useReducer(formReducer, defaultForm)
  const [pendingCity, setPendingCity] = useState<'belgrade' | 'sarajevo' | null>(null)
  const [pendingTourId, setPendingTourId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Reset and pre-populate when modal opens
  useEffect(() => {
    if (!isOpen) return
    const init: Partial<FormState> = {}
    if (initialOpts.city) init.city = initialOpts.city
    if (initialOpts.payloadId) {
      const tour = tours.find((t) => String(t.id) === initialOpts.payloadId)
      if (tour) {
        init.city = tour.city
        init.selectedTourDocId = initialOpts.payloadId
      }
    }
    dispatch({ type: 'RESET', init })
    setSubmitError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Scroll lock
  useEffect(() => {
    document.documentElement.classList.toggle('modal-active', isOpen)
    document.body.classList.toggle('modal-active', isOpen)
    return () => {
      document.documentElement.classList.remove('modal-active')
      document.body.classList.remove('modal-active')
    }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  // Derived values
  const cityTours = tours.filter((t) => t.city === formState.city)
  const selectedTour = cityTours.find((t) => String(t.id) === formState.selectedTourDocId) ?? null
  const includesList = selectedTour?.includes?.split('\n').map((s) => s.trim()).filter(Boolean) ?? []
  const guestCount = formState.guests === '10+' ? 10 : (formState.guests as number)
  const totalPrice = selectedTour && formState.guests !== '10+'
    ? calcTotal(selectedTour, formState.guests, formState.selectedExtras)
    : null
  const valid = isFormValid(formState, !!selectedTour)
  const hasAirport = formState.selectedExtras.some((t) => isAirportExtra(t))

  function handleCityClick(city: 'belgrade' | 'sarajevo') {
    if (city === formState.city) return
    if (formState.selectedTourDocId) { setPendingCity(city) }
    else { dispatch({ type: 'SET_CITY', city }) }
  }

  function handleTourChange(docId: string) {
    if (!docId) { dispatch({ type: 'SET_TOUR', tourDocId: null }); return }
    if (formState.selectedTourDocId && docId !== formState.selectedTourDocId) { setPendingTourId(docId) }
    else { dispatch({ type: 'SET_TOUR', tourDocId: docId }) }
  }

  const handleSubmit = useCallback(async () => {
    if (!valid || !selectedTour || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const extras = formState.selectedExtras.map((title) => {
        const extra = selectedTour.extras.find((e) => e.title === title)
        return { title, price: extra ? calcExtraPrice(extra, guestCount) : 0 }
      })
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name, email: formState.email, phone: formState.phone,
          city: formState.city, tourTitle: selectedTour.title, tourId: selectedTour.tourId,
          guests: formState.guests, totalPrice,
          date: formState.date, startTime: formState.startTime,
          extras,
          airportDirection: hasAirport ? formState.airportDirection : undefined,
          flightTime: hasAirport ? formState.flightTime : undefined,
          comments: formState.comments,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      close()
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [valid, selectedTour, isSubmitting, formState, guestCount, totalPrice, hasAirport, close])

  // Select style shared
  const selectCls = [
    'w-full appearance-none pl-[14px] pr-[36px] py-[10px]',
    'font-fakt text-[0.97rem] text-[#212121]',
    'bg-[#FCF9EB] border border-[#c9b898] rounded-[6px] cursor-pointer outline-none',
    'transition-[border-color] duration-200 focus:border-yugo-red disabled:opacity-45 disabled:cursor-default',
  ].join(' ')

  return (
    <div
      id="booking-modal"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className={[
        'fixed inset-0 z-[10000]',
        'transition-[opacity,visibility] duration-[600ms] ease-[ease]',
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
      ].join(' ')}
      style={{
        backgroundImage: textureUrl ? `url('${textureUrl}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1a3558',
      }}
    >
      {/* Close button */}
      <div
        className="absolute top-0 right-0 z-[10010] flex items-center justify-end pr-[20px] min-[992px]:pr-[30px]"
        style={{ height: '3.4vh', minHeight: '45px' }}
      >
        <BookingCloseButton onClick={close} />
      </div>

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col items-center px-4 pt-[10vh] pb-16 max-[767px]:pt-[13vh]">

          <BookingDivider />

          {/* Heading */}
          <div className="text-center mb-5 w-full max-w-[660px]">
            <h2
              className="text-yugo-cream text-center m-0 mb-[0.4rem]"
              style={{ fontFamily: 'var(--font-zipper)', fontSize: 'clamp(3rem, 8vw, 5.5rem)', lineHeight: 1, letterSpacing: '0.02em' }}
            >
              <span style={{ color: 'var(--color-yugo-red)' }}>★</span>
              {' '}Ready to Roll?{' '}
              <span style={{ color: 'var(--color-yugo-red)' }}>★</span>
            </h2>
            <p className="font-fakt text-yugo-cream text-[1.1rem] m-0 opacity-90">
              Build your unforgettable Yugotour!
            </p>
          </div>

          {/* City cards */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-[660px] mb-4">
            {(['belgrade', 'sarajevo'] as const).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleCityClick(city)}
                aria-pressed={formState.city === city}
                className={[
                  'relative overflow-hidden rounded-[10px] cursor-pointer p-0',
                  'flex items-end transition-[border-color,filter] duration-[250ms]',
                  formState.city === city
                    ? 'border-[2.5px] border-yugo-cream'
                    : 'border-[2.5px] border-transparent brightness-75 hover:brightness-90',
                ].join(' ')}
                style={{ aspectRatio: '3/2', minHeight: '100px' }}
              >
                {/* Placeholder bg */}
                <div className="absolute inset-0 bg-[#3a5a7c]" />
                {/* Label */}
                <span
                  className="relative z-[1] w-full text-yugo-cream px-[14px] pb-[12px] pt-[30px]"
                  style={{
                    fontFamily: 'var(--font-zipper)',
                    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                    lineHeight: 1,
                    letterSpacing: '0.04em',
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
                  }}
                >
                  {city.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          {/* Selection card */}
          <div className={`${FORM_CARD} bg-[#FCF9EB] w-full max-w-[660px] mb-4`}>

            {/* Tour + Guests dropdowns */}
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-[12px] mb-1">
              <div className="relative">
                <select
                  className={selectCls}
                  value={formState.selectedTourDocId ?? ''}
                  onChange={(e) => handleTourChange(e.target.value)}
                  disabled={!formState.city}
                >
                  <option value="">Select Your Yugotour</option>
                  {cityTours.map((tour) => (
                    <option key={String(tour.id)} value={String(tour.id)}>
                      {tour.title}
                    </option>
                  ))}
                </select>
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#a08060]">
                  <ChevronDownIcon />
                </span>
              </div>
              <div className="relative">
                <select
                  className={selectCls}
                  value={String(formState.guests)}
                  onChange={(e) => {
                    const v = e.target.value
                    dispatch({ type: 'SET_GUESTS', guests: v === '10+' ? '10+' : parseInt(v, 10) })
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={String(n)}>
                      {n === 1 ? '1 (solo)' : `${n} guests`}
                    </option>
                  ))}
                  <option value="10+">10 or more</option>
                </select>
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#a08060]">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Group message */}
            {selectedTour && formState.guests === '10+' && (
              <div className="pt-[16px] pb-[6px]">
                <h3 className="font-fakt font-bold text-[1rem] text-[#212121] m-0 mb-[6px]">Group Tours</h3>
                <p className="font-fakt text-[0.93rem] text-[#554030] leading-[1.55] m-0">
                  Yugotour is happy to custom-build tours for large groups at discounted rates.<br />
                  Let us know the size of your group and all you&rsquo;d like to include in the Comments field below.
                </p>
              </div>
            )}

            {/* Includes + Extras */}
            {selectedTour && formState.guests !== '10+' && (
              <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-[20px] mt-[18px]">

                {/* Includes */}
                {includesList.length > 0 && (
                  <div>
                    <h4 className="booking-section-label">This Tour Includes</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-[7px]">
                      {includesList.map((item, i) => (
                        <li key={i} className="flex items-start gap-[8px] font-fakt text-[0.93rem] text-[#212121] leading-[1.35]">
                          <span className="flex-shrink-0 mt-[1px]">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                              <circle cx="10" cy="10" r="9" fill="#C6363C" />
                              <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Extras */}
                {selectedTour.extras.length > 0 && (
                  <div>
                    <h4 className="booking-section-label">Optional Extras</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-[8px]">
                      {selectedTour.extras.map((extra, i) => {
                        const checked = formState.selectedExtras.includes(extra.title)
                        const isAirport = isAirportExtra(extra.title)
                        const label = formatExtraLabel(extra)
                        const carsNeeded = Math.ceil(guestCount / 3)
                        return (
                          <li key={extra.id ?? i} className="flex flex-col">
                            <label className="flex items-start gap-[9px] cursor-pointer font-fakt text-[0.93rem] text-[#212121] leading-[1.35]">
                              <span className="relative flex-shrink-0 w-[18px] h-[18px] mt-[1px]">
                                <input
                                  type="checkbox"
                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer m-0"
                                  checked={checked}
                                  onChange={() => dispatch({ type: 'TOGGLE_EXTRA', title: extra.title })}
                                />
                                <span
                                  className="block w-[18px] h-[18px] border-[2px] rounded-[3px] transition-[background,border-color] duration-150 pointer-events-none"
                                  style={{
                                    background: checked ? 'var(--color-yugo-red)' : 'white',
                                    borderColor: checked ? 'var(--color-yugo-red)' : '#b09070',
                                  }}
                                >
                                  {checked && (
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="absolute top-[3px] left-[1px]">
                                      <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </span>
                              </span>
                              <span>
                                {extra.title}
                                {label && <span className="text-[#887060] text-[0.88em]"> ({label})</span>}
                              </span>
                            </label>

                            {/* Airport expanded */}
                            {isAirport && checked && (
                              <div className="ml-[27px] mt-[6px] flex flex-col gap-[6px]">
                                <p className="font-fakt text-[0.82rem] text-[#887060] m-0">
                                  {carsNeeded} {carsNeeded === 1 ? 'car' : 'cars'} ({formState.guests}{' '}
                                  {typeof formState.guests === 'number' && formState.guests === 1 ? 'guest' : 'guests'})
                                </p>
                                <div className="flex gap-[20px] items-center">
                                  {(['pickup', 'dropoff'] as const).map((dir) => (
                                    <label key={dir} className="flex items-center gap-[7px] cursor-pointer font-fakt text-[0.9rem] text-[#212121]">
                                      <span className="relative w-[16px] h-[16px]">
                                        <input
                                          type="radio"
                                          name="airportDirection"
                                          value={dir}
                                          className="absolute opacity-0 w-0 h-0"
                                          checked={formState.airportDirection === dir}
                                          onChange={() => dispatch({ type: 'SET_AIRPORT_DIR', dir })}
                                        />
                                        <span
                                          className="flex items-center justify-center w-[16px] h-[16px] rounded-full border-[2px] bg-white pointer-events-none"
                                          style={{ borderColor: formState.airportDirection === dir ? 'var(--color-yugo-red)' : '#b09070' }}
                                        >
                                          {formState.airportDirection === dir && (
                                            <span className="w-[8px] h-[8px] rounded-full bg-yugo-red block" />
                                          )}
                                        </span>
                                      </span>
                                      {dir.charAt(0).toUpperCase() + dir.slice(1)}
                                    </label>
                                  ))}
                                </div>
                                <div className="flex items-center gap-[8px] bg-white border border-[#c9b898] rounded-[6px] px-[10px] py-[7px] max-w-[260px]">
                                  <span className="text-[#a08060] flex items-center"><ClockIcon /></span>
                                  <input
                                    type="time"
                                    className="border-none bg-transparent font-fakt text-[0.9rem] text-[#212121] outline-none w-[90px] [color-scheme:light]"
                                    value={formState.flightTime}
                                    onChange={(e) => dispatch({ type: 'SET_FLIGHT_TIME', time: e.target.value })}
                                    aria-label={formState.airportDirection === 'pickup' ? 'Flight landing time' : 'Flight departure time'}
                                  />
                                  <span className="font-fakt text-[0.82rem] text-[#887060] whitespace-nowrap">
                                    {formState.airportDirection === 'pickup' ? 'Flight landing time' : 'Flight departure time'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Total price */}
            <div className="flex items-baseline gap-[8px] mt-[18px] pt-[14px] border-t border-dashed border-[#c9b898]">
              <span className="text-yugo-red flex items-center relative top-[1px]"><PriceTagIcon /></span>
              <span
                className="text-yugo-red"
                style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                Total Estimated Price:
              </span>
              {totalPrice !== null && (
                <span
                  className="text-yugo-red ml-[4px]"
                  style={{ fontFamily: 'var(--font-zipper)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1 }}
                >
                  € {totalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Contact card */}
          {selectedTour && (
            <div className={`${FORM_CARD} bg-[#FCF9EB] w-full max-w-[660px]`}>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-[10px] mb-[10px]">
                <InputField icon="person" placeholder="Your Name" value={formState.name}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'name', value: v })} />
                <InputField icon="email" type="email" placeholder="Email" value={formState.email}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'email', value: v })} />
              </div>
              <div className="grid grid-cols-1 min-[600px]:grid-cols-3 gap-[10px] mb-[10px]">
                <InputField icon="phone" type="tel" placeholder="Phone (recommended)" value={formState.phone}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'phone', value: v })} />
                <InputField icon="calendar" type="date" placeholder="Date of Tour" value={formState.date}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'date', value: v })} />
                <InputField icon="clock" type="time" placeholder="Preferred Start Time" value={formState.startTime}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'startTime', value: v })} />
              </div>
              <div className="mb-[10px]">
                <div className={`${INPUT_ROW} items-start`}>
                  <span className="flex-shrink-0 text-[#b09070] flex items-center mt-[2px]"><ChatIcon /></span>
                  <textarea
                    className="flex-1 border-none bg-transparent font-fakt text-[0.93rem] text-[#212121] outline-none resize-y min-h-[90px] leading-[1.5] placeholder:text-[#b09070]"
                    placeholder="Comments / Requests (Anything we should know? Just want to say hello?)"
                    value={formState.comments}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'comments', value: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              {submitError && (
                <p className="text-yugo-red font-fakt text-sm text-center mt-2">{submitError}</p>
              )}

              <button
                type="button"
                disabled={!valid || isSubmitting}
                onClick={handleSubmit}
                className={[
                  'flex items-center justify-center gap-[12px] w-full mt-[16px]',
                  'px-[20px] py-[14px] rounded-[6px] border-none cursor-pointer',
                  'bg-yugo-red text-yugo-cream',
                  'transition-[filter,transform] duration-200',
                  valid && !isSubmitting ? 'hover:brightness-110 hover:scale-[1.01]' : 'opacity-40 cursor-not-allowed',
                ].join(' ')}
                style={{ fontFamily: 'var(--font-grotesk)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                <span aria-hidden="true">★</span>
                <span>{isSubmitting ? 'Submitting…' : 'Book My Yugotour!'}</span>
                <span aria-hidden="true">★</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Confirmations */}
      {pendingCity && (
        <ConfirmDialog
          message="Are you sure you want to change city? Your current tour selection will be cleared."
          onConfirm={() => { dispatch({ type: 'SET_CITY', city: pendingCity }); setPendingCity(null) }}
          onCancel={() => setPendingCity(null)}
        />
      )}
      {pendingTourId && (
        <ConfirmDialog
          message="Are you sure you want to change the selected tour? Your current extras selection will be cleared."
          onConfirm={() => { dispatch({ type: 'SET_TOUR', tourDocId: pendingTourId }); setPendingTourId(null) }}
          onCancel={() => setPendingTourId(null)}
        />
      )}
    </div>
  )
}
