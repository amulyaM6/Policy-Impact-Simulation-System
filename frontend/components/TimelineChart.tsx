'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from 'recharts'
import { TimelinePoint } from '@/lib/types'

export default function TimelineChart({ timeline }: { timeline: TimelinePoint[] }) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload
      return (
        <div className="bg-white border border-slate-200 shadow-lg rounded-xl px-4 py-3 max-w-xs">
          <p className="text-indigo-600 font-bold text-sm mb-1">{point.period}</p>
          <p className="text-slate-900 font-semibold mb-1">Impact Score: {point.impact_score}/100</p>
          <p className="text-slate-600 text-xs leading-relaxed">{point.description}</p>
        </div>
      )
    }
    return null
  }

  const maxScore = Math.max(...timeline.map(t => t.impact_score))
  const trend = maxScore > 70 ? 'High Impact Trend' : maxScore > 40 ? 'Medium Impact Trend' : 'Low Impact Trend'
  const trendColor = maxScore > 70 ? 'text-red-600' : maxScore > 40 ? 'text-amber-600' : 'text-emerald-600'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            📅
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Policy Impact Timeline</h2>
            <p className="text-slate-500 text-xs">Predicted impact over time</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 ${trendColor}`}>
          {trend}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={timeline} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="period"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'High Risk', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Medium Risk', fill: '#f59e0b', fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="impact_score"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ fill: '#4f46e5', r: 5, strokeWidth: 2, stroke: '#e0e7ff' }}
            activeDot={{ r: 7, fill: '#6366f1', stroke: '#4f46e5', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Timeline points summary */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {timeline.map((t, i) => (
          <div key={i} className="text-center bg-slate-50 border border-slate-200/60 rounded-xl p-2">
            <p className="text-slate-500 text-xs mb-1">{t.period}</p>
            <p className={`text-sm font-bold ${t.impact_score > 70 ? 'text-red-600' : t.impact_score > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {t.impact_score}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}