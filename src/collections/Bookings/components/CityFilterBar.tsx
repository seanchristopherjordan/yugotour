'use client'
import React from 'react'

const FILTER_KEY = 'where[city][equals]'

const filters = [
  { label: 'All Cities', value: '' },
  { label: 'Sarajevo', value: 'sarajevo' },
  { label: 'Belgrade', value: 'belgrade' },
] as const

function CityFilterBar() {
  const [currentCity, setCurrentCity] = React.useState('')

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCurrentCity(params.get(FILTER_KEY) ?? '')
  }, [])

  const applyFilter = (value: string) => {
    const params = new URLSearchParams(window.location.search)
    params.delete(FILTER_KEY)
    params.delete('page')
    if (value) params.set(FILTER_KEY, value)
    const qs = params.toString()
    window.location.href = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname
  }

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '0 0 12px 0' }}>
      {filters.map(({ label, value }) => {
        const isActive = currentCity === value
        return (
          <button
            key={label}
            type="button"
            onClick={() => applyFilter(value)}
            style={{
              padding: '4px 16px',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: isActive ? 'var(--theme-text)' : 'var(--theme-border-color)',
              background: isActive ? 'var(--theme-text)' : 'transparent',
              color: isActive ? 'var(--theme-bg)' : 'var(--theme-text)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              lineHeight: '1.6',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default CityFilterBar
