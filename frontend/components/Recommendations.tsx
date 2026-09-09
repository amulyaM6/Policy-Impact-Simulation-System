import { Recommendation } from '@/lib/types'

export default function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {
  const styles = {
    high: {
      card: 'bg-red-50/80 border-red-200',
      badge: 'bg-red-100 text-red-700 border-red-200',
      dot: 'bg-red-500'
    },
    medium: {
      card: 'bg-amber-50/80 border-amber-200',
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      dot: 'bg-amber-500'
    },
    low: {
      card: 'bg-blue-50/80 border-blue-200',
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      dot: 'bg-blue-500'
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-base">
          💡
        </div>
        <h2 className="text-lg font-semibold text-slate-900">AI Recommendations</h2>
        <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
          {recommendations.length} suggestions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((r, i) => {
          const s = styles[r.priority]
          return (
            <div key={i} className={`rounded-xl p-4 border ${s.card} shadow-sm`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${s.dot}`} />
                  <p className="text-slate-900 font-bold text-sm">{r.title}</p>
                </div>
                <div className="flex gap-2 shrink-0 ml-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${s.badge} uppercase`}>
                    {r.priority}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed ml-4">{r.description}</p>
              <p className="text-slate-400 text-xs mt-2 ml-4 font-medium">Sector: {r.sector}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}