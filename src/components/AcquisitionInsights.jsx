import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  Megaphone,
  MapPin,
  ExternalLink,
  Flame,
  ArrowUpRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  TRAFFIC_SOURCES,
  CONVERSION_BY_CHANNEL,
  DEVICE_SPLIT,
  CAMPAIGNS,
  TOP_LANDING_PAGES,
  GEO_REGIONS,
} from '../data/analytics'

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

const DEVICE_ICONS = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Tablet: Tablet,
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-xl">
      <span className="text-slate-300">{d.name || d.payload?.name || d.payload?.channel}: </span>
      <span className="font-bold">{d.value}%</span>
    </div>
  )
}

/* ─── Traffic Sources Donut ─── */
function TrafficSourcesCard() {
  const [hovered, setHovered] = useState(null)

  return (
    <motion.div variants={item} className="bg-white rounded-2xl border border-slate-100/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Traffic Sources</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Where your visitors come from</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-lg">
          GA4
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[140px] h-[140px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={TRAFFIC_SOURCES}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                onMouseEnter={(_, i) => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {TRAFFIC_SOURCES.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={hovered !== null && hovered !== i ? 0.35 : 1}
                    style={{ transition: 'opacity 0.2s ease' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {TRAFFIC_SOURCES.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center gap-2 cursor-default"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform"
                style={{
                  background: s.color,
                  transform: hovered === i ? 'scale(1.4)' : 'scale(1)',
                }}
              />
              <span className="text-xs text-slate-600 flex-1 truncate">{s.name}</span>
              <span className="text-xs font-bold text-slate-900">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Conversion by Channel ─── */
function ConversionByChannelCard() {
  const sorted = [...CONVERSION_BY_CHANNEL].sort((a, b) => b.rate - a.rate)

  return (
    <motion.div variants={item} className="bg-white rounded-2xl border border-slate-100/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Conversion by Channel</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Visitor → Enquiry rate per source
          </p>
        </div>
        <TrendingUp size={14} className="text-slate-300" />
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" barSize={14} margin={{ left: 0, right: 8 }}>
            <CartesianGrid horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              domain={[0, 30]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis
              type="category"
              dataKey="channel"
              axisLine={false}
              tickLine={false}
              width={60}
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
            />
            <Tooltip
              formatter={(v) => [`${v}%`, 'Conversion Rate']}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            />
            <Bar dataKey="rate" radius={[0, 6, 6, 0]}>
              {sorted.map((entry) => (
                <Cell key={entry.channel} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-[11px] text-slate-400">
        <ArrowUpRight size={11} className="text-emerald-500" />
        <span>
          <strong className="text-emerald-600">Referral</strong> converts 5x better than Direct
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Device Split ─── */
function DeviceSplitCard() {
  return (
    <motion.div variants={item} className="bg-white rounded-2xl border border-slate-100/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Devices</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">How families browse your site</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {DEVICE_SPLIT.map((d) => {
          const Icon = DEVICE_ICONS[d.name] || Monitor
          return (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon size={14} style={{ color: d.color }} />
                  <span className="text-sm font-medium text-slate-700">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {d.sessions.toLocaleString()} sessions
                  </span>
                  <span className="text-sm font-bold text-slate-900">{d.value}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: d.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${d.value}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Smartphone size={11} className="text-pink-500" />
          <span>
            <strong className="text-slate-600">39% mobile</strong> — ensure your enquiry form is
            mobile-optimised
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Campaign Performance ─── */
function CampaignPerformanceCard() {
  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl border border-slate-100/80 overflow-hidden col-span-2"
    >
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Campaign Performance</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Which campaigns are producing your best prospects
          </p>
        </div>
        <Megaphone size={14} className="text-slate-300" />
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/60">
            {['Campaign', 'Source', 'Sessions', 'Prospects', 'Hot', 'Conv. Rate', 'Spend', 'Cost / Lead'].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-5 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {CAMPAIGNS.map((c, i) => {
            const cpl = c.prospects > 0 ? Math.round(c.spend / c.prospects) : '—'
            return (
              <tr
                key={c.name}
                className={`hover:bg-slate-50 transition-colors ${
                  i < CAMPAIGNS.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <td className="px-5 py-3">
                  <span className="text-xs font-semibold font-mono text-slate-800 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    {c.name}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-500">{c.source}</td>
                <td className="px-5 py-3 text-xs font-semibold text-slate-700">
                  {c.sessions.toLocaleString()}
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-slate-700">{c.prospects}</td>
                <td className="px-5 py-3">
                  {c.hot > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      <Flame size={10} /> {c.hot}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-bold text-emerald-600">{c.enquiryRate}%</span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-600">
                  £{c.spend.toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-semibold text-slate-800">
                    {typeof cpl === 'number' ? `£${cpl}` : cpl}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </motion.div>
  )
}

/* ─── Top Landing Pages ─── */
function TopLandingPagesCard() {
  const sorted = [...TOP_LANDING_PAGES].sort((a, b) => b.rate - a.rate)
  const maxRate = Math.max(...sorted.map((p) => p.rate))

  return (
    <motion.div variants={item} className="bg-white rounded-2xl border border-slate-100/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Top Landing Pages</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">By enquiry conversion rate</p>
        </div>
        <ExternalLink size={14} className="text-slate-300" />
      </div>

      <div className="space-y-3">
        {sorted.map((p, i) => (
          <div key={p.page}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-300 text-[10px] font-bold w-3">{i + 1}</span>
                <span className="text-xs font-medium text-slate-700 truncate">{p.label}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[11px] text-slate-400">{p.sessions} visits</span>
                <span className="text-xs font-bold text-brand-600 w-10 text-right">
                  {p.rate}%
                </span>
              </div>
            </div>
            <div className="ml-5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                initial={{ width: 0 }}
                animate={{ width: `${(p.rate / maxRate) * 100}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-[11px] text-slate-400">
        <ArrowUpRight size={11} className="text-brand-500" />
        <span>
          <strong className="text-brand-600">/admissions/book-a-visit</strong> has your highest
          conversion rate
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Geographic Regions ─── */
function GeoRegionsCard() {
  const maxPct = Math.max(...GEO_REGIONS.map((r) => r.pct))

  return (
    <motion.div variants={item} className="bg-white rounded-2xl border border-slate-100/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Visitor Regions</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Where families are browsing from</p>
        </div>
        <MapPin size={14} className="text-slate-300" />
      </div>

      <div className="space-y-2.5">
        {GEO_REGIONS.map((r) => (
          <div key={r.region} className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-700 w-24 truncate">{r.region}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    r.region === 'International'
                      ? '#8B5CF6'
                      : `rgba(99, 102, 241, ${0.3 + (r.pct / maxPct) * 0.7})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(r.pct / maxPct) * 100}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="flex items-center gap-1.5 w-16 justify-end">
              <span className="text-xs font-bold text-slate-700">{r.pct}%</span>
              <span className="text-[10px] text-slate-400">({r.visitors})</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-[11px] text-slate-400">
        <MapPin size={11} className="text-violet-500" />
        <span>
          <strong className="text-slate-600">8% international</strong> — consider boarding page
          prominence
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Main Export ─── */
export default function AcquisitionInsights() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Acquisition Insights</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            School-wide website analytics from Google Analytics 4
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
          <img
            src="https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg"
            alt="GA4"
            className="w-4 h-4"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <span className="text-[11px] font-semibold text-slate-500">
            Google Analytics 4
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Row 1: Traffic Sources + Conversion + Devices */}
      <div className="grid grid-cols-3 gap-5">
        <TrafficSourcesCard />
        <ConversionByChannelCard />
        <DeviceSplitCard />
      </div>

      {/* Row 2: Campaigns (2 cols) + Landing Pages (1 col) */}
      <div className="grid grid-cols-3 gap-5">
        <CampaignPerformanceCard />
        <TopLandingPagesCard />
      </div>

      {/* Row 3: Geo */}
      <div className="grid grid-cols-3 gap-5">
        <GeoRegionsCard />
      </div>
    </div>
  )
}
