import { differenceInDays, differenceInWeeks, isMonday, startOfDay, addDays } from 'date-fns'

export const CHALLENGE_START = new Date('2026-04-06T00:00:00')
export const CHALLENGE_END = new Date('2026-06-01T00:00:00')
export const TOTAL_WEEKS = 9 // 9 weigh-in Mondays (Week 1 = April 6, Final = June 1)
export const BET_AMOUNT = 100

export const WEEK_DATES = [
  { week: 1, date: '2026-04-06', label: 'Week 1 (Start)' },
  { week: 2, date: '2026-04-13', label: 'Week 2' },
  { week: 3, date: '2026-04-20', label: 'Week 3' },
  { week: 4, date: '2026-04-27', label: 'Week 4' },
  { week: 5, date: '2026-05-04', label: 'Week 5' },
  { week: 6, date: '2026-05-11', label: 'Week 6' },
  { week: 7, date: '2026-05-18', label: 'Week 7' },
  { week: 8, date: '2026-05-25', label: 'Week 8' },
  { week: 9, date: '2026-06-01', label: 'Final Weigh-In' },
]

export function getCurrentWeek() {
  const today = startOfDay(new Date())
  const start = startOfDay(CHALLENGE_START)

  if (today < start) return 0
  if (today > startOfDay(CHALLENGE_END)) return TOTAL_WEEKS

  const weeksSinceStart = differenceInWeeks(today, start)
  return Math.min(weeksSinceStart + 1, TOTAL_WEEKS)
}

export function getDaysRemaining() {
  const today = startOfDay(new Date())
  const end = startOfDay(CHALLENGE_END)
  const remaining = differenceInDays(end, today)
  return Math.max(0, remaining)
}

export function isTodayWeighInDay() {
  return isMonday(new Date())
}

export function getWeighInWindowForWeek(weekNumber) {
  const weekData = WEEK_DATES.find(w => w.week === weekNumber)
  if (!weekData) return null

  const monday = startOfDay(new Date(weekData.date + 'T00:00:00'))
  const windowEnd = addDays(monday, 2) // Grace: Monday + Tuesday

  return { start: monday, end: windowEnd }
}

export function canLogForWeek(weekNumber) {
  const window = getWeighInWindowForWeek(weekNumber)
  if (!window) return false

  const now = startOfDay(new Date())
  return now >= window.start && now <= window.end
}

export function getPercentageLost(startWeight, currentWeight) {
  if (!startWeight || !currentWeight) return 0
  return ((startWeight - currentWeight) / startWeight) * 100
}
