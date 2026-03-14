import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, AlertTriangle, CheckCircle2, Clock, Eye, ArrowUp, ArrowDown, Minus,
  Smartphone, Monitor, Tablet, ChevronRight, TrendingUp, TrendingDown,
  Lightbulb, BarChart3, ArrowRight, Sparkles, ShieldCheck, Search, MousePointer, Layout,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { usePageLoad } from '../hooks/usePageLoad'
import { WebsiteIntelligenceSkeleton } from '../components/Skeleton'
import InfoPopover from '../components/InfoPopover'
import {
  WEBSITE_HEALTH, RECOMMENDATIONS, ENROLLED_VS_NOT, PAGE_ENGAGEMENT, DEVICE_COMPARISON,
} from '../data/websiteIntelligence'

const PRIORITY_STYLES = {
  high: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', badge: 'bg-red-100 text-red-700', icon: AlertTriangle },
  medium: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', icon: Clock },
  low: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', icon: Eye },
}

const STATUS_STYLES = {
  new: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'New' },
  acknowledged: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Acknowledged' },
  actioned: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Actioned' },
  dismissed: { bg: 'bg-slate-100', text: 'text-slate-400', label: 'Dismissed' },
}

/* ─── Health Score Ring ─── */
function HealthScoreRing({ score }) {
  const r = 70, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const label = score >= 80 ? 'Good' : score >= 60 ? 'Needs Work' : 'Poor'

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        <circle
          cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 90 90)"
          className="transition-all duration-1000"
        />
        <text x="90" y="82" textAnchor="middle" className="fill-slate-900 text-4xl font-black">{score}</text>
        <text x="90" y="106" textAnchor="middle" className="fill-slate-400 text-xs font-medium">{label}</text>
      </svg>
    </div>
  )
}

/* ─── Component Score Bar ─── */
function ComponentBar({ name, score, weight }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 text-xs text-slate-600 font-medium truncate">{name}</div>
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
      <div className="w-10 text-right text-xs font-bold text-slate-700">{score}</div>
      <div className="w-10 text-right text-[10px] text-slate-400">{weight}%</div>
    </div>
  )
}

/* ─── Recommendation Card ─── */
function RecommendationCard({ rec }) {
  const [expanded, setExpanded] = useState(false)
  const ps = PRIORITY_STYLES[rec.priority]
  const ss = STATUS_STYLES[rec.status]
  const Icon = ps.icon

  return (
    <motion.div
      layout
      className={`rounded-2xl border ${ps.border} ${ps.bg} overflow-hidden`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-start gap-3 text-left cursor-pointer"
      >
        <div className={`mt-0.5 w-7 h-7 rounded-lg ${ps.badge} flex items-center justify-center flex-shrink-0`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase ${ps.text}`}>{rec.priority}</span>
            <span className="text-[10px] text-slate-400">·</span>
            <span className="text-[10px] text-slate-500 font-medium">{rec.type}</span>
          </div>
          <div className="text-sm font-bold text-slate-800">{rec.title}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ss.bg} ${ss.text}`}>{ss.label}</span>
          <div className="bg-white/60 rounded-lg px-2.5 py-1.5 text-center">
            <div className="text-sm font-black text-slate-800">{rec.metric.value}</div>
            <div className="text-[9px] text-slate-400">{rec.metric.label}</div>
          </div>
          <ChevronRight size={14} className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3 border-t border-white/60 pt-3">
              <p className="text-xs text-slate-600 leading-relaxed">{rec.detail}</p>
              <div className="flex items-start gap-2 bg-white/60 rounded-xl px-3 py-2.5">
                <Sparkles size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-700 font-medium">{rec.impact}</p>
              </div>
              <div className="flex items-start gap-2 bg-white/80 rounded-xl px-3 py-2.5">
                <Lightbulb size={12} className="text-brand-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-700"><span className="font-bold">Recommendation:</span> {rec.action}</p>
              </div>
              {rec.beforeAfter && (
                <div className="flex items-center gap-3 bg-emerald-50/80 rounded-xl px-3 py-2.5">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-500">Before:</span>{' '}
                    <span className="font-medium text-slate-700">{rec.beforeAfter.before}</span>
                    <ArrowRight size={10} className="inline mx-1.5 text-slate-400" />
                    <span className="text-slate-500">After:</span>{' '}
                    <span className="font-medium text-slate-700">{rec.beforeAfter.after}</span>
                    <span className="ml-2 text-emerald-600 font-bold">{rec.beforeAfter.change}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Enrolled vs Non-Enrolled ─── */
function JourneyComparison() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-800">Enrolled vs Non-Enrolled Journeys</h3>
          <InfoPopover
            title="How we compare journeys"
            steps={[
              { source: 'HubSpot Outcomes', detail: 'We pull enrolled vs lost deal outcomes from HubSpot' },
              { source: 'Behavioural Matching', detail: 'We compare the website journeys of both groups to find patterns' },
              { source: 'Pattern Analysis', detail: 'Statistically significant differences become recommendations' },
            ]}
          />
        </div>
        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Based on 156 historical outcomes</span>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Enrolled */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">Families Who Enrolled</span>
          </div>
          <div className="space-y-2">
            {ENROLLED_VS_NOT.enrolled.map((item) => (
              <div key={item.page} className="flex items-center gap-2">
                <div className="w-28 text-[11px] text-slate-600 truncate">{item.page}</div>
                <div className="flex-1 h-2 bg-emerald-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 w-10 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Not enrolled */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs font-bold text-red-600">Families Who Didn't Enrol</span>
          </div>
          <div className="space-y-2">
            {ENROLLED_VS_NOT.notEnrolled.map((item) => (
              <div key={item.page} className="flex items-center gap-2">
                <div className="w-28 text-[11px] text-slate-600 truncate">{item.page}</div>
                <div className="flex-1 h-2 bg-red-50 rounded-full overflow-hidden">
                  <div className="h-full bg-red-300 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="text-[11px] font-bold text-red-600 w-10 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-4 bg-brand-50/60 rounded-xl px-4 py-3 flex items-start gap-2.5">
        <Sparkles size={14} className="text-brand-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-brand-800 font-medium leading-relaxed">{ENROLLED_VS_NOT.insight}</p>
      </div>
    </div>
  )
}

/* ─── Page Engagement Table ─── */
function PageEngagementTable() {
  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={12} className="text-emerald-500" />
    if (trend === 'down') return <TrendingDown size={12} className="text-red-400" />
    return <Minus size={12} className="text-slate-400" />
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/60 shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100/60">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-800">Page Engagement</h3>
          <InfoPopover
            title="Page engagement data"
            steps={[
              { source: 'EnrollIQ Tracking', detail: 'Page views, scroll depth, and time on page from our tracking script' },
              { source: 'Exit Analysis', detail: 'Exit rate shows what percentage of visitors leave from each page' },
            ]}
          />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/60 border-b border-slate-100">
            <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-2.5">Page</th>
            <th className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2.5">Views</th>
            <th className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2.5">Avg Time</th>
            <th className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2.5">Scroll %</th>
            <th className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2.5">Exit Rate</th>
            <th className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2.5">Trend</th>
          </tr>
        </thead>
        <tbody>
          {PAGE_ENGAGEMENT.map((p) => {
            const exitColor = p.exitRate > 50 ? 'text-red-500 font-bold' : p.exitRate > 30 ? 'text-amber-500' : 'text-emerald-600'
            const scrollColor = p.scrollDepth < 30 ? 'text-red-500 font-bold' : p.scrollDepth < 50 ? 'text-amber-500' : 'text-slate-700'
            return (
              <tr key={p.page} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-3 text-xs font-semibold text-slate-800">{p.page}</td>
                <td className="px-3 py-3 text-xs text-slate-600 text-right">{p.views.toLocaleString()}</td>
                <td className="px-3 py-3 text-xs text-slate-600 text-right">{p.avgTime}</td>
                <td className={`px-3 py-3 text-xs text-right ${scrollColor}`}>{p.scrollDepth}%</td>
                <td className={`px-3 py-3 text-xs text-right ${exitColor}`}>{p.exitRate}%</td>
                <td className="px-3 py-3 text-center"><TrendIcon trend={p.trend} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Device Comparison ─── */
function DeviceComparison() {
  const devices = [
    { key: 'mobile', label: 'Mobile', icon: Smartphone, data: DEVICE_COMPARISON.mobile, color: 'brand' },
    { key: 'desktop', label: 'Desktop', icon: Monitor, data: DEVICE_COMPARISON.desktop, color: 'emerald' },
    { key: 'tablet', label: 'Tablet', icon: Tablet, data: DEVICE_COMPARISON.tablet, color: 'slate' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-bold text-slate-800">Device Comparison</h3>
        <InfoPopover
          title="Device data"
          steps={[
            { source: 'EnrollIQ Tracking', detail: 'Device type detected from user agent on every visit' },
            { source: 'Session Analysis', detail: 'Engagement metrics calculated per device type' },
          ]}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {devices.map(({ key, label, icon: Icon, data }) => {
          const bounceColor = data.bounceRate > 50 ? 'text-red-500' : data.bounceRate > 30 ? 'text-amber-500' : 'text-emerald-600'
          return (
            <div key={key} className="bg-slate-50/60 rounded-xl p-4 border border-slate-100/60">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-700">{label}</span>
                <span className="text-[10px] text-slate-400 ml-auto">{data.sessions.toLocaleString()} sessions</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500">Bounce Rate</span>
                  <span className={`text-[11px] font-bold ${bounceColor}`}>{data.bounceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500">Avg Duration</span>
                  <span className="text-[11px] font-bold text-slate-700">{data.avgDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500">Pages/Session</span>
                  <span className="text-[11px] font-bold text-slate-700">{data.pagesPerSession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500">Conversion</span>
                  <span className="text-[11px] font-bold text-emerald-600">{data.conversionRate}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile warning */}
      <div className="mt-4 bg-red-50/60 rounded-xl px-4 py-3 flex items-start gap-2.5 border border-red-100/60">
        <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-red-700 font-medium leading-relaxed">
          60% of traffic is mobile but conversion rate is 7.5x lower than desktop. Mobile experience needs urgent attention.
        </p>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function WebsiteIntelligence() {
  const loading = usePageLoad(900)
  const [filter, setFilter] = useState('all')

  if (loading) return <WebsiteIntelligenceSkeleton />

  const filteredRecs = filter === 'all'
    ? RECOMMENDATIONS
    : RECOMMENDATIONS.filter((r) => r.priority === filter)

  const highCount = RECOMMENDATIONS.filter((r) => r.priority === 'high').length
  const mediumCount = RECOMMENDATIONS.filter((r) => r.priority === 'medium').length
  const lowCount = RECOMMENDATIONS.filter((r) => r.priority === 'low').length
  const actionedCount = RECOMMENDATIONS.filter((r) => r.status === 'actioned').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Website Intelligence</h1>
          <InfoPopover
            title="How Website Intelligence works"
            steps={[
              { source: 'EnrollIQ Tracking Script', detail: 'Captures every page view, scroll, click, and session across the school website' },
              { source: 'Behavioural Analysis', detail: 'Aggregates visitor behaviour to find content gaps, navigation issues, and drop-off points' },
              { source: 'Outcome Comparison', detail: 'Compares enrolled vs non-enrolled families to identify what content drives enrolments' },
              { source: 'AI Recommendations', detail: 'Generates prioritised, actionable recommendations to improve the website' },
            ]}
          />
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Data-driven recommendations to improve your website's admissions conversion
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Health Score', value: WEBSITE_HEALTH.overall + '/100', sub: score => score >= 60 ? 'Needs improvement' : 'Poor', icon: ShieldCheck, color: 'brand' },
          { label: 'High Priority Issues', value: highCount, sub: 'Require immediate attention', icon: AlertTriangle, color: 'red' },
          { label: 'Recommendations', value: RECOMMENDATIONS.length, sub: `${actionedCount} actioned`, icon: Lightbulb, color: 'amber' },
          { label: 'Mobile Score', value: WEBSITE_HEALTH.components[3].score + '/100', sub: 'Below acceptable', icon: Smartphone, color: 'red' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100/60 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
              <div className={`w-8 h-8 rounded-xl bg-${m.color}-50 flex items-center justify-center`}>
                <m.icon size={15} className={`text-${m.color}-500`} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{typeof m.value === 'function' ? m.value(WEBSITE_HEALTH.overall) : m.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{typeof m.sub === 'function' ? m.sub(WEBSITE_HEALTH.overall) : m.sub}</div>
          </div>
        ))}
      </div>

      {/* Health Score + Trend */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Website Health Score</h3>
          <HealthScoreRing score={WEBSITE_HEALTH.overall} />
          <div className="mt-4 space-y-2.5">
            {WEBSITE_HEALTH.components.map((c) => (
              <ComponentBar key={c.name} name={c.name} score={c.score} weight={c.weight} />
            ))}
          </div>
        </div>

        <div className="col-span-2 space-y-5">
          {/* Score trend */}
          <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Health Score Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={WEBSITE_HEALTH.trend}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontSize: 12 }}
                  formatter={(val) => [`${val}/100`, 'Score']}
                />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: '#4f46e5', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-2 mt-2 px-2">
              <ArrowUp size={12} className="text-emerald-500" />
              <span className="text-[11px] text-emerald-600 font-medium">+18 points over 6 months</span>
              <span className="text-[11px] text-slate-400 ml-1">— improving steadily</span>
            </div>
          </div>

          {/* Device comparison */}
          <DeviceComparison />
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Recommendations</h3>
          <div className="flex gap-1.5">
            {[
              { key: 'all', label: 'All', count: RECOMMENDATIONS.length },
              { key: 'high', label: 'High', count: highCount },
              { key: 'medium', label: 'Medium', count: mediumCount },
              { key: 'low', label: 'Low', count: lowCount },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filter === f.key
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {filteredRecs.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      </div>

      {/* Enrolled vs Not */}
      <JourneyComparison />

      {/* Page Engagement */}
      <PageEngagementTable />
    </div>
  )
}
