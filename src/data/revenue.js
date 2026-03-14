// Revenue Intelligence mock data
// Mirrors PRD Section 8.10 — all figures realistic for a UK independent school

export const ENROLMENT_FUNNEL = [
  { stage: 'Website Visitors', count: 915, color: '#94A3B8' },
  { stage: 'Identified Prospects', count: 47, color: '#3B82F6' },
  { stage: 'Tour Booked', count: 28, color: '#6366F1' },
  { stage: 'Application Submitted', count: 19, color: '#8B5CF6' },
  { stage: 'Offer Made', count: 15, color: '#F59E0B' },
  { stage: 'Enrolled', count: 12, color: '#10B981' },
]

export const PIPELINE_FORECAST = [
  { month: 'Oct', optimistic: 320, projected: 240, conservative: 160 },
  { month: 'Nov', optimistic: 580, projected: 420, conservative: 280 },
  { month: 'Dec', optimistic: 790, projected: 610, conservative: 390 },
  { month: 'Jan', optimistic: 1100, projected: 840, conservative: 520 },
  { month: 'Feb', optimistic: 1450, projected: 1120, conservative: 680 },
  { month: 'Mar', optimistic: 1840, projected: 1420, conservative: 860 },
  { month: 'Apr', optimistic: 2180, projected: 1680, conservative: 1020 },
  { month: 'May', optimistic: 2460, projected: 1920, conservative: 1180 },
  { month: 'Jun', optimistic: 2680, projected: 2100, conservative: 1340 },
]

export const CAMPAIGN_REVENUE = [
  {
    campaign: 'spring_open_day_2026',
    source: 'Google Ads',
    spend: 480,
    sessions: 142,
    prospects: 6,
    enrolments: 2,
    enrolledRevenue: 57000,
  },
  {
    campaign: 'admissions_awareness',
    source: 'Facebook',
    spend: 320,
    sessions: 98,
    prospects: 4,
    enrolments: 1,
    enrolledRevenue: 28500,
  },
  {
    campaign: 'year8_entry_2026',
    source: 'Google Ads',
    spend: 195,
    sessions: 76,
    prospects: 3,
    enrolments: 1,
    enrolledRevenue: 28500,
  },
  {
    campaign: 'boarding_showcase',
    source: 'Instagram',
    spend: 180,
    sessions: 54,
    prospects: 2,
    enrolments: 0,
    enrolledRevenue: 0,
  },
  {
    campaign: 'sixth_form_jan',
    source: 'Google Ads',
    spend: 160,
    sessions: 51,
    prospects: 1,
    enrolments: 0,
    enrolledRevenue: 0,
  },
]

export const COMPETITOR_LOSSES = [
  {
    school: 'Dulwich College',
    familiesLost: 4,
    feeValueLost: 114000,
    topReason: 'Stronger brand perception',
    pattern: '75% checked fees 3+ times before leaving',
  },
  {
    school: 'JAGS',
    familiesLost: 3,
    feeValueLost: 85500,
    topReason: 'Academic results',
    pattern: '67% never booked an open day',
  },
  {
    school: 'Whitgift',
    familiesLost: 2,
    feeValueLost: 57000,
    topReason: 'Bursary offering',
    pattern: '100% were fee-checker pattern',
  },
  {
    school: 'Epsom College',
    familiesLost: 1,
    feeValueLost: 28500,
    topReason: 'Boarding facilities',
    pattern: 'Viewed boarding page 4 times',
  },
]

export const TOP_LIFETIME_VALUE = [
  { name: 'David Chen', child: 'Lily', yearGroup: 'Year 7', annualFees: 28500, projectedYears: 7, siblings: 1, totalValue: 399000, probability: 91, id: 2 },
  { name: 'James Thompson', child: 'Emily', yearGroup: 'Year 7', annualFees: 28500, projectedYears: 7, siblings: 0, totalValue: 199500, probability: 73, id: 1 },
  { name: 'Lucy Anderson', child: 'Sophie', yearGroup: 'Year 7', annualFees: 28500, projectedYears: 7, siblings: 0, totalValue: 199500, probability: 65, id: 4 },
  { name: 'Sarah Mitchell', child: 'Oliver', yearGroup: 'Year 9', annualFees: 28500, projectedYears: 5, siblings: 0, totalValue: 142500, probability: 52, id: 3 },
  { name: 'Jennifer Park', child: 'Mia', yearGroup: 'Year 7', annualFees: 28500, projectedYears: 7, siblings: 0, totalValue: 199500, probability: 58, id: 5 },
]

export const REVENUE_METRICS = {
  pipelineValue: 2140000,
  projectedRevenue: 1420000,
  totalCampaignSpend: 1335,
  totalEnrolledRevenue: 114000,
  avgLifetimeValue: 228000,
  enrolledThisCycle: 12,
  targetEnrolments: 18,
}
