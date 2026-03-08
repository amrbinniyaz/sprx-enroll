// School-wide GA4 data aggregated across all website visitors
// This represents the broader funnel — not just identified prospects

export const GA4_OVERVIEW = {
  totalVisitors: 915,
  totalSessions: 2340,
  avgSessionDuration: '2m 18s',
  bounceRate: 42,
  enquiryRate: 5.1,
}

export const TRAFFIC_SOURCES = [
  { name: 'Organic Search', value: 42, sessions: 983, color: '#10B981' },
  { name: 'Direct', value: 24, sessions: 562, color: '#64748B' },
  { name: 'Paid Search', value: 18, sessions: 421, color: '#F59E0B' },
  { name: 'Social Media', value: 11, sessions: 257, color: '#3B82F6' },
  { name: 'Referral', value: 5, sessions: 117, color: '#8B5CF6' },
]

export const CONVERSION_BY_CHANNEL = [
  { channel: 'Referral', visitors: 48, enquiries: 12, rate: 25.0, color: '#8B5CF6' },
  { channel: 'Organic', visitors: 380, enquiries: 38, rate: 10.0, color: '#10B981' },
  { channel: 'Paid', visitors: 165, enquiries: 14, rate: 8.5, color: '#F59E0B' },
  { channel: 'Social', visitors: 102, enquiries: 6, rate: 5.9, color: '#3B82F6' },
  { channel: 'Direct', visitors: 220, enquiries: 11, rate: 5.0, color: '#64748B' },
]

export const DEVICE_SPLIT = [
  { name: 'Desktop', value: 52, sessions: 1217, color: '#6366F1' },
  { name: 'Mobile', value: 39, sessions: 913, color: '#EC4899' },
  { name: 'Tablet', value: 9, sessions: 210, color: '#F59E0B' },
]

export const CAMPAIGNS = [
  {
    name: 'spring_open_day_2026',
    source: 'Google Ads',
    sessions: 142,
    prospects: 6,
    hot: 2,
    enquiryRate: 4.2,
    spend: 480,
  },
  {
    name: 'admissions_awareness',
    source: 'Facebook',
    sessions: 98,
    prospects: 4,
    hot: 0,
    enquiryRate: 4.1,
    spend: 320,
  },
  {
    name: 'year8_entry_2026',
    source: 'Google Ads',
    sessions: 76,
    prospects: 3,
    hot: 1,
    enquiryRate: 3.9,
    spend: 195,
  },
  {
    name: 'boarding_showcase',
    source: 'Instagram',
    sessions: 54,
    prospects: 2,
    hot: 0,
    enquiryRate: 3.7,
    spend: 180,
  },
  {
    name: 'sixth_form_jan',
    source: 'Google Ads',
    sessions: 51,
    prospects: 1,
    hot: 0,
    enquiryRate: 2.0,
    spend: 160,
  },
]

export const TOP_LANDING_PAGES = [
  { page: '/admissions/book-a-visit', label: 'Book a Visit', sessions: 65, enquiries: 9, rate: 13.8 },
  { page: '/admissions/open-days', label: 'Open Days', sessions: 145, enquiries: 18, rate: 12.4 },
  { page: '/admissions/fees-and-bursaries', label: 'Fees & Bursaries', sessions: 128, enquiries: 12, rate: 9.4 },
  { page: '/sixth-form', label: 'Sixth Form', sessions: 89, enquiries: 8, rate: 9.0 },
  { page: '/', label: 'Homepage', sessions: 310, enquiries: 15, rate: 4.8 },
  { page: '/school-life/gallery', label: 'Gallery', sessions: 72, enquiries: 3, rate: 4.2 },
]

export const GEO_REGIONS = [
  { region: 'London', visitors: 312, pct: 34 },
  { region: 'South East', visitors: 238, pct: 26 },
  { region: 'South West', visitors: 128, pct: 14 },
  { region: 'East of England', visitors: 92, pct: 10 },
  { region: 'Midlands', visitors: 73, pct: 8 },
  { region: 'International', visitors: 72, pct: 8 },
]
