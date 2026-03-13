import { useNavigate } from 'react-router-dom'
import { ChevronRight, Flame, Eye, Snowflake, FileText, Mail, MousePointerClick } from 'lucide-react'
import { motion } from 'framer-motion'
import { PROSPECTS, ACTIVITY_FEED } from '../data/prospects'
import { getBand, getPattern } from '../lib/utils'
import Avatar from '../components/Avatar'
import BandPill from '../components/BandPill'
import PatternPill from '../components/PatternPill'
import AcquisitionInsights from '../components/AcquisitionInsights'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }

const ACTIVITY_ICONS = {
  hot: <Flame size={15} className="text-red-500" />,
  view: <Eye size={15} className="text-brand-500" />,
  cold: <Snowflake size={15} className="text-slate-400" />,
  form: <FileText size={15} className="text-emerald-500" />,
  email: <Mail size={15} className="text-amber-500" />,
  click: <MousePointerClick size={15} className="text-blue-500" />,
}

function StatCard({ label, value, sub, color, emoji }) {
  return (
    <motion.div
      variants={item}
      className="bg-white rounded-2xl p-5 border border-slate-100/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            {label}
          </div>
          <div className={`text-3xl font-extrabold mt-1.5 tracking-tight ${color}`}>{value}</div>
          {sub && <div className="text-slate-400 text-xs mt-1 font-medium">{sub}</div>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">
          {emoji}
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Pipeline Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Good morning, Amanda. You have{' '}
          <strong className="text-red-600">{hot.length} hot prospects</strong> to contact today.
        </p>
      </motion.div>

      {/* Hot Alert Banner */}
      {hot.length > 0 && (
        <motion.div
          variants={item}
          className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 border border-slate-100/80 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <Flame size={18} className="text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-900 font-semibold text-sm">
              {hot.length} hot prospect{hot.length > 1 ? 's' : ''} need attention
            </div>
            <div className="text-slate-400 text-[13px] mt-0.5">
              {topProspect.name} ({topProspect.score}) is your highest priority right now
            </div>
          </div>
          <button
            onClick={() => navigate(`/prospects/${topProspect.id}`)}
            className="text-brand-600 bg-brand-50 hover:bg-brand-100 text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex-shrink-0 cursor-pointer"
          >
            View Profile &rarr;
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Prospects" value={PROSPECTS.length} sub="This month" color="text-slate-900" emoji="&#128101;" />
        <StatCard label="Hot Prospects" value={hot.length} sub={`${warm.length} warming up`} color="text-red-600" emoji="&#128293;" />
        <StatCard label="Avg. Score" value={avg} sub="Across active pipeline" color="text-brand-600" emoji="&#128200;" />
        <StatCard label="Pipeline Value" value="£2.1M" sub="Projected annual fees" color="text-emerald-600" emoji="&#128176;" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Pipeline Breakdown */}
        <motion.div
          variants={item}
          className="bg-white rounded-2xl p-5 border border-slate-100/80"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                        className="w-2 h-2 rounded-full"
                        style={{ background: b.color }}
                      />
                      <span className="text-[13px] text-slate-600 font-medium">
                        {b.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-slate-900">
                        {b.count}
                      </span>
                      <span className="text-[11px] text-slate-400 w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: b.color, opacity: 0.8 }}
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
          className="col-span-2 bg-white rounded-2xl border border-slate-100/80 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Prospects to Contact</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by conversion score</p>
            </div>
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg uppercase tracking-wider">
              Priority
            </span>
          </div>
          {top5.map((p, i) => {
            const bc = getBand(p.band)
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/prospects/${p.id}`)}
                className={`px-5 py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                  i < top5.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <span className="text-slate-300 text-xs font-bold w-4 text-center">{i + 1}</span>
                <Avatar name={p.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                    <PatternPill pattern={p.pattern} />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {p.childName} &middot; {p.yearGroup} &middot; {p.yearOfEntry}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="text-sm font-extrabold" style={{ color: bc.color }}>
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
        className="bg-white rounded-2xl border border-slate-100/80 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Activity Feed</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time updates from your website</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-emerald-600">Live</span>
          </div>
        </div>
        {ACTIVITY_FEED.map((a, i) => (
          <div
            key={a.id}
            className={`px-5 py-3 flex items-start gap-3 ${
              i < ACTIVITY_FEED.length - 1 ? 'border-b border-slate-50' : ''
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              {ACTIVITY_ICONS[a.type]}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px]">
                <strong className="text-slate-900">{a.prospect}</strong>{' '}
                <span className="text-slate-500">{a.text}</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400 flex-shrink-0 mt-0.5">{a.time}</span>
          </div>
        ))}
      </motion.div>

      {/* GA4 Acquisition Insights */}
      <motion.div variants={item}>
        <AcquisitionInsights />
      </motion.div>
    </motion.div>
  )
}
