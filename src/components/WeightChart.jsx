import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { WEEK_DATES } from '../lib/challenge'
import { TrendingDown } from 'lucide-react'

export default function WeightChart({ profiles, weighInsByUser }) {
  const chartData = WEEK_DATES.map(({ week, label }) => {
    const point = { week: label.replace('Week ', 'W').replace('Final Weigh-In', 'Final') }

    profiles.forEach(profile => {
      const userWeighIns = weighInsByUser[profile.id] || []
      const weekEntry = userWeighIns.find(w => w.week_number === week)
      if (weekEntry) {
        point[profile.name] = Number(weekEntry.weight)
      }
    })

    return point
  }).filter(point => {
    return profiles.some(p => point[p.name] !== undefined)
  })

  if (chartData.length === 0) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-cut-cyan" />
          <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Progress Chart</h3>
        </div>
        <p className="text-gray-400 text-sm text-center py-8">No weigh-in data yet. Chart will appear after first entries.</p>
      </div>
    )
  }

  const colors = ['#00ff87', '#06b6d4']

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-4 h-4 text-cut-cyan" />
        <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Progress Chart</h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
            <XAxis
              dataKey="week"
              tick={{ fill: '#8888a0', fontSize: 11 }}
              axisLine={{ stroke: '#2a2a3a' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8888a0', fontSize: 11 }}
              axisLine={{ stroke: '#2a2a3a' }}
              tickLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip
              contentStyle={{
                background: '#111118',
                border: '1px solid #2a2a3a',
                borderRadius: '0.5rem',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
            />
            {profiles.map((profile, i) => (
              <Line
                key={profile.id}
                type="monotone"
                dataKey={profile.name}
                stroke={colors[i]}
                strokeWidth={2.5}
                dot={{ fill: colors[i], strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: colors[i], strokeWidth: 2, fill: '#111118' }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
