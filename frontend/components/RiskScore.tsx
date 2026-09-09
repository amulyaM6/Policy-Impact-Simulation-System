export default function RiskScore({ score }: { score: number }) {
  const color = score > 70 ? 'text-red-600' : score > 40 ? 'text-amber-600' : 'text-emerald-600'
  const bg = score > 70 ? 'bg-red-500' : score > 40 ? 'bg-amber-500' : 'bg-emerald-500'
  const label = score > 70 ? 'High Risk' : score > 40 ? 'Medium Risk' : 'Low Risk'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">Overall Risk Score</p>
      <p className={`text-8xl font-black ${color}`}>{score}</p>
      <p className={`text-base font-semibold mt-2 ${color}`}>{label}</p>
      <div className="mt-5 bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${bg}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-slate-400 text-xs mt-3">out of 100</p>
    </div>
  )
}