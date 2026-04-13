import { getPercentageLost, getCurrentWeek, TOTAL_WEEKS } from '../lib/challenge'
import { getAvatarUrl } from '../lib/avatar'
import { Crown, Trophy, Swords, User } from 'lucide-react'

export default function LeaderBanner({ profiles, weighInsByUser }) {
  const currentWeek = getCurrentWeek()

  if (profiles.length < 2) return null

  const standings = profiles.map(profile => {
    const weighIns = weighInsByUser[profile.id] || []
    const latest = weighIns.length
      ? weighIns.reduce((a, b) => a.week_number > b.week_number ? a : b)
      : null
    const currentWeight = latest?.weight || profile.starting_weight
    const percentLost = getPercentageLost(profile.starting_weight, currentWeight)
    return { ...profile, currentWeight, percentLost }
  }).sort((a, b) => b.percentLost - a.percentLost)

  const leader = standings[0]
  const trailer = standings[1]
  const gap = Math.abs(leader.percentLost - trailer.percentLost)
  const isTied = gap < 0.01
  const challengeOver = currentWeek >= TOTAL_WEEKS

  // Final week — winner celebration
  if (challengeOver && !isTied) {
    const winner = leader
    const loser = trailer
    return (
      <div className="rounded-2xl p-5 text-center animate-slide-up relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a2a0a 0%, #0a0a0f 50%, #2a0a0a 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(circle at 50% 0%, #00ff87 0%, transparent 60%)' }}
        />
        <div className="relative">
          <Trophy className="w-10 h-10 text-cut-gold mx-auto mb-2" />
          <h2 className="font-display text-2xl font-black text-white mb-1">
            {winner.name} Wins!
          </h2>
          <p className="text-cut-green font-display text-lg font-bold mb-2">
            {winner.percentLost.toFixed(2)}% body weight lost
          </p>
          <div className="inline-block bg-cut-gold/15 border border-cut-gold/30 rounded-full px-4 py-2">
            <p className="text-cut-gold font-bold text-sm">
              {loser.name} owes $100 💰
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Challenge over and tied
  if (challengeOver && isTied) {
    return (
      <div className="rounded-2xl p-5 text-center animate-slide-up"
        style={{ background: 'linear-gradient(135deg, #1a1a0a 0%, #0a0a0f 100%)' }}
      >
        <Swords className="w-10 h-10 text-cut-gold mx-auto mb-2" />
        <h2 className="font-display text-2xl font-black text-white mb-1">Dead Heat!</h2>
        <p className="text-cut-gold text-sm">Both finished at {leader.percentLost.toFixed(2)}% — call it a draw?</p>
      </div>
    )
  }

  // During challenge — who's leading
  if (isTied) {
    return (
      <div className="rounded-2xl p-4 animate-slide-up border border-gray-800"
        style={{ background: 'linear-gradient(135deg, #111118 0%, #16161f 100%)' }}
      >
        <div className="flex items-center justify-center gap-3">
          <Swords className="w-6 h-6 text-cut-gold" />
          <div className="text-center">
            <p className="font-display text-lg font-bold text-white">It's a dead heat</p>
            <p className="text-gray-400 text-xs">0% separates you — someone make a move</p>
          </div>
          <Swords className="w-6 h-6 text-cut-gold" />
        </div>
      </div>
    )
  }

  // Someone is leading
  return (
    <div className="rounded-2xl p-4 lg:p-8 animate-slide-up relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1a0a 0%, #0a0a0f 50%, #111118 100%)' }}
    >
      <div className="absolute inset-0 opacity-5"
        style={{ background: 'radial-gradient(circle at 30% 50%, #00ff87 0%, transparent 50%)' }}
      />
      <div className="relative flex items-center gap-4 lg:gap-8">
        {/* Leader photo */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div
              className="w-14 h-14 lg:w-24 lg:h-24 rounded-full border-2 lg:border-4 border-cut-green/50"
              style={{
                background: getAvatarUrl(leader.photo_url)
                  ? `url(${getAvatarUrl(leader.photo_url)}) center/cover no-repeat`
                  : '#1e1e2a',
              }}
            >
              {!getAvatarUrl(leader.photo_url) && (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-6 h-6 lg:w-10 lg:h-10 text-gray-600" />
                </div>
              )}
            </div>
            <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-6 h-6 lg:w-10 lg:h-10 bg-cut-gold rounded-full flex items-center justify-center">
              <Crown className="w-3.5 h-3.5 lg:w-6 lg:h-6 text-gray-950" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg lg:text-3xl font-black text-white leading-tight">
            {leader.name} leads
          </p>
          <p className="text-cut-green font-display text-xl lg:text-5xl font-black">
            by {gap.toFixed(2)}%
          </p>
          <div className="flex items-center gap-3 lg:gap-5 mt-1 lg:mt-3">
            <span className="text-[11px] lg:text-sm text-gray-400">
              {leader.name}: <span className="text-cut-green font-semibold">{leader.percentLost.toFixed(2)}%</span>
            </span>
            <span className="text-gray-600">vs</span>
            <span className="text-[11px] lg:text-sm text-gray-400">
              {trailer.name}: <span className="text-gray-300 font-semibold">{trailer.percentLost.toFixed(2)}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
