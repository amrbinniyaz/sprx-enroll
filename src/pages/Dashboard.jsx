import { useNavigate } from 'react-router-dom'
import { ChevronRight, Flame, Eye, Snowflake, FileText, Mail, MousePointerClick } from 'lucide-react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
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
          className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-2xl p-5 flex items-center gap-5"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />
          <div className="relative text-4xl anim-pulse-hot rounded-full">&#128293;</div>
          <div className="relative flex-1">
            <div className="text-white font-bold text-base">
              Action Required: {hot.length} Hot Prospect{hot.length > 1 ? 's' : ''}
            </div>
            <div className="text-red-100 text-sm mt-0.5">
              {topProspect.name} ({topProspect.score}) is your highest priority call right now.
            </div>
          </div>
          <button
            onClick={() => navigate(`/prospects/${topProspect.id}`)}
            className="relative bg-white text-red-600 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors shadow-lg shadow-red-900/20 flex-shrink-0 cursor-pointer"
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
        {/* Chart */}
        <motion.div
          variants={item}
          className="bg-white rounded-2xl p-5 border border-slate-100/80"
        >
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Pipeline Breakdown
          </h3>

          {/* Stacked bar */}
          <div className="flex h-3 rounded-full overflow-hidden gap-[2px] mb-5">
            {bandData.map((b) => (
              <div
                key={b.name}
                className="rounded-full transition-all duration-700"
                style={{
                  width: `${(b.count / PROSPECTS.length) * 100}%`,
                  background: b.color,
                }}
              />
            ))}
          </div>

          <div className="h-40 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bandData} barSize={32} barCategoryGap="20%">
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    fontSize: 13,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {bandData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4">
            {bandData.map((b) => (
              <div key={b.name} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: b.color }} />
                <span className="text-[13px] text-slate-600 flex-1">
                  {b.emoji} {b.name}
                </span>
                <span className="text-[13px] font-bold text-slate-900">{b.count}</span>
              </div>
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
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Live Activity Feed</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time updates from your website</p>
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
