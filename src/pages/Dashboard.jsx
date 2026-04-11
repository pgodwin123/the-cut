import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getPercentageLost, getCurrentWeek } from '../lib/challenge'
import ProfileCard from '../components/ProfileCard'
import Countdown from '../components/Countdown'
import Leaderboard from '../components/Leaderboard'
import WeighInForm from '../components/WeighInForm'
import WeightChart from '../components/WeightChart'
import StreakTracker from '../components/StreakTracker'
import { Flame, LogOut, Settings } from 'lucide-react'

export default function Dashboard() {
  const { session, profile, signOut } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [weighInsByUser, setWeighInsByUser] = useState({})
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    const [{ data: allProfiles }, { data: allWeighIns }] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('weigh_ins').select('*').order('week_number', { ascending: true }),
    ])

    setProfiles(allProfiles || [])

    const grouped = {}
    ;(allWeighIns || []).forEach(w => {
      if (!grouped[w.user_id]) grouped[w.user_id] = []
      grouped[w.user_id].push(w)
    })
    setWeighInsByUser(grouped)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('realtime-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weigh_ins' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchData)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Flame className="w-8 h-8 text-cut-green animate-pulse" />
      </div>
    )
  }

  const currentWeek = getCurrentWeek()
  const myWeighIns = weighInsByUser[session?.user?.id] || []
  const myCurrentWeekEntry = myWeighIns.find(w => w.week_number === currentWeek)

  // Determine leader by % body weight lost
  const standings = profiles.map(p => {
    const userWeighIns = weighInsByUser[p.id] || []
    const latest = userWeighIns.length
      ? userWeighIns.reduce((a, b) => a.week_number > b.week_number ? a : b)
      : null
    const currentWeight = latest?.weight || p.starting_weight
    return {
      id: p.id,
      percentLost: getPercentageLost(p.starting_weight, currentWeight),
    }
  }).sort((a, b) => b.percentLost - a.percentLost)

  const leaderId = standings.length > 0 && standings[0].percentLost > 0 ? standings[0].id : null

  // Need to check if current entry exists but is editable
  const canEdit = myCurrentWeekEntry && !myCurrentWeekEntry.locked && myCurrentWeekEntry.edits_used < 1
  const showEditForm = canEdit

  return (
    <div className="min-h-dvh p-4 pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-cut-green" />
          <h1 className="font-display text-xl font-bold text-white tracking-tight">THE CUT</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-cut-red transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* No profile setup prompt */}
      {!profile?.name && (
        <div className="card p-5 mb-4 border-cut-gold/30">
          <p className="text-cut-gold text-sm font-medium mb-2">Set up your profile first!</p>
          <Link to="/profile" className="text-sm text-cut-green underline">Go to profile settings</Link>
        </div>
      )}

      <div className="space-y-4">
        {/* Countdown */}
        <Countdown />

        {/* Profile Cards */}
        <div className="grid grid-cols-1 gap-4">
          {profiles.map(p => (
            <ProfileCard
              key={p.id}
              profile={p}
              weighIns={weighInsByUser[p.id] || []}
              isLeading={p.id === leaderId}
            />
          ))}
        </div>

        {/* Weigh-In Form */}
        {!myCurrentWeekEntry ? (
          <WeighInForm onComplete={fetchData} />
        ) : showEditForm ? (
          <WeighInForm existingWeighIn={myCurrentWeekEntry} onComplete={fetchData} />
        ) : (
          <WeighInForm existingWeighIn={myCurrentWeekEntry} onComplete={fetchData} />
        )}

        {/* Leaderboard */}
        {profiles.length === 2 && (
          <Leaderboard profiles={profiles} weighInsByUser={weighInsByUser} />
        )}

        {/* Chart */}
        <WeightChart profiles={profiles} weighInsByUser={weighInsByUser} />

        {/* Streak */}
        <StreakTracker profiles={profiles} weighInsByUser={weighInsByUser} />
      </div>
    </div>
  )
}
