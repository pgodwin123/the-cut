import { createContext, useContext, useState, useEffect } from 'react'

const UnitsContext = createContext(null)

const LBS_PER_KG = 2.20462

export function UnitsProvider({ children }) {
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('the-cut-unit') || 'lbs'
  })

  useEffect(() => {
    localStorage.setItem('the-cut-unit', unit)
  }, [unit])

  function toggleUnit() {
    setUnit(prev => prev === 'kg' ? 'lbs' : 'kg')
  }

  // Convert from display unit to kg for storage
  function toKg(value) {
    if (unit === 'kg') return value
    return value / LBS_PER_KG
  }

  // Convert from kg (storage) to display unit
  function fromKg(value) {
    if (value == null) return null
    if (unit === 'kg') return value
    return value * LBS_PER_KG
  }

  // Format a kg value for display
  function displayWeight(kgValue) {
    if (kgValue == null) return '—'
    const converted = fromKg(Number(kgValue))
    return converted.toFixed(1)
  }

  // Format the difference (already in kg)
  function displayDiff(kgDiff) {
    if (kgDiff == null) return '0.0'
    const converted = unit === 'kg' ? kgDiff : kgDiff * LBS_PER_KG
    return converted.toFixed(1)
  }

  return (
    <UnitsContext.Provider value={{ unit, toggleUnit, toKg, fromKg, displayWeight, displayDiff }}>
      {children}
    </UnitsContext.Provider>
  )
}

export function useUnits() {
  const context = useContext(UnitsContext)
  if (!context) throw new Error('useUnits must be used within UnitsProvider')
  return context
}
