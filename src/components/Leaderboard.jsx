import { getPercentageLost } from '../lib/challenge'
import { Crown, Swords } from 'lucide-react'

export default function Leaderboard({ profiles, weighInsByUser }) {
  const standings = profiles.map(profile => {
    const weighIns = weighInsByUser[profile.id] || []
    const latest = weighIns.length
      ? weighIns.reduce((a, b) => a.week_number > b.week_number ? a : b)
      : null

    const currentWeight = latest?.weight || profile.starting_weight
    const percentLost = getPercentageLost(profile.starting_weight, currentWeight)

    return { ...profile, currentWeight, percentLost }
  }).sort((a, b) => b.percentLost - a.percentLost)

  const gap = standings.length === 2
    ? Math.abs(standings[0].percentLost - standings[1].percentLost).toFixed(2)
    : 0

  const leader = standings[0]
  const trailer = standings[1]

  const maxPercent = Math.max(standings[0]?.percentLost || 1, 1)

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Swords className="w-4 h-4 text-cut-gold" />
        <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">The Race</h3>
      </div>

      {standings.length === 2 && leader.percentLost > 0 && (
        <div className="card-inner p-3 mb-4 text-center">
          <Crown className="w-5 h-5 text-cut-gold mx-auto mb-1" />
          <p className="text-sm text-white font-semibold">{leader.name} leads by <span className="text-cut-green">{gap}%</span></p>
        </div>
      )}

      <div className="space-y-3">
        {standings.map((player, i) => (
          <div key={player.id} className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white font-medium flex items-center gap-1.5">
                {i === 0 && player.percentLost > 0 && <Crown className="w-3.5 h-3.5 text-cut-gold" />}
                {player.name}
              </span>
              <span className={`font-display font-bold ${i === 0 && player.percentLost > 0 ? 'text-cut-green' : 'text-gray-300'}`}>
                {player.percentLost.toFixed(2)}%
              </span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  i === 0 ? 'bg-gradient-to-r from-cut-green/80 to-cut-green' : 'bg-gradient-to-r from-cut-cyan/80 to-cut-cyan'
                }`}
                style={{ width: `${maxPercent > 0 ? (player.percentLost / maxPercent) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
