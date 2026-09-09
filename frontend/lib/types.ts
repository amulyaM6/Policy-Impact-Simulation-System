export interface SectorScore {
  name: string
  score: number
  sentiment: 'positive' | 'negative' | 'neutral'
}

export interface StateImpact {
  state: string
  impact_score: number
}

export interface Stakeholder {
  group: string
  impact: string
  severity: 'high' | 'medium' | 'low'
}

export interface Recommendation {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  sector: string
}

export interface TimelinePoint {
  period: string
  impact_score: number
  description: string
}

export interface SimulationResult {
  id: string
  policy_title: string
  overall_risk_score: number
  sectors: SectorScore[]
  states: StateImpact[]
  stakeholders: Stakeholder[]
  recommendations: Recommendation[]
  timeline: TimelinePoint[]
}

export interface SectorComparison {
  policy1_score: number
  policy2_score: number
  policy1_summary: string
  policy2_summary: string
  winner: 'policy1' | 'policy2'
}

export interface CompareResult {
  policy1_title: string
  policy2_title: string
  common_fields: string[]
  comparison: Record<string, SectorComparison>
  overall_winner: string
  overall_winner_reason: string
}