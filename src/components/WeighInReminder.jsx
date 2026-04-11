import { getCurrentWeek, WEEK_DATES, isTodayWeighInDay } from '../lib/challenge'
import { Scale } from 'lucide-react'

export default function WeighInReminder({ hasLoggedThisWeek }) {
  const currentWeek = getCurrentWeek()

  if (currentWeek === 0 || hasLoggedThisWeek) return null

  const weekData = WEEK_DATES.find(w => w.week === currentWeek)
  const isMonday = isTodayWeighInDay()

  return (
    <div className="card p-4 border-cut-gold/30 bg-cut-gold/5 flex items-center gap-3 animate-pulse-glow">
      <div className="w-10 h-10 rounded-full bg-cut-gold/15 flex items-center justify-center flex-shrink-0">
        <Scale className="w-5 h-5 text-cut-gold" />
      </div>
      <div>
        <p className="text-white text-sm font-semibold">
          Log {weekData?.label || `Week ${currentWeek}`} weight
        </p>
        <p className="text-gray-400 text-xs">
          {isMonday
            ? "It's Monday — weigh-in day! Step on that scale."
            : "You haven't logged this week yet. Don't forget!"
          }
        </p>
      </div>
    </div>
  )
}
