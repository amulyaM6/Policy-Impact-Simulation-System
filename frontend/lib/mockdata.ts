import { SimulationResult } from './types'

export const mockData: SimulationResult = {
  id: 'sim_001',
  policy_title: 'Agricultural Reform Bill 2024',
  overall_risk_score: 67,
  risk_level: 'Medium',
  risk_dimensions: {
    severity: 70,
    plausibility: 65,
    magnitude: 68,
    vulnerable_population: 60,
  },
  score_explanation: 'Overall risk is classified as Medium (67/100). The biggest contributor is the severity of potential negative side-effects (rated 70/100). Score = severity×0.35 + plausibility×0.3 + magnitude×0.2 + vulnerable_population×0.15.',
  sectors: [
    { name: 'Agriculture', score: 82, sentiment: 'negative', data_grounded: true },
    { name: 'Economy', score: 55, sentiment: 'neutral', data_grounded: true },
    { name: 'Healthcare', score: 30, sentiment: 'positive', data_grounded: false },
    { name: 'Education', score: 45, sentiment: 'neutral', data_grounded: false },
    { name: 'Infrastructure', score: 60, sentiment: 'negative', data_grounded: true },
  ],
  states: [
    { state: 'Punjab', impact_score: 90 },
    { state: 'Maharashtra', impact_score: 65 },
    { state: 'Kerala', impact_score: 20 },
    { state: 'Uttar Pradesh', impact_score: 75 },
    { state: 'Tamil Nadu', impact_score: 40 },
  ],
  stakeholders: [
    { group: 'Farmers', impact: 'Direct income loss risk due to price deregulation', severity: 'high' },
    { group: 'Urban Workers', impact: 'Food price fluctuation expected', severity: 'medium' },
    { group: 'Exporters', impact: 'New export opportunities may open', severity: 'low' },
    { group: 'State Governments', impact: 'Loss of procurement control', severity: 'high' },
  ],
  recommendations: [
    { title: 'Strengthen MSP Framework', description: 'Introduce legally binding MSP to protect farmer income.', priority: 'high', sector: 'Agriculture' },
    { title: 'Create Transition Fund', description: 'Allocate funds to help farmers adapt to new market conditions.', priority: 'medium', sector: 'Economy' },
    { title: 'Rural Healthcare Access', description: 'Expand healthcare infrastructure in affected rural areas.', priority: 'low', sector: 'Healthcare' },
    { title: 'Digital Market Access', description: 'Build digital platforms for farmers to access national markets.', priority: 'high', sector: 'Infrastructure' },
  ],
  timeline: [
    { period: '6 months', impact_score: 35, description: 'Initial disruption in procurement channels' },
    { period: '1 year', impact_score: 52, description: 'Market adjustment and price volatility' },
    { period: '2 years', impact_score: 61, description: 'New supply chains begin forming' },
    { period: '3 years', impact_score: 70, description: 'Consolidation of private players in market' },
    { period: '5 years', impact_score: 78, description: 'Long term structural shift in agriculture economy' },
  ]
}