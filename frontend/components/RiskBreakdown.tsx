import { RiskDimensions } from '@/lib/types'

const DIMENSION_LABELS: Record<keyof RiskDimensions, string> = {
  severity: 'Severity',
  plausibility: 'Plausibility',
  magnitude: 'Magnitude',
  vulnerable_population: 'Vulnerable Population',
}

export default function RiskBreakdown({
  dimensions,
  explanation,
}: {
  dimensions?: RiskDimensions
  explanation?: string
}) {
  if (!dimensions) return null

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
          🧮
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Why This Score</h2>
          <p className="text-slate-500 text-xs">Rule-based breakdown, not a black box</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {(Object.keys(dimensions) as (keyof RiskDimensions)[]).map((key) => {
          const value = dimensions[key]
          const color = value > 70 ? 'bg-red-500' : value > 40 ? 'bg-amber-500' : 'bg-emerald-500'
          return (
            <div key={key} className="bg-slate-50 border border-slate-200/60 rounded-xl p-3">
              <p className="text-slate-500 text-xs mb-1.5">{DIMENSION_LABELS[key]}</p>
              <div className="bg-slate-200 rounded-full h-1.5 mb-1.5">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
              </div>
              <p className="text-slate-900 text-sm font-bold">{value}/100</p>
            </div>
          )
        })}
      </div>

      {explanation && (
        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 border border-slate-200/60 rounded-xl p-3">
          {explanation}
        </p>
      )}
    </div>
  )
}