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
import UnitToggle from '../components/UnitToggle'
import WeighInReminder from '../components/WeighInReminder'
import LeaderBanner from '../components/LeaderBanner'
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
    <div className="min-h-dvh px-3 sm:px-6 py-4 sm:py-6 pb-8 max-w-lg md:max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-cut-green" />
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">THE CUT</h1>
        </div>
        <div className="flex items-center gap-2">
          <UnitToggle />
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
        {/* Who's Leading — top of everything, full width */}
        {profiles.length === 2 && (
          <LeaderBanner profiles={profiles} weighInsByUser={weighInsByUser} />
        )}

        {/* Weigh-in reminder */}
        <WeighInReminder hasLoggedThisWeek={!!myCurrentWeekEntry} />

        {/* Desktop: 2-column grid from here. Mobile: stacked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <Countdown />

            {/* Profile cards — side by side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profiles.map(p => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  weighIns={weighInsByUser[p.id] || []}
                  isLeading={p.id === leaderId}
                />
              ))}
            </div>

            <WeighInForm userWeighIns={myWeighIns} onComplete={fetchData} />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {profiles.length === 2 && (
              <Leaderboard profiles={profiles} weighInsByUser={weighInsByUser} />
            )}
            <WeightChart profiles={profiles} weighInsByUser={weighInsByUser} />
            <StreakTracker profiles={profiles} weighInsByUser={weighInsByUser} />
          </div>
        </div>
      </div>
    </div>
  )
}
