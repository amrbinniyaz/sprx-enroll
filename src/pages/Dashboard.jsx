import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronRight, ChevronDown, Flame, Eye, Snowflake, FileText, Mail, MousePointerClick, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProspects } from '../hooks/useProspects'
import { useActivity } from '../hooks/useActivity'
import { getBand, getPattern } from '../lib/utils'
import Avatar from '../components/Avatar'
import BandPill from '../components/BandPill'
import PatternPill from '../components/PatternPill'
import AcquisitionInsights from '../components/AcquisitionInsights'
import { DashboardSkeleton } from '../components/Skeleton'
import { usePageLoad } from '../hooks/usePageLoad'
import DashboardCharts from '../components/DashboardCharts'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }

const ACTIVITY_CONFIG = {
  hot:    { icon: <Flame size={14} className="text-red-500" />,              bg: 'bg-red-50',     border: 'border-red-100',     label: 'Hot Alert',   labelCls: 'text-red-600 bg-red-50 border-red-100' },
  view:   { icon: <Eye size={14} className="text-brand-600" />,              bg: 'bg-brand-50',   border: 'border-brand-100',   label: 'Page View',   labelCls: 'text-brand-700 bg-brand-50 border-brand-100' },
  cold:   { icon: <Snowflake size={14} className="text-slate-400" />,        bg: 'bg-slate-100',  border: 'border-slate-200',   label: 'Going Cold',  labelCls: 'text-slate-500 bg-slate-100 border-slate-200' },
  form:   { icon: <FileText size={14} className="text-emerald-600" />,       bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Form Submit', labelCls: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  email:  { icon: <Mail size={14} className="text-amber-500" />,             bg: 'bg-amber-50',   border: 'border-amber-100',   label: 'Email Open',  labelCls: 'text-amber-600 bg-amber-50 border-amber-100' },
  click:  { icon: <MousePointerClick size={14} className="text-blue-500" />, bg: 'bg-blue-50',    border: 'border-blue-100',    label: 'Link Click',  labelCls: 'text-blue-600 bg-blue-50 border-blue-100' },
  scroll: { icon: <Eye size={14} className="text-indigo-500" />,             bg: 'bg-indigo-50',  border: 'border-indigo-100',  label: 'Scroll',      labelCls: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
}

function parseActivityText(text) {
  const match = text.match(/(.*?)(\/[\w\-/]+)(.*)/)
  if (match) return { before: match[1], path: match[2], after: match[3] }
  return { before: text, path: null, after: '' }
}

function groupActivity(activity) {
  const groups = []
  for (const event of activity) {
    const last = groups[groups.length - 1]
    if (last && last.prospect === event.prospect) {
      last.events.push(event)
    } else {
      groups.push({ prospect: event.prospect, events: [event] })
    }
  }
  return groups
}

function ActivityRow({ event }) {
  const cfg = ACTIVITY_CONFIG[event.type] || ACTIVITY_CONFIG.view
  const { before, path, after } = parseActivityText(event.text)
  return (
    <div className="flex items-center gap-2 py-1">
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${cfg.labelCls} uppercase tracking-wide flex-shrink-0`}>
        {cfg.label}
      </span>
      <p className="text-[12px] text-slate-500 leading-snug truncate flex-1 min-w-0">
        {before}
        {path && (
          <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1 py-0.5 rounded mx-0.5">
            {path}
          </span>
        )}
        {after}
      </p>
      <span className="text-[11px] text-slate-400 flex-shrink-0 font-medium tabular-nums">{event.time}</span>
    </div>
  )
}

function ActivityGroup({ group, isLast }) {
  const [expanded, setExpanded] = useState(false)
  const rest = group.events.slice(1)

  return (
    <div className={`px-5 py-3.5 ${!isLast ? 'border-b border-slate-50' : ''}`}>
      {/* Header row: avatar + name + latest event */}
      <div className="flex items-start gap-3.5">
        <Avatar name={group.prospect} size="w-8 h-8 text-xs" />
        <div className="flex-1 min-w-0">
          <span className="text-[13px] font-semibold text-slate-900">{group.prospect}</span>
          <ActivityRow event={group.events[0]} />

          {/* Expanded rows */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="border-l-2 border-slate-100 pl-3 mt-1 space-y-0">
                  {rest.map((e) => <ActivityRow key={e.id} event={e} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle */}
          {rest.length > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400 hover:text-brand-600 transition-colors font-medium"
            >
              <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
              {expanded ? 'Show less' : `${rest.length} more event${rest.length > 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ActivityGroups({ activity }) {
  const groups = groupActivity(activity)
  return groups.map((group, i) => (
    <ActivityGroup key={`${group.prospect}-${i}`} group={group} isLast={i === groups.length - 1} />
  ))
}

function StatCard({ label, value, sub, color, emoji, trend }) {
  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl p-5 border border-slate-100/60 card-hover shadow-sm shadow-slate-100/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.1em]">
            {label}
          </div>
          <div className={`stat-number text-4xl mt-2 ${color}`}>{value}</div>
          {sub && (
            <div className="text-slate-400 text-xs mt-1.5 font-medium flex items-center gap-1">
              {trend && <ArrowUpRight size={12} className="text-emerald-500" />}
              {sub}
            </div>
          )}
        </div>
        <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-lg border border-slate-100/60">
          {emoji}
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const loading = usePageLoad(900)
  const navigate = useNavigate()
  const { prospects: PROSPECTS } = useProspects()
  const { activity, isLive: isActivityLive } = useActivity()

  if (loading) return <DashboardSkeleton />
  const hot = PROSPECTS.filter((p) => p.band === 'hot')
  const warm = PROSPECTS.filter((p) => p.band === 'warm')
  const avg = Math.round(PROSPECTS.reduce((s, p) => s + p.score, 0) / PROSPECTS.length)
  const topProspect = [...PROSPECTS].sort((a, b) => b.score - a.score)[0]
  const top5 = [...PROSPECTS].sort((a, b) => b.score - a.score).slice(0, 5)

  const bandData = ['hot', 'warm', 'interested', 'cold'].map((b) => ({
    name: getBand(b).label,
    count: PROSPECTS.filter((p) => p.band === b).length,
    color: getBand(b).color,
    emoji: getBand(b).emoji,
  }))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-display text-3xl text-slate-900 italic">
          Pipeline Overview
        </h1>
        <p className="text-slate-500 mt-1.5 text-[15px]">
          Good morning, Amanda. You have{' '}
          <strong className="text-red-600 font-bold">{hot.length} hot prospects</strong> to contact today.
        </p>
      </motion.div>

      {/* Hot Alert Banner */}
      {hot.length > 0 && (
        <motion.div
          variants={item}
          className="bg-gradient-to-r from-red-50 via-white to-white rounded-2xl px-5 py-4 flex items-center gap-4 border border-red-100/60 shadow-sm"
        >
          <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <Flame size={20} className="text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-900 font-bold text-sm">
              {hot.length} hot prospect{hot.length > 1 ? 's' : ''} need attention
            </div>
            <div className="text-slate-400 text-[13px] mt-0.5">
              {topProspect.name} ({topProspect.score}) is your highest priority right now
            </div>
          </div>
          <button
            onClick={() => navigate(`/prospects/${topProspect.id}`)}
            className="text-white bg-slate-900 hover:bg-slate-800 text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex-shrink-0 cursor-pointer shadow-sm active:scale-[0.97]"
          >
            View Profile &rarr;
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Prospects" value={PROSPECTS.length} sub="This month" color="text-slate-900" emoji="&#128101;" />
        <StatCard label="Hot Prospects" value={hot.length} sub={`${warm.length} warming up`} color="text-red-600" emoji="&#128293;" trend />
        <StatCard label="Avg. Score" value={avg} sub="Across active pipeline" color="text-brand-700" emoji="&#128200;" />
        <StatCard label="Pipeline Value" value="£2.1M" sub="Projected annual fees" color="text-emerald-700" emoji="&#128176;" trend />
      </div>

      {/* PostHog site analytics charts */}
      <motion.div variants={item}>
        <DashboardCharts />
      </motion.div>

      <div className="grid grid-cols-3 gap-5">
        {/* Pipeline Breakdown */}
        <motion.div
          variants={item}
          className="bg-white rounded-2xl p-5 border border-slate-100/60 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-slate-900 italic">
              Pipeline Breakdown
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {PROSPECTS.length} total
            </span>
          </div>

          <div className="space-y-4">
            {bandData.map((b) => {
              const pct = Math.round((b.count / PROSPECTS.length) * 100)
              return (
                <div key={b.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: b.color }}
                      />
                      <span className="text-[13px] text-slate-600 font-semibold">
                        {b.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="stat-number text-lg text-slate-900">
                        {b.count}
                      </span>
                      <span className="text-[11px] text-slate-400 w-8 text-right font-medium">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100/80 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: b.color, opacity: 0.85 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mini stacked summary bar */}
          <div className="flex h-1.5 rounded-full overflow-hidden gap-px mt-6">
            {bandData.map((b) => (
              <div
                key={b.name}
                className="rounded-full"
                style={{
                  width: `${(b.count / PROSPECTS.length) * 100}%`,
                  background: b.color,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Top 5 */}
        <motion.div
          variants={item}
          className="col-span-2 bg-white rounded-2xl border border-slate-100/60 overflow-hidden shadow-sm"
        >
          <div className="px-5 py-4 border-b border-slate-100/60 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-slate-900 italic">Top Prospects to Contact</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by conversion score</p>
            </div>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-brand-100/60">
              Priority
            </span>
          </div>
          {top5.map((p, i) => {
            const bc = getBand(p.band)
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/prospects/${p.id}`)}
                className={`px-5 py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-slate-50/60 transition-colors ${
                  i < top5.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <span className="text-slate-300 text-xs font-bold w-4 text-center">{i + 1}</span>
                <Avatar name={p.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{p.name}</span>
                    <PatternPill pattern={p.pattern} />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {p.childName} &middot; {p.yearGroup} &middot; {p.yearOfEntry}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="stat-number text-lg" style={{ color: bc.color }}>
                    {p.score}
                  </span>
                  <span className="text-[11px] text-slate-400">{p.lastSeen}</span>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        variants={item}
        className="bg-white rounded-2xl border border-slate-100/60 overflow-hidden shadow-sm"
      >
        <div className="px-5 py-4 border-b border-slate-100/60 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg text-slate-900 italic">Live Activity Feed</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time updates from your website</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActivityLive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActivityLive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </span>
            <span className={`text-[11px] font-bold ${isActivityLive ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isActivityLive ? 'Live' : 'Demo'}
            </span>
          </div>
        </div>
        <ActivityGroups activity={activity} />
      </motion.div>

      {/* GA4 Acquisition Insights */}
      <motion.div variants={item}>
        <AcquisitionInsights />
      </motion.div>
    </motion.div>
  )
}
