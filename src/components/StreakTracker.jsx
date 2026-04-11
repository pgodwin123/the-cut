import { WEEK_DATES, getCurrentWeek } from '../lib/challenge'
import { Flame, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function StreakTracker({ profiles, weighInsByUser }) {
  const currentWeek = getCurrentWeek()

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-orange-500" />
        <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Consistency</h3>
      </div>

      <div className="space-y-4">
        {profiles.map(profile => {
          const userWeighIns = weighInsByUser[profile.id] || []
          const loggedWeeks = new Set(userWeighIns.map(w => w.week_number))
          const streak = calculateStreak(loggedWeeks, currentWeek)

          return (
            <div key={profile.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white font-medium">{profile.name}</span>
                <span className="text-xs text-gray-400">
                  {streak > 0 ? (
                    <span className="text-orange-400 font-semibold">{streak} week streak</span>
                  ) : (
                    'No streak'
                  )}
                </span>
              </div>
              <div className="flex gap-1">
                {WEEK_DATES.map(({ week, label }) => {
                  const logged = loggedWeeks.has(week)
                  const isPast = week < currentWeek
                  const isCurrent = week === currentWeek
                  const isFuture = week > currentWeek

                  return (
                    <div
                      key={week}
                      className="flex-1 flex flex-col items-center gap-1"
                      title={`${label}: ${logged ? 'Logged' : isPast ? 'MISSED' : 'Upcoming'}`}
                    >
                      <div className={`w-full h-8 rounded flex items-center justify-center ${
                        logged
                          ? 'bg-cut-green/15 border border-cut-green/30'
                          : isPast
                            ? 'bg-cut-red/15 border border-cut-red/30'
                            : isCurrent
                              ? 'bg-cut-purple/15 border border-cut-purple/30 animate-pulse-glow'
                              : 'bg-gray-800 border border-gray-700'
                      }`}>
                        {logged && <CheckCircle className="w-3.5 h-3.5 text-cut-green" />}
                        {isPast && !logged && <XCircle className="w-3.5 h-3.5 text-cut-red" />}
                        {isCurrent && !logged && <Clock className="w-3.5 h-3.5 text-cut-purple" />}
                      </div>
                      <span className="text-[10px] text-gray-500">{week === 9 ? 'F' : week}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function calculateStreak(loggedWeeks, currentWeek) {
  let streak = 0
  for (let w = currentWeek - 1; w >= 1; w--) {
    if (loggedWeeks.has(w)) streak++
    else break
  }
  return streak
}
