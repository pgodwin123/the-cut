import { getPercentageLost } from '../lib/challenge'
import { TrendingDown, TrendingUp, Target, User } from 'lucide-react'

export default function ProfileCard({ profile, weighIns, isLeading, rank }) {
  const latestWeighIn = weighIns?.length
    ? weighIns.reduce((a, b) => a.week_number > b.week_number ? a : b)
    : null

  const currentWeight = latestWeighIn?.weight || profile?.starting_weight
  const totalLost = profile?.starting_weight && currentWeight
    ? (profile.starting_weight - currentWeight).toFixed(1)
    : '0.0'
  const percentLost = getPercentageLost(profile?.starting_weight, currentWeight)

  const isPositiveProgress = Number(totalLost) > 0

  return (
    <div className={`card p-5 relative overflow-hidden ${isLeading ? 'glow-green' : ''}`}>
      {isLeading && (
        <div className="absolute top-3 right-3 bg-cut-green/10 text-cut-green text-xs font-bold px-2 py-1 rounded-full border border-cut-green/20">
          LEADING
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden flex items-center justify-center flex-shrink-0">
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">{profile?.name || 'Player'}</h3>
          <p className="text-xs text-gray-400 italic">{profile?.motivation || 'No motivation set'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card-inner p-3">
          <div className="text-xs text-gray-400 mb-1">Current</div>
          <div className="font-display text-xl font-bold text-white">
            {currentWeight ? `${Number(currentWeight).toFixed(1)}` : '—'}
            <span className="text-xs text-gray-400 ml-1">kg</span>
          </div>
        </div>

        <div className="card-inner p-3">
          <div className="text-xs text-gray-400 mb-1">Start</div>
          <div className="font-display text-xl font-bold text-gray-300">
            {profile?.starting_weight ? `${Number(profile.starting_weight).toFixed(1)}` : '—'}
            <span className="text-xs text-gray-400 ml-1">kg</span>
          </div>
        </div>

        <div className="card-inner p-3">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            {isPositiveProgress ? <TrendingDown className="w-3 h-3 text-cut-green" /> : <TrendingUp className="w-3 h-3 text-cut-red" />}
            Lost
          </div>
          <div className={`font-display text-xl font-bold ${isPositiveProgress ? 'text-cut-green' : 'text-cut-red'}`}>
            {totalLost} kg
          </div>
        </div>

        <div className="card-inner p-3">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" />
            % Lost
          </div>
          <div className={`font-display text-xl font-bold ${percentLost > 0 ? 'text-cut-green' : 'text-white'}`}>
            {percentLost.toFixed(1)}%
          </div>
        </div>
      </div>

      {profile?.goal_weight && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Goal: {Number(profile.goal_weight).toFixed(1)} kg</span>
            {profile.starting_weight && currentWeight && (
              <span className="text-gray-400">
                {Math.max(0, (currentWeight - profile.goal_weight)).toFixed(1)} kg to go
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
