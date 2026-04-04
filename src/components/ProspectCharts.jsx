import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

// Page name mapping (mirrors backend)
const PAGE_NAMES = {
  '/test-fees.html': 'Fees',
  '/test-admissions.html': 'Admissions',
  '/test-school-life.html': 'School Life',
  '/test-open-days.html': 'Open Days',
  '/test-contact.html': 'Contact',
  '/test-school-site.html': 'Home',
  '/thank-you.html': 'Thank You',
}

function pageName(path) {
  if (!path) return 'Unknown'
  const mapped = PAGE_NAMES[path]
  if (mapped) return mapped
  const seg = path.split('/').filter(Boolean).pop() || 'Home'
  return seg.replace(/\.html$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function isLiveEvents(events) {
  return events.length > 0 && !!events[0].timestamp && !events[0].type
}

// ---------- data derivation ----------

function buildDailyActivity(events) {
  const counts = {}
  events
    .filter(e => e.event === '$pageview')
    .forEach(e => {
      const day = e.timestamp.slice(0, 10)
      counts[day] = (counts[day] || 0) + 1
    })

  // Build last 14 days, fill gaps
  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    days.push({ day: label, views: counts[key] || 0 })
  }
  return days
}

function buildPageEngagement(events) {
  const pageViews = {}
  const scrollMax = {}

  events.forEach(e => {
    const path = e.properties?.$pathname || e.properties?.page_path || ''
    if (e.event === '$pageview') {
      pageViews[path] = (pageViews[path] || 0) + 1
    }
    if (e.event === 'scroll_depth_reached') {
      const depth = e.properties?.depth || 0
      scrollMax[path] = Math.max(scrollMax[path] || 0, depth)
    }
  })

  return Object.entries(pageViews)
    .map(([path, views]) => ({
      page: pageName(path),
      views,
      scroll: scrollMax[path] || 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
}

function buildTimeOfDay(events) {
  const counts = Array(24).fill(0)
  events.forEach(e => {
    if (!e.timestamp) return
    const hour = new Date(e.timestamp).getHours()
    counts[hour]++
  })

  // Group into readable buckets: show every 2 hours
  return counts.map((count, hour) => ({
    hour: hour % 2 === 0
      ? (hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`)
      : null,
    count,
    fullHour: hour,
  }))
}

function buildScoreTrajectory(events) {
  // Score = pageviews*5 + form_submits*25 + sessions*10, capped at 100
  const sorted = [...events].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  const byDay = {}
  sorted.forEach(e => {
    const day = e.timestamp.slice(0, 10)
    if (!byDay[day]) byDay[day] = { pageviews: 0, forms: 0, sessions: new Set() }
    if (e.event === '$pageview') byDay[day].pageviews++
    if (e.event === 'enquiry_form_submitted') byDay[day].forms++
    const sid = e.properties?.$session_id
    if (sid) byDay[day].sessions.add(sid)
  })

  let cumPV = 0, cumForms = 0
  const allSessions = new Set()

  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => {
      cumPV += data.pageviews
      cumForms += data.forms
      data.sessions.forEach(s => allSessions.add(s))
      const repeatVisits = Math.max(allSessions.size - 1, 0)
      const score = Math.min(cumPV * 5 + cumForms * 25 + repeatVisits * 10, 100)
      const d = new Date(date)
      const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      return { date: label, score }
    })
}

// ---------- tooltip styles ----------

const tooltipStyle = {
  contentStyle: {
    background: '#fff',
    border: '1px solid #f1f5f9',
    borderRadius: 10,
    fontSize: 11,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    padding: '6px 10px',
  },
  itemStyle: { color: '#334155', fontSize: 11 },
  labelStyle: { color: '#94a3b8', fontWeight: 700, fontSize: 10, marginBottom: 2 },
  cursor: { fill: '#f8fafc' },
}

// ---------- chart cards ----------

function ChartCard({ title, subtitle, children, isEmpty }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/60 p-4 shadow-sm">
      <div className="mb-3">
        <div className="text-xs font-bold text-slate-700">{title}</div>
        {subtitle && <div className="text-[10px] text-slate-400 mt-0.5">{subtitle}</div>}
      </div>
      {isEmpty ? (
        <div className="h-24 flex items-center justify-center text-[11px] text-slate-300 font-medium">
          Not enough data yet
        </div>
      ) : children}
    </div>
  )
}

function DailyActivityChart({ data }) {
  const hasData = data.some(d => d.views > 0)
  return (
    <ChartCard
      title="Daily Sessions"
      subtitle="Page views per day · last 14 days"
      isEmpty={!hasData}
    >
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data} barSize={6} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            interval={6}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(v) => [v, 'Views']}
          />
          <Bar dataKey="views" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.views >= 3 ? '#7c3aed' : entry.views >= 1 ? '#a78bfa' : '#e2e8f0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function PageEngagementChart({ data }) {
  return (
    <ChartCard
      title="Page Engagement"
      subtitle="Views + scroll depth per page"
      isEmpty={data.length === 0}
    >
      <div className="space-y-2">
        {data.map((page, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-16 text-[10px] text-slate-500 font-medium truncate flex-shrink-0">
              {page.page}
            </div>
            <div className="flex-1 flex items-center gap-1.5">
              {/* Scroll depth bar */}
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${page.scroll || (page.views > 0 ? 20 : 0)}%`,
                    background: page.scroll >= 80 ? '#10b981' : page.scroll >= 50 ? '#f59e0b' : '#7c3aed',
                  }}
                />
              </div>
              <div className="text-[10px] text-slate-400 w-8 text-right flex-shrink-0">
                {page.scroll > 0 ? `${page.scroll}%` : `${page.views}×`}
              </div>
            </div>
            {/* View count badge */}
            <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-100/80 flex items-center justify-center text-[9px] font-bold text-slate-500 flex-shrink-0">
              {page.views}
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}

function TimeOfDayChart({ data }) {
  const hasData = data.some(d => d.count > 0)
  return (
    <ChartCard
      title="Visit Times"
      subtitle="When they browse — helps time your calls"
      isEmpty={!hasData}
    >
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data} barSize={5} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            interval={0}
            tickFormatter={(v) => v || ''}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(v, _, props) => {
              const h = props.payload.fullHour
              const label = h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`
              return [v, label]
            }}
            labelFormatter={() => 'Events'}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => {
              const h = entry.fullHour
              // Morning 6-11: amber, Afternoon 12-17: brand, Evening 18-22: slate
              const color = h >= 6 && h < 12 ? '#f59e0b'
                : h >= 12 && h < 18 ? '#7c3aed'
                : h >= 18 && h < 23 ? '#334155'
                : '#e2e8f0'
              return <Cell key={i} fill={entry.count > 0 ? color : '#f1f5f9'} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-3 mt-1.5">
        {[['#f59e0b', 'Morning'], ['#7c3aed', 'Afternoon'], ['#334155', 'Evening']].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-[9px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}

function ScoreTrajectoryChart({ data }) {
  const singleDay = data.length === 1
  // Pad single-day data so recharts renders a line
  const chartData = singleDay ? [{ date: '', score: 0 }, ...data] : data

  return (
    <ChartCard
      title="Score Trajectory"
      subtitle="Engagement score building over time"
      isEmpty={data.length === 0}
    >
      {singleDay && (
        <div className="text-[10px] text-slate-400 italic mb-1">Tracking started today — grows over return visits</div>
      )}
      <ResponsiveContainer width="100%" height={singleDay ? 60 : 80}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            interval={Math.max(0, data.length - 2)}
          />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            {...tooltipStyle}
            formatter={(v) => [`${v}/100`, 'Score']}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ---------- main export ----------

export default function ProspectCharts({ rawEvents }) {
  if (!isLiveEvents(rawEvents)) return null

  const daily = buildDailyActivity(rawEvents)
  const pages = buildPageEngagement(rawEvents)
  const timeOfDay = buildTimeOfDay(rawEvents)
  const trajectory = buildScoreTrajectory(rawEvents)

  return (
    <div className="grid grid-cols-4 gap-4">
      <DailyActivityChart data={daily} />
      <PageEngagementChart data={pages} />
      <TimeOfDayChart data={timeOfDay} />
      <ScoreTrajectoryChart data={trajectory} />
    </div>
  )
}
