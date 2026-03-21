import { useNavigate } from 'react-router-dom'
import { ChevronRight, Flame, Eye, Snowflake, FileText, Mail, MousePointerClick, ArrowUpRight, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { PROSPECTS, ACTIVITY_FEED } from '../data/prospects'
import { getBand, getPattern } from '../lib/utils'
import Avatar from '../components/Avatar'
import BandPill from '../components/BandPill'
import PatternPill from '../components/PatternPill'
import AcquisitionInsights from '../components/AcquisitionInsights'
import { DashboardSkeleton } from '../components/Skeleton'
import { usePageLoad } from '../hooks/usePageLoad'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }

const ACTIVITY_RING_COLORS = {
  hot: { ring: 'border-red-500', dot: 'bg-red-500' },
  view: { ring: 'border-brand-400', dot: 'bg-brand-500' },
  cold: { ring: 'border-slate-300', dot: 'bg-slate-400' },
  form: { ring: 'border-red-500', dot: 'bg-red-500' },
  email: { ring: 'border-amber-400', dot: 'bg-amber-500' },
  click: { ring: 'border-amber-400', dot: 'bg-amber-500' },
}

const TAG_COLORS = {
  slate: 'bg-slate-50 text-slate-600 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
}

function renderBoldText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
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

      {/* Real-Time Intent Feed */}
      <motion.div
        variants={item}
        className="bg-white rounded-2xl border border-slate-100/60 overflow-hidden shadow-sm"
      >
        <div className="px-5 py-4 border-b border-slate-100/60 flex items-center gap-3">
          <Clock size={20} className="text-slate-400" />
          <h3 className="font-display text-xl text-slate-900 italic">Real-Time Intent Feed</h3>
        </div>
        <div className="divide-y divide-slate-100/80">
          {ACTIVITY_FEED.map((a) => {
            const ring = ACTIVITY_RING_COLORS[a.type] || ACTIVITY_RING_COLORS.view
            return (
              <div key={a.id} className="px-6 py-5 flex items-start gap-4">
                <div className={`w-6 h-6 rounded-full border-[1.5px] ${ring.ring} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <div className={`w-2 h-2 rounded-full ${ring.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[15px] font-bold text-slate-900">{a.prospect}</span>
                    {a.location && (
                      <span className="text-[13px] text-slate-400">({a.location})</span>
                    )}
                  </div>
                  <p className="text-[14px] text-slate-500 mt-1 leading-relaxed">
                    {renderBoldText(a.text)}
                  </p>
                  {(a.tag || a.actions?.length > 0) && (
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      {a.tag && (
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${TAG_COLORS[a.tag.color] || TAG_COLORS.slate}`}>
                          {a.tag.label}
                        </span>
                      )}
                      {a.actions?.map((action) => (
                        <button
                          key={action}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border cursor-pointer transition-colors ${
                            action === 'Call Lead'
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0 mt-1 font-semibold uppercase tracking-wide whitespace-nowrap">
                  {a.time}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* GA4 Acquisition Insights */}
      <motion.div variants={item}>
        <AcquisitionInsights />
      </motion.div>
    </motion.div>
  )
}
