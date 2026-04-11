import { useUnits } from '../hooks/useUnits'

export default function UnitToggle() {
  const { unit, toggleUnit } = useUnits()

  return (
    <button
      onClick={toggleUnit}
      className="flex items-center bg-gray-800 border border-gray-700 rounded-lg text-xs font-semibold overflow-hidden"
    >
      <span className={`px-2.5 py-1.5 transition-colors ${unit === 'kg' ? 'bg-cut-purple text-white' : 'text-gray-400'}`}>
        KG
      </span>
      <span className={`px-2.5 py-1.5 transition-colors ${unit === 'lbs' ? 'bg-cut-purple text-white' : 'text-gray-400'}`}>
        LBS
      </span>
    </button>
  )
}
