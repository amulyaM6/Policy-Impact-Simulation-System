'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { SectorScore } from '@/lib/types'

export default function SectorChart({ sectors }: { sectors: SectorScore[] }) {
  const colors: Record<string, string> = {
    positive: '#10b981',
    neutral: '#f59e0b',
    negative: '#ef4444'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const grounded = payload[0].payload.data_grounded
      return (
        <div className="bg-white border border-slate-200 shadow-lg rounded-lg px-3 py-2 text-sm">
          <p className="text-slate-900 font-semibold">{payload[0].payload.name}</p>
          <p className="text-slate-500">Score: <span className="text-slate-900 font-bold">{payload[0].value}</span></p>
          <p className="text-slate-500">Sentiment: <span className="text-slate-900 font-bold">{payload[0].payload.sentiment}</span></p>
          {grounded !== undefined && (
            <p className={`text-xs mt-1 font-medium ${grounded ? 'text-emerald-600' : 'text-amber-600'}`}>
              {grounded ? '✓ Backed by real government data' : '⚠ AI-estimated (no dataset for this sector yet)'}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Sector Impact Scores</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={sectors} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#334155', fontSize: 13 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15,23,42,0.04)' }} />
          <Bar dataKey="score" radius={6} maxBarSize={24}>
            {sectors.map((s, i) => (
              <Cell key={i} fill={colors[s.sentiment]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-5 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Positive</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />Neutral</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Negative</span>
      </div>
    </div>
  )
}