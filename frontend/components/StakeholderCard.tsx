import { Stakeholder } from '@/lib/types'

export default function StakeholderCard({ stakeholder }: { stakeholder: Stakeholder }) {
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
      card: 'bg-emerald-50/80 border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500'
    }
  }

  const s = styles[stakeholder.severity]

  return (
    <div className={`rounded-xl p-4 border ${s.card} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
          <p className="text-slate-900 font-bold">{stakeholder.group}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${s.badge} uppercase`}>
          {stakeholder.severity}
        </span>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{stakeholder.impact}</p>
    </div>
  )
}