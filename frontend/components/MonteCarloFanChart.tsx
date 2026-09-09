'use client'

import { useState } from 'react'
import { sounds } from './SciFiSoundEffects'

export default function MonteCarloFanChart() {
  const [trialCount, setTrialCount] = useState<number>(10000)
  const [varConfidence, setVarConfidence] = useState<number>(95)

  return (
    <div className="hud-panel p-6 lg:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xl relative">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-indigo-600 animate-ping" />
          <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-widest">
            MONTE CARLO STOCHASTIC PROBABILITY FAN CHART (10,000 RUNS)
          </h3>
        </div>
        <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium">
          95% VALUE-AT-RISK (VaR): <span className="text-emerald-600 font-bold">LOW RISK</span>
        </div>
      </div>

      {/* SVG Bell Curve & Fan Chart Visualization */}
      <div className="relative h-64 w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 overflow-hidden bg-grid-cyber flex items-end shadow-inner">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
          <defs>
            <linearGradient id="bellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="p50Line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#00f3ff" />
            </linearGradient>
          </defs>

          {/* Bell Curve Area Fill */}
          <path
            d="M 20 180 Q 150 180 200 120 T 250 20 T 300 120 Q 350 180 480 180 Z"
            fill="url(#bellGrad)"
            stroke="#00f3ff"
            strokeWidth="2"
          />

          {/* Median P50 Vertical Marker */}
          <line x1="250" y1="20" x2="250" y2="180" stroke="url(#p50Line)" strokeWidth="2" strokeDasharray="4 4" />

          {/* P10 Marker */}
          <line x1="180" y1="135" x2="180" y2="180" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* P90 Marker */}
          <line x1="320" y1="135" x2="320" y2="180" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* Labels */}
          <text x="250" y="15" fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            P50 Median Outcome (68.4%)
          </text>
          <text x="170" y="195" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">
            P10 Stress (42.1%)
          </text>
          <text x="330" y="195" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle">
            P90 Upside (89.6%)
          </text>
        </svg>
      </div>

      {/* Controls & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold">TOTAL MONTE CARLO TRIALS</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{trialCount.toLocaleString()}</div>
          <button
            onClick={() => {
              sounds.playExecute()
              setTrialCount((prev) => (prev === 10000 ? 50000 : 10000))
            }}
            className="text-[10px] text-indigo-600 underline mt-1 hover:text-indigo-800 font-bold"
          >
            Switch to 50,000 Trials
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold">95% VaR CONFIDENCE LIMIT</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{varConfidence}%</div>
          <div className="text-[10px] text-slate-400 mt-1">Stochastic Volatility Bounds</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold">SHOCK TOLERANCE INDEX</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">8.4/10</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">High Systemic Resilience</div>
        </div>
      </div>

    </div>
  )
}
