import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProspects } from '../hooks/useProspects'
import { getBand, cn } from '../lib/utils'
import Avatar from '../components/Avatar'
import BandPill from '../components/BandPill'
import PatternPill from '../components/PatternPill'
import { ProspectListSkeleton } from '../components/Skeleton'
import { usePageLoad } from '../hooks/usePageLoad'

const BAND_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'hot', label: 'Hot' },
  { key: 'warm', label: 'Warm' },
  { key: 'interested', label: 'Interested' },
  { key: 'cold', label: 'Cold' },
]

export default function ProspectList() {
  const navigate = useNavigate()
  const { prospects: PROSPECTS } = useProspects()
  const [query, setQuery] = useState('')
  const [bandFilter, setBandFilter] = useState('all')
  const [sortBy, setSortBy] = useState('score')

  const filtered = useMemo(() => {
    return PROSPECTS.filter((p) => {
      const q = query.toLowerCase()
      const matchQ =
        !q ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.childName || '').toLowerCase().includes(q)
      const matchBand = bandFilter === 'all' || p.band === bandFilter
      return matchQ && matchBand
    }).sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
      return 0
    })
  }, [PROSPECTS, query, bandFilter, sortBy])

  const loading = usePageLoad(700)
  if (loading) return <ProspectListSkeleton />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h1 className="font-display text-3xl text-slate-900 italic">Prospects</h1>
        <p className="text-slate-500 mt-1">
          {filtered.length} prospect{filtered.length !== 1 ? 's' : ''} in your pipeline
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100/60 p-4 flex items-center gap-4 flex-wrap shadow-sm">
        <div className="flex-1 min-w-[220px] relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or child..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {BAND_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setBandFilter(f.key)}
              className={cn(
                'px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer',
                bandFilter === f.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60'
              )}
            >
              {f.key !== 'all' ? getBand(f.key).emoji + ' ' : ''}
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-slate-600 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
        >
          <option value="score">Score: High &rarr; Low</option>
          <option value="name">Name: A &rarr; Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100/60 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/60">
              {['Prospect', 'Score', 'Child', 'Entry', 'Pattern', 'Source', 'Last Seen', ''].map(
                (h, i) => (
                  <th
                    key={i}
                    className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const bc = getBand(p.band)
              return (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => navigate(`/prospects/${p.id}`)}
                  className={cn(
                    'cursor-pointer hover:bg-brand-50/30 transition-colors',
                    i < filtered.length - 1 ? 'border-b border-slate-50' : ''
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${p.score}%`, background: bc.color }}
                        />
                      </div>
                      <span className="stat-number text-base" style={{ color: bc.color }}>
                        {p.score}
                      </span>
                      <BandPill band={p.band} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{p.childName || p.child_name || '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{p.yearOfEntry || p.year_group || '—'}</td>
                  <td className="px-5 py-3.5">
                    <PatternPill pattern={p.pattern} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100/60">
                      {p.source || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-400">{p.lastSeen || p.last_seen?.slice(0, 10) || '—'}</td>
                  <td className="px-4 py-3.5">
                    <ChevronRight size={14} className="text-slate-300" />
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">&#128269;</div>
            <div className="text-sm font-medium">No prospects match your filters</div>
            <div className="text-xs mt-1">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
