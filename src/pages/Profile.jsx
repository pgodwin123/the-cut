import { useState, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUnits } from '../hooks/useUnits'
import { supabase } from '../lib/supabase'
import { User, Camera, Save, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import UnitToggle from '../components/UnitToggle'

export default function Profile() {
  const { profile, session, updateProfile } = useAuth()
  const { unit, toKg, fromKg } = useUnits()
  const fileRef = useRef(null)
  const [name, setName] = useState(profile?.name || '')
  const [startingWeight, setStartingWeight] = useState(
    profile?.starting_weight ? fromKg(Number(profile.starting_weight)).toFixed(1) : ''
  )
  const [goalWeight, setGoalWeight] = useState(
    profile?.goal_weight ? fromKg(Number(profile.goal_weight)).toFixed(1) : ''
  )
  const [motivation, setMotivation] = useState(profile?.motivation || '')
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${session.user.id}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl + '?t=' + Date.now()
      setPhotoUrl(url)
      await updateProfile({ photo_url: url })
    }
    setUploading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    // Convert display values to kg for storage
    const startKg = startingWeight ? toKg(parseFloat(startingWeight)) : null
    const goalKg = goalWeight ? toKg(parseFloat(goalWeight)) : null

    await updateProfile({
      name,
      starting_weight: startKg,
      goal_weight: goalKg,
      motivation,
      photo_url: photoUrl,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-dvh p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-xl font-bold text-white">Edit Profile</h1>
        </div>
        <UnitToggle />
      </div>

      <form onSubmit={handleSave} className="space-y-4 animate-slide-up">
        <div className="card p-6 flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden flex items-center justify-center cursor-pointer relative group"
            onClick={() => fileRef.current?.click()}
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-600" />
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-2">
            {uploading ? 'Uploading...' : 'Tap to change photo'}
          </p>
        </div>

        <div className="card p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-850 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cut-purple transition-colors"
              placeholder="Your name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Starting Weight ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={startingWeight}
                onChange={(e) => setStartingWeight(e.target.value)}
                className="w-full bg-gray-850 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cut-purple transition-colors"
                placeholder={unit === 'lbs' ? 'e.g. 200.0' : 'e.g. 90.0'}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Goal Weight ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                className="w-full bg-gray-850 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cut-purple transition-colors"
                placeholder={unit === 'lbs' ? 'e.g. 180.0' : 'e.g. 80.0'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Motivation</label>
            <input
              type="text"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              className="w-full bg-gray-850 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cut-purple transition-colors"
              placeholder="Why are you doing this?"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-cut-green text-gray-950 font-bold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
        >
          {saved ? (
            <>Saved!</>
          ) : saving ? (
            <>Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save Profile</>
          )}
        </button>
      </form>
    </div>
  )
}
