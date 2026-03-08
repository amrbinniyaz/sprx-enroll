import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Calendar, Mail, Sparkles, Eye, FileText, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { PROSPECTS } from '../data/prospects'
import { getBand, getPattern } from '../lib/utils'
import ScoreRing from '../components/ScoreRing'
import Avatar from '../components/Avatar'
import BandPill from '../components/BandPill'
import AcquisitionCard from '../components/AcquisitionCard'

const EVENT_STYLES = {
  page_view: { icon: Eye, bg: 'bg-slate-100 text-slate-500' },
  form_submit: { icon: FileText, bg: 'bg-brand-50 text-brand-600' },
  email_open: { icon: Mail, bg: 'bg-green-50 text-green-600' },
  email_click: { icon: ExternalLink, bg: 'bg-blue-50 text-blue-600' },
}

function TimelineItem({ event, isLast }) {
  const style = EVENT_STYLES[event.type] || EVENT_STYLES.page_view
  const Icon = style.icon

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}
        >
          <Icon size={14} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-100 mt-1.5" />}
      </div>
      <div className={isLast ? '' : 'pb-5'} style={{ flex: 1 }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900">{event.title}</div>
            {event.duration && (
              <div className="text-xs text-slate-400 mt-0.5">
                {event.duration} on page
                {event.scroll ? ` · ${event.scroll}% scrolled` : ''}
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400 flex-shrink-0 ml-4">{event.time}</span>
        </div>
      </div>
    </div>
  )
}

export default function ProspectProfile({ onToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const prospect = PROSPECTS.find((p) => p.id === Number(id))

  const [notes, setNotes] = useState(prospect?.notes || '')
  const [status, setStatus] = useState(prospect?.status || 'active')

  const reversedEvents = useMemo(
    () => (prospect ? [...prospect.events].reverse() : []),
    [prospect]
  )

  if (!prospect) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="text-4xl mb-3">&#128533;</div>
        <div className="text-sm">Prospect not found</div>
        <button
          onClick={() => navigate('/prospects')}
          className="mt-4 text-sm text-brand-600 font-medium hover:underline cursor-pointer"
        >
          Back to Prospects
        </button>
      </div>
    )
  }

  const bc = getBand(prospect.band)
  const pat = getPattern(prospect.pattern)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <button
        onClick={() => navigate('/prospects')}
        className="text-sm text-slate-400 hover:text-slate-700 flex items-center gap-2 transition-colors font-medium cursor-pointer"
      >
        <ArrowLeft size={15} /> Back to Prospects
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100/80 p-6">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <Avatar name={prospect.name} size="w-16 h-16 text-xl" />
            <ScoreRing score={prospect.score} band={prospect.band} size={100} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {prospect.name}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <BandPill band={prospect.band} size="lg" />
                  {pat && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${pat.pill}`}
                    >
                      {pat.label}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 ml-1">
                    {prospect.visits} website visits
                  </span>
                </div>
              </div>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  onToast?.(`Status updated to ${e.target.value}`)
                }}
                className="text-sm bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="enrolled">Enrolled</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-2.5 mt-5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <a
                  href={`mailto:${prospect.email}`}
                  className="text-brand-600 hover:underline"
                >
                  {prospect.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-slate-400" />
                <a
                  href={`tel:${prospect.phone}`}
                  className="font-semibold text-slate-800 hover:text-brand-600"
                >
                  {prospect.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-[14px]" />
                {prospect.childName} &middot; {prospect.yearGroup} &middot; {prospect.yearOfEntry}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-[14px]" />
                {prospect.source} &middot; Last seen {prospect.lastSeen}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => onToast?.(`${prospect.name} marked as called`)}
            className="bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/15 flex items-center gap-2 cursor-pointer"
          >
            <Phone size={14} /> Mark as Called
          </button>
          <button className="bg-slate-100 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer">
            <Calendar size={14} /> Book Open Day
          </button>
          <button className="bg-slate-100 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer">
            <Mail size={14} /> Send Email
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="col-span-1 space-y-5">
          {/* AI Summary */}
          <div className="ai-glow rounded-2xl p-5 border border-brand-100/50">
            <div className="relative flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-sm">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-sm font-bold text-brand-800">EnrolIQ Intelligence</span>
              <span className="text-[10px] bg-brand-100 text-brand-600 font-semibold px-1.5 py-0.5 rounded-md ml-auto">
                AI
              </span>
            </div>
            <p className="relative text-[13px] text-slate-700 leading-relaxed">
              {prospect.aiSummary}
            </p>
          </div>

          {/* GA4 Acquisition Data */}
          <AcquisitionCard ga4={prospect.ga4} />

          {/* Call Script */}
          <div className="bg-white rounded-2xl border border-slate-100/80 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={14} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-900">Suggested Call Opener</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[13px] text-slate-600 italic leading-relaxed">
                &ldquo;Hi {prospect.name.split(' ')[0]}, this is Amanda from Westbridge. I wanted
                to personally follow up on {prospect.childName}&rsquo;s enquiry and make sure you
                have everything you need. I noticed you&rsquo;ve been looking at our fees
                information — would you like me to walk you through our bursary options?&rdquo;
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-100/80 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-900">Notes</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Private
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about calls, meetings, observations..."
              className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"
              rows={4}
            />
            <button
              onClick={() => onToast?.('Notes saved')}
              className="mt-2.5 w-full text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Save Notes
            </button>
          </div>
        </div>

        {/* Right Column — Timeline */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100/80 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Interaction Timeline</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {prospect.events.length} events tracked
                </p>
              </div>
              <div className="flex gap-4 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-200" /> Page View
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-300" /> Enquiry
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-300" /> Email
                </span>
              </div>
            </div>
            {reversedEvents.map((ev, i) => (
              <TimelineItem key={i} event={ev} isLast={i === reversedEvents.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
