import { useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useUnits } from '../hooks/useUnits'
import { getCurrentWeek, WEEK_DATES } from '../lib/challenge'
import { Scale, AlertTriangle, Check, X } from 'lucide-react'

export default function WeighInForm({ userWeighIns = [], onComplete }) {
  const { session } = useAuth()
  const { unit, toKg, displayWeight } = useUnits()
  const currentWeek = getCurrentWeek()

  // Which weeks can this user log for?
  // - Any past or current week up to currentWeek
  // - Week must either not be logged yet, OR logged but still editable (edits_used < 1, not locked)
  const availableWeeks = useMemo(() => {
    if (currentWeek === 0) return []
    const weighInsByWeek = new Map(userWeighIns.map(w => [w.week_number, w]))

    return WEEK_DATES.filter(({ week }) => {
      if (week > currentWeek) return false
      const existing = weighInsByWeek.get(week)
      if (!existing) return true // not logged yet — available
      return !existing.locked && (existing.edits_used || 0) < 1 // editable
    }).map(({ week, label }) => {
      const existing = weighInsByWeek.get(week)
      return { week, label, existing }
    })
  }, [userWeighIns, currentWeek])

  // Default to current week if available, otherwise first available week
  const defaultWeek = availableWeeks.find(w => w.week === currentWeek)?.week
    || availableWeeks[0]?.week
    || currentWeek

  const [selectedWeek, setSelectedWeek] = useState(defaultWeek)
  const [weight, setWeight] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedWeekInfo = availableWeeks.find(w => w.week === selectedWeek)
  const existingWeighIn = selectedWeekInfo?.existing
  const isEdit = !!existingWeighIn
  const weekData = WEEK_DATES.find(w => w.week === selectedWeek)

  if (currentWeek === 0) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-4 h-4 text-cut-purple" />
          <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Weigh-In</h3>
        </div>
        <p className="text-gray-400 text-sm">Challenge hasn't started yet. First weigh-in is Monday, April 6th.</p>
      </div>
    )
  }

  if (availableWeeks.length === 0) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-4 h-4 text-cut-green" />
          <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Weigh-In</h3>
        </div>
        <div className="card-inner p-4 text-center">
          <Check className="w-6 h-6 text-cut-green mx-auto mb-2" />
          <p className="text-white font-semibold text-sm">All caught up!</p>
          <p className="text-gray-400 text-xs mt-1">
            You've logged every available week. Next weigh-in{' '}
            {currentWeek < 9 ? `opens Monday for Week ${currentWeek + 1}` : 'was the final one'}.
          </p>
        </div>
      </div>
    )
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    const inputNum = parseFloat(weight)
    if (isNaN(inputNum) || inputNum <= 0) {
      setError('Enter a valid weight')
      setLoading(false)
      return
    }

    const weightKg = toKg(inputNum)

    if (weightKg < 20 || weightKg > 300) {
      setError('Weight seems out of range. Double-check your entry.')
      setLoading(false)
      return
    }

    if (isEdit) {
      const { error } = await supabase
        .from('weigh_ins')
        .update({
          weight: weightKg,
          edits_used: 1,
          locked: true,
          recorded_at: new Date().toISOString(),
        })
        .eq('id', existingWeighIn.id)

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setShowConfirm(false)
        setWeight('')
        onComplete?.()
      }
    } else {
      const { error } = await supabase
        .from('weigh_ins')
        .insert({
          user_id: session.user.id,
          week_number: selectedWeek,
          weight: weightKg,
          edits_used: 0,
          locked: false,
        })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setShowConfirm(false)
        setWeight('')
        onComplete?.()
      }
    }
  }

  const displayInputWeight = weight ? parseFloat(weight).toFixed(1) : '—'
  const hasMissedWeeks = availableWeeks.some(w => w.week < currentWeek && !w.existing)

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-4 h-4 text-cut-purple" />
        <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
          {isEdit ? 'Edit Weigh-In' : 'Log Weigh-In'}
        </h3>
      </div>

      {availableWeeks.length > 1 && (
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1.5">Which week?</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="w-full bg-gray-850 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cut-purple"
          >
            {availableWeeks.map(({ week, label, existing }) => (
              <option key={week} value={week}>
                {label}
                {existing ? ' (edit)' : week < currentWeek ? ' — missed!' : ''}
              </option>
            ))}
          </select>
          {hasMissedWeeks && !isEdit && selectedWeek < currentWeek && (
            <p className="text-xs text-cut-gold mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Logging a missed week
            </p>
          )}
        </div>
      )}

      <p className="text-gray-400 text-sm mb-3">
        {weekData?.label || `Week ${selectedWeek}`}
        {isEdit && <span className="text-cut-gold ml-2">— Final edit (no more changes)</span>}
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={existingWeighIn ? `Current: ${displayWeight(existingWeighIn.weight)}` : `Enter weight`}
            className="w-full bg-gray-850 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cut-purple transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">{unit}</span>
        </div>
        <button
          onClick={() => weight && setShowConfirm(true)}
          disabled={!weight}
          className="bg-cut-purple text-white font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-30 text-sm"
        >
          Lock In
        </button>
      </div>

      {!isEdit && (
        <p className="text-xs text-gray-400 mt-2">
          After confirming, you'll have <span className="text-cut-gold font-semibold">1 edit</span> for this week.
        </p>
      )}

      {error && <p className="text-cut-red text-sm mt-2">{error}</p>}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-sm w-full animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-cut-gold" />
              <h4 className="font-display text-lg font-bold text-white">Confirm Weigh-In</h4>
            </div>
            <p className="text-gray-300 text-sm mb-1">
              Lock in <span className="text-white font-bold">{displayInputWeight} {unit}</span> for {weekData?.label || `Week ${selectedWeek}`}?
            </p>
            {isEdit ? (
              <p className="text-cut-red text-xs mb-4 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                This is your final entry for this week. No more changes.
              </p>
            ) : (
              <p className="text-gray-400 text-xs mb-4">
                You'll have 1 edit remaining if you need to change it.
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-cut-green text-gray-950 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 text-sm font-bold flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> {loading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
