import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'
import { useDashboardTrends } from '../hooks/useDashboardTrends'

const BRAND = '#7c3aed'
const EMERALD = '#10b981'
const AMBER = '#f59e0b'
const SLATE = '#94a3b8'

// Shared tooltip style
const TT = {
  contentStyle: {
    background: '#fff',
    border: '1px solid #f1f5f9',
    borderRadius: 10,
    fontSize: 11,
    boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
    padding: '7px 11px',
  },
  itemStyle: { color: '#334155', fontSize: 11 },
  labelStyle: { color: '#94a3b8', fontWeight: 700, fontSize: 10 },
  cursor: { stroke: '#f1f5f9', strokeWidth: 1 },
}

function ChartShell({ title, subtitle, period, children, isEmpty, liveIndicator }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          {period && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {period}
            </div>
          )}
          <div className="text-sm font-bold text-slate-900">{title}</div>
          {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
        {liveIndicator && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </span>
        )}
      </div>
      {isEmpty ? (
        <div className="h-36 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[11px] text-slate-300 font-medium">No data yet</div>
            <div className="text-[10px] text-slate-200 mt-0.5">Collecting from PostHog...</div>
          </div>
        </div>
      ) : children}
    </div>
  )
}

function shortDate(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ---------- DAU Chart ----------
function DAUChart({ data, isLive }) {
  const formatted = data.map(d => ({ ...d, label: shortDate(d.date) }))
  const peak = Math.max(...data.map(d => d.value), 1)

  return (
    <ChartShell
      title="Daily Active Visitors"
      subtitle="Unique visitors to the school site per day"
      period="Last 30 days"
      isEmpty={data.length === 0}
      liveIndicator={isLive}
    >
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(data.length / 5)}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            domain={[0, peak + 1]}
            allowDecimals={false}
          />
          <Tooltip
            {...TT}
            formatter={(v) => [v, 'Unique visitors']}
            labelFormatter={(l) => l}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={BRAND}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: BRAND, stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

// ---------- WAU Chart ----------
function WAUChart({ data, isLive }) {
  const formatted = data.map(d => ({ ...d, label: shortDate(d.date) }))
  const peak = Math.max(...data.map(d => d.value), 1)

  return (
    <ChartShell
      title="Weekly Active Visitors"
      subtitle="Unique visitors per week across the school site"
      period="Last 90 days"
      isEmpty={data.length === 0}
      liveIndicator={isLive}
    >
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(data.length / 5)}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            domain={[0, peak + 1]}
            allowDecimals={false}
          />
          <Tooltip
            {...TT}
            formatter={(v) => [v, 'Weekly active visitors']}
            labelFormatter={(l) => `Week of ${l}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={EMERALD}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: EMERALD, stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

// ---------- Growth Accounting Chart ----------
function GrowthChart({ data }) {
  const formatted = data.map(d => ({
    ...d,
    label: shortDate(d.week),
    total: d.new + d.returning,
  }))

  return (
    <ChartShell
      title="Growth Accounting"
      subtitle="New vs returning visitors each week"
      period="Last 30 days"
      isEmpty={data.length === 0}
    >
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={formatted} barSize={18} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            {...TT}
            formatter={(v, name) => [v, name === 'new' ? 'New visitors' : 'Returning visitors']}
            labelFormatter={(l) => `Week of ${l}`}
          />
          <Bar dataKey="new" stackId="a" fill={BRAND} radius={[0, 0, 0, 0]} name="new" />
          <Bar dataKey="returning" stackId="a" fill={EMERALD} radius={[4, 4, 0, 0]} name="returning" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        {[{ color: BRAND, label: 'New' }, { color: EMERALD, label: 'Returning' }].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-[10px] text-slate-400 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </ChartShell>
  )
}

// ---------- Retention Table ----------
function RetentionTable({ data }) {
  const maxWeeks = data.length > 0
    ? Math.max(...data.map(r => Object.keys(r).filter(k => k.startsWith('week')).length))
    : 0

  function retentionColor(pct) {
    if (pct >= 80) return { bg: BRAND, text: '#fff' }
    if (pct >= 50) return { bg: '#a78bfa', text: '#fff' }
    if (pct >= 20) return { bg: '#ddd6fe', text: '#5b21b6' }
    if (pct > 0)   return { bg: '#ede9fe', text: '#7c3aed' }
    return { bg: '#f8fafc', text: '#cbd5e1' }
  }

  return (
    <ChartShell
      title="Retention"
      subtitle="Weekly retention of site visitors by cohort"
      isEmpty={data.length === 0}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">
              <th className="text-left pb-2 pr-3 font-bold">Cohort</th>
              <th className="text-center pb-2 px-1.5 font-bold">Size</th>
              {Array.from({ length: maxWeeks }, (_, i) => (
                <th key={i} className="text-center pb-2 px-1.5 font-bold">Wk {i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} className="border-t border-slate-50">
                <td className="py-1.5 pr-3 text-slate-500 font-medium whitespace-nowrap">
                  {shortDate(row.cohort)}
                </td>
                <td className="py-1.5 px-1.5 text-center text-slate-400">{row.size}</td>
                {Array.from({ length: maxWeeks }, (_, i) => {
                  const pct = row[`week${i}`] ?? null
                  const { bg, text } = retentionColor(pct ?? 0)
                  return (
                    <td key={i} className="py-1.5 px-1.5 text-center">
                      {pct !== null ? (
                        <span
                          className="inline-block min-w-[38px] px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                          style={{ background: bg, color: text }}
                        >
                          {pct}%
                        </span>
                      ) : (
                        <span className="text-slate-200">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  )
}

// ---------- Main export ----------
export default function DashboardCharts() {
  const { trends, loading, isLive } = useDashboardTrends()

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm h-52 animate-pulse">
            <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
            <div className="h-2 w-40 bg-slate-50 rounded mb-4" />
            <div className="h-32 bg-slate-50 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  const hasAnyData = trends.dau.length > 0 || trends.wau.length > 0 || trends.growth.length > 0 || trends.retention.length > 0
  if (!hasAnyData) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl text-slate-900 italic">Site Analytics</h2>
          <p className="text-[12px] text-slate-400 mt-0.5">Visitor trends from PostHog tracking</p>
        </div>
        {isLive && (
          <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-brand-100/60">
            PostHog Live
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <DAUChart data={trends.dau} isLive={isLive} />
        <WAUChart data={trends.wau} isLive={isLive} />
        <GrowthChart data={trends.growth} />
        <RetentionTable data={trends.retention} />
      </div>
    </div>
  )
}
