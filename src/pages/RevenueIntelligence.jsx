import { useNavigate } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  PoundSterling,
  Users,
  Target,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  ENROLMENT_FUNNEL,
  PIPELINE_FORECAST,
  CAMPAIGN_REVENUE,
  COMPETITOR_LOSSES,
  TOP_LIFETIME_VALUE,
  REVENUE_METRICS,
} from '../data/revenue'
import Avatar from '../components/Avatar'
import InfoPopover from '../components/InfoPopover'
import { RevenueSkeleton } from '../components/Skeleton'
import { usePageLoad } from '../hooks/usePageLoad'

const DATA_SOURCES = {
  funnel: [
    { source: 'EnrollIQ Tracking Script', detail: 'Counts anonymous website visitors and identified prospects (those who submitted an enquiry form).' },
    { source: 'HubSpot CRM Deals', detail: 'Tour bookings, applications, offers, and enrolments are pulled from HubSpot deal stages every 15 minutes.' },
    { source: 'Automatic Calculation', detail: 'Conversion rates between each stage are calculated in real time as families move through the pipeline.' },
  ],
  forecast: [
    { source: 'HubSpot Deal Pipeline', detail: 'Current prospects and their deal stages provide the base data for projections.' },
    { source: 'Historical Conversion Rates', detail: 'We analyse 2-3 years of past HubSpot deals to calculate how likely each stage is to convert to enrolled.' },
    { source: 'Three Scenarios', detail: 'Optimistic uses best-case conversion rates, Conservative uses worst-case, and Projected uses the historical average.' },
  ],
  campaigns: [
    { source: 'Google Analytics 4', detail: 'GA4 captures which campaign (UTM parameters) brought each visitor to the website — e.g. "spring_open_day_2026" from Google Ads.' },
    { source: 'EnrollIQ Identity Stitching', detail: 'When a visitor submits an enquiry form, we link their identity back to the original campaign that brought them in.' },
    { source: 'HubSpot Enrolment Outcome', detail: 'When a family is marked as "Enrolled" in HubSpot, we trace it back to the campaign — closing the loop from ad spend to fee income.' },
  ],
  competitors: [
    { source: 'HubSpot Lost Deals', detail: 'When admissions marks a deal as "Lost" in HubSpot, they record which competitor school the family chose.' },
    { source: 'EnrollIQ Behaviour Data', detail: 'We cross-reference the lost family\'s website browsing patterns to identify common behaviours (e.g. fee-checking).' },
    { source: 'AI Pattern Analysis', detail: 'Claude AI analyses behavioural patterns across all lost families per competitor and generates actionable insights.' },
  ],
  lifetime: [
    { source: 'HubSpot Deal Value', detail: 'Annual fee amount comes from the HubSpot deal record for each family.' },
    { source: 'Year Group Calculation', detail: 'Projected years = current year group through to Year 13. A Year 7 student has 7 years of fees remaining.' },
    { source: 'Sibling Data', detail: 'Known siblings from HubSpot contact records are factored in to multiply the total lifetime value.' },
  ],
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

function fmt(n) {
  if (n >= 1000000) return `£${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `£${(n / 1000).toFixed(0)}K`
  return `£${n}`
}

function pct(spend, revenue) {
  if (!spend || !revenue) return '—'
  return `${Math.round((revenue / spend - 1) * 100).toLocaleString()}%`
}

/* ─── Metric Card ─── */
function MetricCard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl p-5 border border-slate-100/60 shadow-sm shadow-slate-100/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.1em]">
            {label}
          </div>
          <div className={`stat-number text-3xl mt-2 ${color}`}>{value}</div>
          {sub && (
            <div className="text-slate-400 text-xs mt-1.5 font-medium flex items-center gap-1">
              {trend === 'up' && <ArrowUpRight size={12} className="text-emerald-500" />}
              {trend === 'down' && <ArrowDownRight size={12} className="text-red-400" />}
              {sub}
            </div>
          )}
        </div>
        <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100/60">
          <Icon size={18} className="text-slate-400" />
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Enrolment Funnel ─── */
function EnrolmentFunnel() {
  const maxCount = ENROLMENT_FUNNEL[0].count

  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl border border-slate-100/60 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Enrolment Funnel</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Full journey from first visit to enrolled student</p>
        </div>
        <InfoPopover title="Enrolment Funnel" steps={DATA_SOURCES.funnel} />
      </div>

      <div className="space-y-2.5">
        {ENROLMENT_FUNNEL.map((stage, i) => {
          const widthPct = Math.max(((stage.count / maxCount) * 100), 12)
          const prevCount = i > 0 ? ENROLMENT_FUNNEL[i - 1].count : null
          const convRate = prevCount ? Math.round((stage.count / prevCount) * 100) : null

          return (
            <div key={stage.stage}>
              {convRate !== null && (
                <div className="flex items-center justify-center gap-1.5 py-1">
                  <div className="h-px w-6 bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400">{convRate}%</span>
                  <div className="h-px w-6 bg-slate-200" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-[130px] text-right flex-shrink-0">
                  <span className="text-xs font-medium text-slate-600">{stage.stage}</span>
                </div>
                <div className="flex-1 relative">
                  <motion.div
                    className="h-9 rounded-xl flex items-center justify-end px-3"
                    style={{ background: stage.color, width: `${widthPct}%`, margin: '0 auto 0 0' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
                  >
                    <span className="text-xs font-bold text-white drop-shadow-sm">
                      {stage.count.toLocaleString()}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom summary */}
      <div className="mt-5 pt-4 border-t border-slate-100/60 flex items-center gap-2">
        <Sparkles size={13} className="text-brand-500" />
        <span className="text-[12px] text-slate-600">
          Projected: <strong className="text-emerald-600">{ENROLMENT_FUNNEL[ENROLMENT_FUNNEL.length - 1].count} enrolled</strong> — <strong className="text-slate-900">{fmt(ENROLMENT_FUNNEL[ENROLMENT_FUNNEL.length - 1].count * 28500)}</strong> annual fee income
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Pipeline Revenue Forecast ─── */
function PipelineForecast() {
  const ForecastTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl">
        <div className="font-bold mb-1.5">{label} 2026</div>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300 capitalize">{p.dataKey}:</span>
            <span className="font-bold">{fmt(p.value * 1000)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl border border-slate-100/60 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Pipeline Revenue Forecast</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Projected enrolment revenue — 6-month outlook
          </p>
        </div>
        <InfoPopover title="Pipeline Revenue Forecast" steps={DATA_SOURCES.forecast} />
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PIPELINE_FORECAST} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="optimisticGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="conservativeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={(v) => `£${v >= 1000 ? `${(v / 1000).toFixed(0)}M` : `${v}K`}`}
              width={55}
            />
            <Tooltip content={<ForecastTooltip />} />
            <Area
              type="monotone"
              dataKey="optimistic"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#optimisticGrad)"
              strokeDasharray="6 3"
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#projectedGrad)"
            />
            <Area
              type="monotone"
              dataKey="conservative"
              stroke="#94A3B8"
              strokeWidth={1.5}
              fill="url(#conservativeGrad)"
              strokeDasharray="4 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-50">
        {[
          { label: 'Optimistic', color: '#10B981', dash: true },
          { label: 'Projected', color: '#6366F1', dash: false },
          { label: 'Conservative', color: '#94A3B8', dash: true },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <div
              className="w-5 h-0.5 rounded-full"
              style={{
                background: l.color,
                ...(l.dash ? { backgroundImage: `repeating-linear-gradient(90deg, ${l.color} 0px, ${l.color} 4px, transparent 4px, transparent 8px)`, background: 'transparent' } : {}),
              }}
            />
            <span className="text-[11px] text-slate-500 font-medium">{l.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Campaign Revenue Attribution ─── */
function CampaignAttribution() {
  const totalSpend = CAMPAIGN_REVENUE.reduce((s, c) => s + c.spend, 0)
  const totalRevenue = CAMPAIGN_REVENUE.reduce((s, c) => s + c.enrolledRevenue, 0)

  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl border border-slate-100/60 shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-slate-100/60 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Campaign Revenue Attribution</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Marketing spend traced to enrolled fee income
          </p>
        </div>
        <InfoPopover title="Campaign Revenue Attribution" steps={DATA_SOURCES.campaigns} />
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/60">
            {['Campaign', 'Source', 'Spend', 'Sessions', 'Prospects', 'Enrolments', 'Revenue', 'ROI'].map((h) => (
              <th
                key={h}
                className="text-left px-5 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAMPAIGN_REVENUE.map((c, i) => {
            const roi = c.enrolledRevenue > 0 ? Math.round((c.enrolledRevenue / c.spend) * 100) : null
            return (
              <tr
                key={c.campaign}
                className={`hover:bg-slate-50 transition-colors ${
                  i < CAMPAIGN_REVENUE.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <td className="px-5 py-3">
                  <span className="text-xs font-semibold font-mono text-slate-800 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    {c.campaign}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-500">{c.source}</td>
                <td className="px-5 py-3 text-xs text-slate-600">£{c.spend.toLocaleString()}</td>
                <td className="px-5 py-3 text-xs font-semibold text-slate-700">{c.sessions.toLocaleString()}</td>
                <td className="px-5 py-3 text-xs font-semibold text-slate-700">{c.prospects}</td>
                <td className="px-5 py-3">
                  {c.enrolments > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {c.enrolments}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-xs font-bold text-slate-900">
                  {c.enrolledRevenue > 0 ? fmt(c.enrolledRevenue) : '—'}
                </td>
                <td className="px-5 py-3">
                  {roi ? (
                    <span className="text-xs font-bold text-emerald-600">{roi.toLocaleString()}%</span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Total row */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Total across all campaigns</span>
        <div className="flex items-center gap-6">
          <span className="text-xs text-slate-500">Spend: <strong className="text-slate-800">£{totalSpend.toLocaleString()}</strong></span>
          <span className="text-xs text-slate-500">Revenue: <strong className="text-emerald-700">{fmt(totalRevenue)}</strong></span>
          <span className="text-xs text-slate-500">ROI: <strong className="text-emerald-700">{pct(totalSpend, totalRevenue)}</strong></span>
        </div>
      </div>

      {/* AI insight */}
      <div className="px-5 py-3 border-t border-slate-100/60 flex items-center gap-2">
        <Sparkles size={12} className="text-brand-500 flex-shrink-0" />
        <span className="text-[12px] text-slate-600">
          Your <strong className="text-slate-900">spring_open_day_2026</strong> campaign turned £480 into £57K of enrolled fees — <strong className="text-emerald-600">11,875% ROI</strong>
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Competitor Loss Intelligence ─── */
function CompetitorLosses() {
  const totalLost = COMPETITOR_LOSSES.reduce((s, c) => s + c.feeValueLost, 0)
  const totalFamilies = COMPETITOR_LOSSES.reduce((s, c) => s + c.familiesLost, 0)

  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl border border-slate-100/60 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Competitor Loss Intelligence</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {totalFamilies} families lost — {fmt(totalLost)} in fee value
          </p>
        </div>
        <InfoPopover title="Competitor Loss Intelligence" steps={DATA_SOURCES.competitors} />
      </div>

      <div className="space-y-3">
        {COMPETITOR_LOSSES.map((c) => {
          const barPct = Math.round((c.familiesLost / totalFamilies) * 100)
          return (
            <div key={c.school} className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100/60">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-bold text-slate-900">{c.school}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{c.topReason}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-red-600">{c.familiesLost} lost</div>
                  <div className="text-[11px] text-slate-400">{fmt(c.feeValueLost)}</div>
                </div>
              </div>
              <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full rounded-full bg-red-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="text-[11px] text-slate-500 italic">{c.pattern}</div>
            </div>
          )
        })}
      </div>

      {/* AI insight */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-start gap-2">
        <Sparkles size={12} className="text-brand-500 flex-shrink-0 mt-0.5" />
        <span className="text-[12px] text-slate-600">
          63% of competitor losses showed <strong className="text-slate-900">fee-checking behaviour</strong> — consider introducing bursary information earlier in tours
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Top Lifetime Value Prospects ─── */
function LifetimeValueTable() {
  const navigate = useNavigate()

  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl border border-slate-100/60 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Top Family Lifetime Value</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Annual fees × years remaining × siblings
          </p>
        </div>
        <InfoPopover title="Family Lifetime Value" steps={DATA_SOURCES.lifetime} />
      </div>

      <div className="space-y-2">
        {TOP_LIFETIME_VALUE.map((f, i) => (
          <div
            key={f.id}
            onClick={() => navigate(`/prospects/${f.id}`)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer"
          >
            <span className="text-slate-300 text-xs font-bold w-4 text-center">{i + 1}</span>
            <Avatar name={f.name} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900">{f.name}</div>
              <div className="text-[11px] text-slate-400">
                {f.child} · {f.yearGroup} · {f.projectedYears}yrs remaining
                {f.siblings > 0 && <span className="text-violet-500 font-bold"> · +{f.siblings} sibling</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold text-slate-900">{fmt(f.totalValue)}</div>
              <div className="text-[11px] text-slate-400">{f.probability}% likely</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main Page ─── */
export default function RevenueIntelligence() {
  const loading = usePageLoad(1000)
  const m = REVENUE_METRICS

  if (loading) return <RevenueSkeleton />

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-display text-3xl text-slate-900 italic">Revenue Intelligence</h1>
        <p className="text-slate-500 mt-1.5 text-[15px]">
          Connecting website behaviour to enrolled fee income — the full attribution loop.
        </p>
      </motion.div>

      {/* HubSpot connection badge */}
      <motion.div variants={item} className="flex items-center gap-2 bg-orange-50/80 border border-orange-100 rounded-xl px-4 py-2.5">
        <span className="w-2 h-2 rounded-full bg-orange-400" />
        <span className="text-xs font-semibold text-orange-700">
          HubSpot CRM Connected
        </span>
        <span className="text-[11px] text-orange-500 ml-1">Last synced 12 mins ago · 3 years of deal history</span>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard
          label="Pipeline Value"
          value={fmt(m.pipelineValue)}
          sub="Active prospects"
          icon={PoundSterling}
          color="text-slate-900"
          trend="up"
        />
        <MetricCard
          label="Projected Revenue"
          value={fmt(m.projectedRevenue)}
          sub="Based on probabilities"
          icon={TrendingUp}
          color="text-brand-700"
          trend="up"
        />
        <MetricCard
          label="Enrolled Revenue"
          value={fmt(m.totalEnrolledRevenue)}
          sub="This intake cycle"
          icon={Target}
          color="text-emerald-700"
          trend="up"
        />
        <MetricCard
          label="Campaign ROI"
          value={pct(m.totalCampaignSpend, m.totalEnrolledRevenue)}
          sub={`£${m.totalCampaignSpend.toLocaleString()} total spend`}
          icon={Megaphone}
          color="text-emerald-700"
        />
        <MetricCard
          label="Avg. Lifetime Value"
          value={fmt(m.avgLifetimeValue)}
          sub="Per enrolled family"
          icon={Users}
          color="text-violet-700"
        />
      </div>

      {/* Row: Funnel + Forecast */}
      <div className="grid grid-cols-2 gap-5">
        <EnrolmentFunnel />
        <PipelineForecast />
      </div>

      {/* Campaign Attribution */}
      <CampaignAttribution />

      {/* Row: Competitors + Lifetime Value */}
      <div className="grid grid-cols-2 gap-5">
        <CompetitorLosses />
        <LifetimeValueTable />
      </div>
    </motion.div>
  )
}
