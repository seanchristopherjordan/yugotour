'use client'

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
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
  return isAirport ? Math.ceil(guestCount / 3) * price : price * guestCount
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

function calcTotal(tour: BookingTour, guests: number | '10+', selectedExtras: string[]): number {
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

// ─── Date helper ──────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-').map(Number)
  const y = parts[0], m = parts[1], d = parts[2]
  if (!y || !m || !d) return dateStr
  return `${d} ${MONTHS[m - 1]} ${y}`
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

function parseHour(s: string, def: number): number {
  const n = parseInt((s ?? '').split(':')[0] ?? '', 10)
  return isNaN(n) ? def : n
}

function generateTimeOpts(startHour: number, endHour: number): Array<{ value: string; label: string }> {
  const opts: Array<{ value: string; label: string }> = []
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endHour && m > 0) break
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      const value = `${hh}:${mm}`
      const hour12 = h % 12 || 12
      const ampm = h >= 12 ? 'pm' : 'am'
      opts.push({ value, label: `${hour12}:${mm}${ampm}` })
    }
  }
  return opts
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
  city: null, selectedTourDocId: null, guests: 2, selectedExtras: [],
  airportDirection: 'pickup', flightTime: '', name: '', email: '',
  phone: '', date: '', startTime: '', comments: '',
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
    case 'SET_AIRPORT_DIR': return { ...state, airportDirection: action.dir }
    case 'SET_FLIGHT_TIME': return { ...state, flightTime: action.time }
    case 'SET_FIELD': return { ...state, [action.field]: action.value }
    case 'RESET': return { ...defaultForm, guests: 2, ...action.init }
    default: return state
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

// ─── Style constants ──────────────────────────────────────────────────────────

const FORM_CARD = 'rounded-[8px] p-[22px] min-[480px]:p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.18)]'
const INPUT_ROW = 'flex items-center gap-[10px] bg-[#fcf9ea] border border-[#c9b898] rounded-[5px] px-[12px] py-[9px] focus-within:border-[#C25E5E] transition-colors duration-200'
const MAX_FORM_W = 'w-full max-w-[660px] min-[992px]:max-w-[790px]'

// Guaranteed Art Grotesk Bold styling for section labels, applied inline to bypass CSS cache issues
const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-grotesk)',
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#C1A98D',
  marginBottom: '8px',
  display: 'block',
}

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
      <div className="bg-yugo-cream rounded-[8px] p-8 w-full max-w-sm mx-4 text-center shadow-2xl" role="alertdialog">
        <p className="font-fakt booking-confirm-text text-yugo-black text-base mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onConfirm}
            className="font-grotesk text-[0.95rem] font-medium px-[22px] py-[9px] rounded-[5px] border-none cursor-pointer hover:brightness-110 transition-[filter] duration-200"
            style={{ background: '#C25E5E', color: '#FCF9EB' }}
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

function DrawerPanel({ isOpen, children, className }: { isOpen: boolean; children: React.ReactNode; className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      el.style.height = isOpen ? 'auto' : '0px'
      return
    }

    if (isOpen) {
      el.style.height = el.scrollHeight + 'px'
      const handler = () => { el.style.height = 'auto' }
      el.addEventListener('transitionend', handler, { once: true })
      return () => el.removeEventListener('transitionend', handler)
    } else {
      const h = el.getBoundingClientRect().height
      el.style.height = h + 'px'
      el.getBoundingClientRect()
      el.style.height = '0px'
    }
  }, [isOpen])

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ overflow: 'hidden', transition: 'height 400ms cubic-bezier(0.4, 0, 0, 1)' }}
    >
      {children}
    </div>
  )
}

// Calendar-only date field — no manual typing, clicking anywhere opens the picker
function DateInputField({
  imgSrc,
  value,
  onChange,
}: {
  imgSrc: string | null
  value: string
  onChange: (v: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    const el = inputRef.current
    if (!el) return
    try {
      // showPicker() is supported in Chrome 99+, Firefox 101+, Safari 16+
      ;(el as HTMLInputElement & { showPicker?: () => void }).showPicker?.()
    } catch {
      el.focus()
    }
  }

  return (
    <div
      className={`${INPUT_ROW} relative cursor-pointer`}
      onClick={openPicker}
    >
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} width="18" height="18" alt="" aria-hidden="true" className="flex-shrink-0" />
      )}
      <span
        className={`flex-1 font-fakt text-[0.93rem] pointer-events-none select-none ${value ? 'text-[#212121]' : 'text-[#b09070]'}`}
        style={{ paddingTop: '2px' }}
      >
        {value ? formatDate(value) : 'Date of Tour'}
      </span>
      {/* Date input — invisible overlay so showPicker() anchors to correct position */}
      <input
        ref={inputRef}
        type="date"
        aria-label="Date of Tour"
        tabIndex={-1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.preventDefault()}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        style={{ colorScheme: 'light' }}
      />
    </div>
  )
}

// Time select dropdown — chevron absolutely positioned so full row is clickable
function TimeSelectField({
  imgSrc,
  placeholder,
  value,
  onChange,
  options,
}: {
  imgSrc: string | null
  placeholder: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div className={INPUT_ROW}>
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} width="18" height="18" alt="" aria-hidden="true" className="flex-shrink-0" />
      )}
      {/* Wrapper with relative positioning so chevron overlays the select */}
      <div className="relative flex-1 min-w-0">
        <select
          className={`w-full appearance-none border-none bg-transparent font-fakt text-[0.93rem] outline-none cursor-pointer pr-[20px] ${value ? 'text-[#212121]' : 'text-[#b09070]'}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ paddingTop: '2px' }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {/* Chevron — pointer-events:none so clicks fall through to the select */}
        <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-[#a08060]">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  )
}

// Generic text/email/tel input with R2 icon image
function InputField({
  imgSrc,
  placeholder,
  type = 'text',
  value,
  onChange,
}: {
  imgSrc: string | null
  placeholder: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className={INPUT_ROW}>
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} width="18" height="18" alt="" aria-hidden="true" className="flex-shrink-0" />
      )}
      <input
        type={type}
        className="flex-1 border-none bg-transparent font-fakt text-[0.93rem] text-[#212121] outline-none min-w-0 placeholder:text-[#b09070] [color-scheme:light]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingTop: '2px' }}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

function hasUserInput(state: FormState): boolean {
  return (
    state.selectedExtras.length > 0
    || !!state.name.trim()
    || !!state.email.trim()
    || !!state.phone.trim()
    || !!state.date.trim()
    || !!state.startTime.trim()
    || !!state.comments.trim()
  )
}

export function BookingModal() {
  const { isOpen, close, tours, initialOpts, textureUrl, images, timeSettings } = useBookingModal()
  const [formState, dispatch] = useReducer(formReducer, defaultForm)
  const [pendingCity, setPendingCity] = useState<'belgrade' | 'sarajevo' | null>(null)
  const [pendingTourId, setPendingTourId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const tourTimeOpts = useMemo(
    () => generateTimeOpts(parseHour(timeSettings.tourTimeStart, 9), parseHour(timeSettings.tourTimeEnd, 17)),
    [timeSettings.tourTimeStart, timeSettings.tourTimeEnd],
  )
  const airportTimeOpts = useMemo(
    () => generateTimeOpts(parseHour(timeSettings.airportTimeStart, 8), parseHour(timeSettings.airportTimeEnd, 20)),
    [timeSettings.airportTimeStart, timeSettings.airportTimeEnd],
  )

  useEffect(() => {
    if (!isOpen) return
    const init: Partial<FormState> = {}
    if (initialOpts.city) init.city = initialOpts.city
    if (initialOpts.payloadId) {
      const tour = tours.find((t) => String(t.id) === initialOpts.payloadId)
      if (tour) { init.city = tour.city; init.selectedTourDocId = initialOpts.payloadId }
    }
    dispatch({ type: 'RESET', init })
    setSubmitError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    document.documentElement.classList.toggle('modal-active', isOpen)
    document.body.classList.toggle('modal-active', isOpen)
    return () => {
      document.documentElement.classList.remove('modal-active')
      document.body.classList.remove('modal-active')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  // Derived
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
    if (formState.selectedTourDocId && hasUserInput(formState)) setPendingCity(city)
    else dispatch({ type: 'SET_CITY', city })
  }

  function handleTourChange(docId: string) {
    if (!docId) { dispatch({ type: 'SET_TOUR', tourDocId: null }); return }
    if (formState.selectedTourDocId && docId !== formState.selectedTourDocId && formState.selectedExtras.length > 0) {
      setPendingTourId(docId)
    } else {
      dispatch({ type: 'SET_TOUR', tourDocId: docId })
    }
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

  // Shared select styles for tour + guests dropdowns
  const selectCls = [
    'w-full appearance-none pl-[14px] pr-[36px] pt-[12px] pb-[8px]',
    'font-fakt text-[0.97rem] text-[#212121]',
    'bg-[#fcf9ea] border border-[#c9b898] rounded-[5px] cursor-pointer outline-none',
    'transition-[border-color] duration-200 focus:border-[#C25E5E] disabled:opacity-45 disabled:cursor-default',
  ].join(' ')

  const cityImg: Record<string, string | null> = {
    belgrade: images.cityBelgrade,
    sarajevo: images.citySarajevo,
  }

  const hasHeaderImage = images.headerImage || images.headerImageMobile

  return (
    <div
      id="booking-modal"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className={[
        'fixed inset-0 z-[10000] flex flex-col',
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
      {/* Close button bar — fixed-height, non-scrolling */}
      <div
        className="booking-close-bar flex-none flex items-center justify-end pr-[20px] min-[992px]:pr-[30px] z-[10010]"
      >
        <BookingCloseButton onClick={close} />
      </div>

      {/* 8px gap below close bar before scrollable content starts */}
      <div className="flex-none" style={{ height: '8px' }} aria-hidden="true" />

      {/* Scrollable area — starts strictly below the close button */}
      <div className="flex-1 min-h-0 overflow-y-auto booking-modal-body">

        {/* All content centered at form width */}
        <div className="flex flex-col items-center px-4 pt-2 pb-16">

          {/* Header image — constrained to form width, responsive desktop/mobile */}
          {hasHeaderImage && (
            <div className={`${MAX_FORM_W} mb-[10px] overflow-hidden rounded-[8px]`}>
              <picture>
                {images.headerImageMobile && (
                  <source media="(max-width: 767px)" srcSet={images.headerImageMobile} />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images.headerImage ?? images.headerImageMobile ?? ''}
                  alt=""
                  aria-hidden="true"
                  className="w-full block"
                  style={{ display: 'block' }}
                />
              </picture>
            </div>
          )}

          {/* Heading */}
          <div className={`text-center mb-[30px] ${MAX_FORM_W}`}>
            <h2
              className="booking-ready-heading text-yugo-cream text-center m-0 mb-[0.4rem] flex items-center justify-center gap-3"
              style={{ fontFamily: 'var(--font-zipper)', lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              {images.redStar
                ? <img src={images.redStar} width="40" height="40" alt="" aria-hidden="true" className="inline-block" />
                : <span style={{ color: 'var(--color-yugo-red)' }}>★</span>
              }
              Ready to Roll?
              {images.redStar
                ? <img src={images.redStar} width="40" height="40" alt="" aria-hidden="true" className="inline-block" />
                : <span style={{ color: 'var(--color-yugo-red)' }}>★</span>
              }
            </h2>
            <p className="font-fakt text-yugo-cream text-[1.1rem] m-0 opacity-90">
              Build your unforgettable Yugotour!
            </p>
          </div>

          {/* City cards */}
          <div className={`grid grid-cols-2 gap-4 ${MAX_FORM_W} mb-4`}>
            {(['belgrade', 'sarajevo'] as const).map((city) => {
              const img = cityImg[city]
              const isSelected = formState.city === city
              const cityLabel = city === 'belgrade' ? 'Belgrade' : 'Sarajevo'
              return (
                <div key={city} className="relative">
                  <button
                    type="button"
                    onClick={() => handleCityClick(city)}
                    aria-pressed={isSelected}
                    className={`booking-city-card w-full cursor-pointer p-0${isSelected ? ' booking-city-card--selected' : ''}`}
                    style={{
                      borderRadius: '5px',
                      boxShadow: isSelected
                        ? '0 0 0 5px #FCF9EB, 0 3px 10px rgba(0,0,0,0.22), inset 0 3px 8px rgba(0,0,0,0.20)'
                        : '0 0 0 2px #FCF9EB, 0 3px 10px rgba(0,0,0,0.22), inset 0 3px 8px rgba(0,0,0,0.20)',
                    }}
                  >
                    <div className="relative w-full overflow-hidden" style={{ borderRadius: '5px' }}>
                      {img
                        ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img}
                            alt={city}
                            className="w-full block"
                            style={{ display: 'block', width: '100%', height: 'auto' }}
                          />
                        )
                        : (
                          <div style={{ aspectRatio: '3/2', minHeight: '80px', background: '#3a5a7c' }} />
                        )
                      }
                      {/* City name overlay */}
                      <div
                        className="absolute inset-0 flex items-start justify-center"
                        style={{ paddingTop: '8%', pointerEvents: 'none' }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-clarendon-extra)',
                            fontWeight: 800,
                            fontSize: '19cqi',
                            color: '#FCF9EB',
                            lineHeight: 1,
                            textShadow: '0 2px 6px rgba(0,0,0,0.55)',
                            display: 'block',
                          }}
                        >
                          {cityLabel}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Selected badge — green circle with cream checkmark */}
                  {isSelected && (
                    <div
                      className="absolute z-10 flex items-center justify-center pointer-events-none"
                      style={{
                        top: '-10px',
                        right: '-10px',
                        width: '28px',
                        height: '28px',
                        background: '#22c55e',
                        borderRadius: '50%',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}
                    >
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
                        <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#FCF9EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Selection card — drawer 1: reveals after city chosen ─── */}
          <DrawerPanel isOpen={!!formState.city} className={MAX_FORM_W}>
          <div className={`${FORM_CARD} bg-[#fcf9ea] mb-4`}>

            {/* Tour + Guests dropdowns */}
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4 mb-1">
              <div className="relative">
                <select
                  className={selectCls}
                  value={formState.selectedTourDocId ?? ''}
                  onChange={(e) => handleTourChange(e.target.value)}
                  disabled={!formState.city}
                >
                  <option value="" hidden>Select Your Yugotour</option>
                  {cityTours.map((tour) => (
                    <option key={String(tour.id)} value={String(tour.id)}>{tour.title}</option>
                  ))}
                </select>
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#a08060]">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
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
                    <option key={n} value={String(n)}>{n === 1 ? '1 (single)' : `${n} guests`}</option>
                  ))}
                  <option value="10+">10 or more</option>
                </select>
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#a08060]">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>

            {/* 10+ group message */}
            {selectedTour && formState.guests === '10+' && (
              <div className="pt-[16px] pb-[6px]">
                <h3 className="font-fakt font-bold text-[1rem] text-[#212121] m-0 mb-[6px]">Group Tours</h3>
                <p className="font-fakt text-[0.93rem] text-[#554030] leading-[1.55] m-0">
                  Yugotour is happy to custom-build tours for large groups at discounted rates.<br />
                  Let us know the size of your group and all you&rsquo;d like to include in the Comments field below.
                </p>
              </div>
            )}

            {/* Duration + Includes + Extras (hidden for 10+) */}
            {selectedTour && formState.guests !== '10+' && (
              <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-4 mt-[18px]">

                {/* Left: Duration then Includes */}
                <div>
                  {selectedTour.duration && (
                    <div className="mb-[18px]">
                      <span style={SECTION_LABEL_STYLE}>Duration</span>
                      <p className="font-fakt text-[0.93rem] text-[#212121] leading-[1.35] m-0">
                        {selectedTour.duration}
                      </p>
                    </div>
                  )}

                  {includesList.length > 0 && (
                    <div>
                      <span style={SECTION_LABEL_STYLE}>This Tour Includes</span>
                      <ul className="list-none p-0 m-0 flex flex-col gap-[7px]">
                        {includesList.map((item, i) => (
                          <li key={i} className="flex items-start gap-[8px] font-fakt text-[0.93rem] text-[#212121] leading-[1.35]">
                            <span className="flex-shrink-0 mt-[1px]">
                              {images.checkmarkCircle
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={images.checkmarkCircle} width="18" height="18" alt="" aria-hidden="true" />
                                : (
                                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                    <circle cx="10" cy="10" r="9" fill="#C25E5E" />
                                    <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )
                              }
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right: Extras */}
                {selectedTour.extras.length > 0 && (
                  <div>
                    <span style={SECTION_LABEL_STYLE}>Optional Extras</span>
                    <ul className="list-none p-0 m-0 flex flex-col gap-[8px]">
                      {selectedTour.extras.map((extra, i) => {
                        const checked = formState.selectedExtras.includes(extra.title)
                        const isAirport = isAirportExtra(extra.title)
                        const label = formatExtraLabel(extra)
                        const carsNeeded = Math.ceil(guestCount / 3)
                        return (
                          <li key={extra.id ?? i} className="flex flex-col">
                            <label className="flex items-start gap-[9px] cursor-pointer font-fakt text-[0.93rem] text-[#212121] leading-[1.35]">
                              {/* Checkbox with centered checkmark */}
                              <span className="relative flex-shrink-0 w-[18px] h-[18px] mt-[1px]">
                                <input
                                  type="checkbox"
                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer m-0"
                                  checked={checked}
                                  onChange={() => dispatch({ type: 'TOGGLE_EXTRA', title: extra.title })}
                                />
                                <span
                                  className="flex items-center justify-center w-[18px] h-[18px] border-[2px] rounded-[3px] transition-[background,border-color] duration-150 pointer-events-none"
                                  style={{
                                    background: checked ? '#C25E5E' : 'white',
                                    borderColor: '#C25E5E',
                                  }}
                                >
                                  {checked && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </span>
                              </span>
                              <span>
                                {extra.title}
                                {label && <span className="text-[#887060] text-[0.88em]"> ({label})</span>}
                              </span>
                            </label>

                            {/* Airport expansion */}
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
                                          style={{ borderColor: formState.airportDirection === dir ? '#C25E5E' : '#b09070' }}
                                        >
                                          {formState.airportDirection === dir && (
                                            <span className="w-[8px] h-[8px] rounded-full block" style={{ background: '#C25E5E' }} />
                                          )}
                                        </span>
                                      </span>
                                      {dir.charAt(0).toUpperCase() + dir.slice(1)}
                                    </label>
                                  ))}
                                </div>
                                <TimeSelectField
                                  imgSrc={images.iconTime}
                                  placeholder={formState.airportDirection === 'pickup' ? 'Flight landing time' : 'Flight departure time'}
                                  value={formState.flightTime}
                                  onChange={(t) => dispatch({ type: 'SET_FLIGHT_TIME', time: t })}
                                  options={airportTimeOpts}
                                />
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

            {/* Total price — centered, section label style, Fakt Bold amount */}
            <div className="flex items-center justify-center gap-[8px] mt-[28px] pt-[14px] border-t border-dashed border-[#c9b898]">
              {images.priceTag
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={images.priceTag} width="16" height="16" alt="" aria-hidden="true" className="flex-shrink-0" />
                : (
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="#C1A98D" aria-hidden="true" className="flex-shrink-0">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                )
              }
              <span style={{ ...SECTION_LABEL_STYLE, marginBottom: 0, marginTop: 0 }}>
                Total Estimated Price:
              </span>
              {totalPrice !== null && (
                <span style={{ fontFamily: 'var(--font-fakt)', fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', lineHeight: 1, color: '#C25E5E' }}>
                  €{totalPrice}
                </span>
              )}
            </div>
          </div>
          </DrawerPanel>

          {/* ── Contact card — drawer 2: reveals after tour chosen ───── */}
          <DrawerPanel isOpen={!!formState.selectedTourDocId} className={MAX_FORM_W}>
          <div className={`${FORM_CARD} bg-[#fcf9ea]`}>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4 mb-4">
                <InputField
                  imgSrc={images.iconName}
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'name', value: v })}
                />
                <InputField
                  imgSrc={images.iconEmail}
                  type="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'email', value: v })}
                />
              </div>

              <div className="grid grid-cols-1 min-[600px]:grid-cols-3 gap-4 mb-[10px]">
                <InputField
                  imgSrc={images.iconPhone}
                  type="tel"
                  placeholder="Phone (recommended)"
                  value={formState.phone}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'phone', value: v })}
                />
                <DateInputField
                  imgSrc={images.iconDate}
                  value={formState.date}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'date', value: v })}
                />
                <TimeSelectField
                  imgSrc={images.iconTime}
                  placeholder="Preferred Start Time"
                  value={formState.startTime}
                  onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'startTime', value: v })}
                  options={tourTimeOpts}
                />
              </div>

              <div className="mb-[10px]">
                <div className={`${INPUT_ROW} items-start`}>
                  {images.iconComment && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={images.iconComment} width="18" height="18" alt="" aria-hidden="true" className="flex-shrink-0 mt-[2px]" />
                  )}
                  <textarea
                    className="flex-1 border-none bg-transparent font-fakt text-[0.93rem] text-[#212121] outline-none resize-y min-h-[90px] leading-[1.5] placeholder:text-[#b09070]"
                    placeholder="Comments / Requests / Anything we should know"
                    value={formState.comments}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'comments', value: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              {submitError && (
                <p style={{ color: '#C25E5E' }} className="font-fakt text-sm text-center mt-2">{submitError}</p>
              )}

              <button
                type="button"
                disabled={!valid || isSubmitting}
                onClick={handleSubmit}
                className={[
                  'booking-submit-btn',
                  'flex items-center justify-center gap-[12px] w-full mt-[16px]',
                  'px-[20px] py-[14px] rounded-[6px] border-none',
                  valid && !isSubmitting ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed',
                ].join(' ')}
                style={{
                  background: '#C25E5E',
                  color: '#FCF9EB',
                  fontFamily: 'var(--font-grotesk)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {images.littleWhiteStar
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={images.littleWhiteStar} width="16" height="16" alt="" aria-hidden="true" />
                  : <span aria-hidden="true">★</span>
                }
                <span>{isSubmitting ? 'Submitting…' : 'Book My Yugotour!'}</span>
                {images.littleWhiteStar
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={images.littleWhiteStar} width="16" height="16" alt="" aria-hidden="true" />
                  : <span aria-hidden="true">★</span>
                }
              </button>
          </div>
          </DrawerPanel>

        </div>
      </div>

      {/* Confirmation dialogs */}
      {pendingCity && (
        <ConfirmDialog
          message="Are you sure you want to change the selected city? Your current tour selection will be cleared."
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
