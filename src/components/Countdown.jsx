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
    <div className="card p-5 lg:p-7">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-4 h-4 text-cut-cyan" />
        <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Challenge Clock</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card-inner p-2.5 lg:p-5 text-center min-w-0">
          <Calendar className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
          <div className="font-display text-xl lg:text-4xl font-bold text-white">{daysLeft}</div>
          <div className="text-[10px] text-gray-400">Days Left</div>
        </div>

        <div className="card-inner p-2.5 lg:p-5 text-center min-w-0">
          <div className="w-3.5 h-3.5 mx-auto mb-1 text-cut-purple font-bold text-xs">W</div>
          <div className="font-display text-xl lg:text-4xl font-bold text-white">{currentWeek || '—'}</div>
          <div className="text-[10px] text-gray-400 truncate">{weekLabel}</div>
        </div>

        <div className="card-inner p-2.5 lg:p-5 text-center min-w-0">
          <Trophy className="w-3.5 h-3.5 text-cut-gold mx-auto mb-1" />
          <div className="font-display text-xl lg:text-4xl font-bold text-cut-gold">${BET_AMOUNT}</div>
          <div className="text-[10px] text-gray-400">On The Line</div>
        </div>
      </div>
    </div>
  )
}
