import { useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { PROSPECTS } from '../data/prospects'
import { getBand } from '../lib/utils'

const ALERT_TYPES = {
  hot: {
    border: 'border-red-100/60',
    iconBg: 'bg-red-50',
    emoji: '\uD83D\uDD25',
    btn: 'bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/15',
    label: 'Hot Prospect',
    section: '\uD83D\uDD25 Hot Prospects',
    sectionColor: 'text-red-500',
  },
  cold: {
    border: 'border-slate-200/60',
    iconBg: 'bg-slate-50',
    emoji: '\u2744\uFE0F',
    btn: 'bg-slate-800 hover:bg-slate-900 shadow-sm',
    label: 'Going Cold',
    section: '\u2744\uFE0F Going Cold',
    sectionColor: 'text-slate-400',
  },
  stalker: {
    border: 'border-violet-100/60',
    iconBg: 'bg-violet-50',
    emoji: '\uD83D\uDC7B',
    btn: 'bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-600/15',
    label: 'Silent Stalker',
    section: '\uD83D\uDC7B Silent Stalkers',
    sectionColor: 'text-violet-500',
  },
}

function AlertCard({ prospect, type, onNavigate, onToast }) {
  const cfg = ALERT_TYPES[type]
  const bc = getBand(prospect.band)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white rounded-2xl border ${cfg.border} p-5 shadow-sm card-hover`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 ${cfg.iconBg} rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}
        >
          {cfg.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900">{cfg.label}</span>
            <span className="text-slate-300">&mdash;</span>
            <span className="font-bold text-slate-900">{prospect.name}</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-lg"
              style={{ background: bc.bg, color: bc.text }}
            >
              Score: {prospect.score}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            {prospect.aiSummary.split('.')[0]}.
          </p>
          <div className="flex items-center gap-3 mt-2.5 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Phone size={13} className="text-slate-400" /> {prospect.phone}
            </span>
            <span className="text-slate-300">&middot;</span>
            <span>
              {prospect.childName} &mdash; {prospect.yearGroup} {prospect.yearOfEntry}
            </span>
          </div>
          <div className="flex gap-2.5 mt-4">
            <button
              onClick={() => onNavigate(`/prospects/${prospect.id}`)}
              className={`text-xs text-white font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.97] ${cfg.btn}`}
            >
              View Full Profile
            </button>
            <button
              onClick={() => onToast?.(`${prospect.name} marked as called`)}
              className="text-xs bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/60"
            >
              Mark as Called
            </button>
            {type === 'cold' && (
              <button
                onClick={() => onToast?.(`Re-engagement email sent to ${prospect.name}`)}
                className="text-xs bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/60"
              >
                Send Re-engagement Email
              </button>
            )}
            {type === 'stalker' && (
              <button
                onClick={() => onToast?.(`Open day invite sent to ${prospect.name}`)}
                className="text-xs bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/60"
              >
                Send Open Day Invite
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Alerts({ onToast }) {
  const navigate = useNavigate()

  const groups = [
    { type: 'hot', prospects: PROSPECTS.filter((p) => p.band === 'hot') },
    { type: 'cold', prospects: PROSPECTS.filter((p) => p.pattern === 'going_cold') },
    { type: 'stalker', prospects: PROSPECTS.filter((p) => p.pattern === 'silent_stalker') },
  ].filter((g) => g.prospects.length > 0)

  const total = groups.reduce((s, g) => s + g.prospects.length, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display text-3xl text-slate-900 italic">Alerts</h1>
        <p className="text-slate-500 mt-1">
          {total} alert{total !== 1 ? 's' : ''} requiring your attention
        </p>
      </div>

      {groups.map((g) => {
        const cfg = ALERT_TYPES[g.type]
        return (
          <div key={g.type} className="space-y-3">
            <div
              className={`text-xs font-bold uppercase tracking-[0.12em] px-1 ${cfg.sectionColor}`}
            >
              {cfg.section}
            </div>
            {g.prospects.map((p) => (
              <AlertCard
                key={p.id}
                prospect={p}
                type={g.type}
                onNavigate={navigate}
                onToast={onToast}
              />
            ))}
          </div>
        )
      })}
    </motion.div>
  )
}
