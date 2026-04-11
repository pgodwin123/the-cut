import { getDaysRemaining, getCurrentWeek, TOTAL_WEEKS, BET_AMOUNT } from '../lib/challenge'
import { Timer, Trophy, Calendar } from 'lucide-react'

export default function Countdown() {
  const daysLeft = getDaysRemaining()
  const currentWeek = getCurrentWeek()
  const weekLabel = currentWeek === 0
    ? 'Challenge starts soon'
    : currentWeek >= TOTAL_WEEKS
      ? 'Challenge Complete!'
      : `Week ${currentWeek} of ${TOTAL_WEEKS - 1}`

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-4 h-4 text-cut-cyan" />
        <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Challenge Clock</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card-inner p-3 text-center">
          <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <div className="font-display text-2xl font-bold text-white">{daysLeft}</div>
          <div className="text-xs text-gray-400">Days Left</div>
        </div>

        <div className="card-inner p-3 text-center">
          <div className="w-4 h-4 mx-auto mb-1 text-cut-purple font-bold text-sm">W</div>
          <div className="font-display text-2xl font-bold text-white">{currentWeek || '—'}</div>
          <div className="text-xs text-gray-400">{weekLabel}</div>
        </div>

        <div className="card-inner p-3 text-center">
          <Trophy className="w-4 h-4 text-cut-gold mx-auto mb-1" />
          <div className="font-display text-2xl font-bold text-cut-gold">${BET_AMOUNT}</div>
          <div className="text-xs text-gray-400">On The Line</div>
        </div>
      </div>
    </div>
  )
}
