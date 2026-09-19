'use client'
import { useEffect, useState } from 'react'
import { mockData } from '@/lib/mockdata'
import RiskScore from '@/components/RiskScore'
import SectorChart from '@/components/SectorChart'
import StakeholderCard from '@/components/StakeholderCard'
import { SimulationResult } from '@/lib/types'
import Link from 'next/link'
import Recommendations from '@/components/Recommendations'
import ExportButton from '@/components/ExportButton'
import TimelineChart from '@/components/TimelineChart'
import IndiaMap from '@/components/IndiaMap'
import RiskBreakdown from '@/components/RiskBreakdown'

export default function Dashboard() {
  const [data, setData] = useState<SimulationResult>(mockData)
  const [isReal, setIsReal] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('simulationResult')
    if (stored) {
      setData(JSON.parse(stored))
      setIsReal(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            {!isReal && (
              <span className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1 rounded-full mb-3 inline-block font-medium">
                Showing demo data — upload a real policy to see actual analysis
              </span>
            )}
            {isReal && (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1 rounded-full mb-3 inline-block font-medium">
                ✓ Real AI analysis
              </span>
            )}
            <h1 className="text-2xl font-bold text-slate-900">{data.policy_title}</h1>
            <p className="text-slate-500 text-sm mt-1">Simulation ID: {data.id}</p>
          </div>

          {/* Both buttons */}
          <div className="flex gap-3">
            <ExportButton data={data} />
            <Link href="/upload">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
                + New Analysis
              </button>
            </Link>
          </div>
        </div>

        {/* Risk Score + Sector Chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <RiskScore score={data.overall_risk_score} />
          <div className="md:col-span-2">
            <SectorChart sectors={data.sectors} />
          </div>
        </div>

        {/* Risk Score Breakdown */}
        <RiskBreakdown dimensions={data.risk_dimensions} explanation={data.score_explanation} />

        {/* Timeline */}
        
        {data.timeline && data.timeline.length > 0 && (
          <TimelineChart timeline={data.timeline} />
        )}

        {/* Stakeholders */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Stakeholder Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.stakeholders.map((s, i) => (
              <StakeholderCard key={i} stakeholder={s} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <Recommendations recommendations={data.recommendations} />
        )}

        {/* India Map */}
        <IndiaMap states={data.states} />

        {/* State Impact Table */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">State-wise Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.states.map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3">
                <span className="text-slate-800 font-medium">{s.state}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${s.impact_score > 70 ? 'bg-red-500' : s.impact_score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${s.impact_score}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold w-8 text-right ${s.impact_score > 70 ? 'text-red-600' : s.impact_score > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {s.impact_score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}