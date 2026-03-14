import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Calendar, Mail, Sparkles, Eye, FileText, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { PROSPECTS } from '../data/prospects'
import { getBand, getPattern } from '../lib/utils'
import ScoreRing from '../components/ScoreRing'
import ProbabilityRing from '../components/ProbabilityRing'
import Avatar from '../components/Avatar'
import BandPill from '../components/BandPill'
import AcquisitionCard from '../components/AcquisitionCard'
import HubSpotCard from '../components/HubSpotCard'
import { ProfileSkeleton } from '../components/Skeleton'
import { usePageLoad } from '../hooks/usePageLoad'

const EVENT_STYLES = {
  page_view: { icon: Eye, bg: 'bg-slate-50 text-slate-400', label: 'Viewed' },
  form_submit: { icon: FileText, bg: 'bg-brand-50 text-brand-600', label: 'Submitted' },
  email_open: { icon: Mail, bg: 'bg-emerald-50 text-emerald-600', label: 'Opened' },
  email_click: { icon: ExternalLink, bg: 'bg-blue-50 text-blue-600', label: 'Clicked' },
}

const isConversion = (type) => type === 'form_submit' || type === 'email_click'

function parseTimeToMs(timeStr) {
  if (timeStr.includes('mins')) return parseInt(timeStr) * 60000
  if (timeStr.includes('hours')) return parseInt(timeStr) * 3600000
  if (timeStr.includes('day')) return parseInt(timeStr) * 86400000
  return 0
}

function groupEventsIntoSessions(events) {
  const sessions = []
  let current = null

  events.forEach((ev) => {
    const label = ev.time
    if (!current || current.label !== label) {
      current = { label, events: [], totalDuration: 0, pageCount: 0 }
      sessions.push(current)
    }
    current.events.push(ev)
    if (ev.type === 'page_view') {
      current.pageCount++
      if (ev.duration) {
        const parts = ev.duration.split(':')
        current.totalDuration += parseInt(parts[0]) * 60 + parseInt(parts[1])
      }
    }
  })

  return sessions
}

function formatSessionDuration(seconds) {
  if (seconds <= 0) return null
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs.toString().padStart(2, '0')}s`
}

function TimelineGap({ fromTime, toTime, hasEnquiry }) {
  const fromMs = parseTimeToMs(fromTime)
  const toMs = parseTimeToMs(toTime)
  const diffDays = Math.round(Math.abs(toMs - fromMs) / 86400000)
  if (diffDays < 2) return null

  const insight = hasEnquiry && diffDays >= 5
    ? '80% of families revisit within 3 days after enquiring'
    : diffDays >= 10
      ? 'Extended silence — re-engagement may be needed'
      : null

  return (
    <div className="flex items-center gap-3 py-3 ml-3">
      <div className="flex-1 border-t border-dashed border-slate-200" />
      <div className="text-center">
        <span className="text-[10px] text-slate-300 font-bold tracking-wide uppercase whitespace-nowrap">
          {diffDays} days quiet
        </span>
        {insight && (
          <div className="text-[9px] text-amber-500 font-medium mt-0.5 italic">{insight}</div>
        )}
      </div>
      <div className="flex-1 border-t border-dashed border-slate-200" />
    </div>
  )
}

function ScrollBar({ scroll }) {
  if (!scroll) return null
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${scroll}%`,
            background:
              scroll >= 80 ? '#10b981' : scroll >= 50 ? '#f59e0b' : '#94a3b8',
          }}
        />
      </div>
      <span className="text-[10px] text-slate-400">scrolled {scroll}%</span>
    </div>
  )
}

function ScoreChange({ change }) {
  if (!change) return null
  const isPositive = change.startsWith('+')
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
      isPositive
        ? 'bg-emerald-50 text-emerald-600'
        : 'bg-red-50 text-red-500'
    }`}>
      {isPositive
        ? <TrendingUp size={9} />
        : <TrendingDown size={9} />
      }
      {change}
    </span>
  )
}

function AIInsight({ text }) {
  if (!text) return null
  return (
    <div className="flex items-start gap-1.5 mt-1.5 ml-0.5">
      <Sparkles size={10} className="text-brand-400 flex-shrink-0 mt-0.5" />
      <span className="text-[11px] text-brand-600 italic leading-snug">{text}</span>
    </div>
  )
}

function TimelineEvent({ event, isLast }) {
  const style = EVENT_STYLES[event.type] || EVENT_STYLES.page_view
  const Icon = style.icon
  const conversion = isConversion(event.type)

  return (
    <div className="flex gap-0 items-stretch">
      {/* Vertical connector line + icon */}
      <div className="flex flex-col items-center flex-shrink-0 w-7">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 z-10 ${style.bg} ${
            conversion ? 'ring-2 ring-white shadow-sm' : ''
          }`}
        >
          <Icon size={13} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-slate-100 mt-1" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 ml-3 pb-4">
        {conversion ? (
          <div className="bg-gradient-to-r from-brand-50/60 to-transparent rounded-xl px-3.5 py-2.5 border border-brand-100/40">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-slate-900">{event.title}</span>
              <ScoreChange change={event.scoreChange} />
            </div>
            <div className="text-[10px] text-brand-600 font-bold mt-0.5 uppercase tracking-wider">
              Conversion event
            </div>
            <AIInsight text={event.aiInsight} />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-slate-700">{event.title}</span>
              {event.duration && (
                <span className="text-[11px] text-slate-400">{event.duration}</span>
              )}
              <ScoreChange change={event.scoreChange} />
            </div>
            <ScrollBar scroll={event.scroll} />
            <AIInsight text={event.aiInsight} />
          </>
        )}
      </div>
    </div>
  )
}

function SessionGroup({ session, allEventsFlat }) {
  const hasMultiplePages = session.pageCount > 1
  const durationStr = formatSessionDuration(session.totalDuration)

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          {session.label}
        </span>
        {hasMultiplePages && (
          <span className="text-[10px] text-slate-300 font-medium">
            {session.pageCount} pages{durationStr ? ` · ${durationStr}` : ''}
          </span>
        )}
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <div className="ml-0.5">
        {session.events.map((ev, i) => (
          <TimelineEvent
            key={i}
            event={ev}
            isLast={i === session.events.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProspectProfile({ onToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const prospect = PROSPECTS.find((p) => p.id === Number(id))

  const loading = usePageLoad(600)
  const [notes, setNotes] = useState(prospect?.notes || '')
  const [status, setStatus] = useState(prospect?.status || 'active')

  const timelineSessions = useMemo(
    () => (prospect ? groupEventsIntoSessions([...prospect.events].reverse()) : []),
    [prospect]
  )

  const hasEnquiry = prospect?.events.some((e) => e.type === 'form_submit')

  if (loading) return <ProfileSkeleton />

  if (!prospect) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="text-4xl mb-3">&#128533;</div>
        <div className="text-sm">Prospect not found</div>
        <button
          onClick={() => navigate('/prospects')}
          className="mt-4 text-sm text-brand-600 font-bold hover:underline cursor-pointer"
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
        className="text-sm text-slate-400 hover:text-slate-700 flex items-center gap-2 transition-colors font-semibold cursor-pointer"
      >
        <ArrowLeft size={15} /> Back to Prospects
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100/60 p-6 shadow-sm">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <Avatar name={prospect.name} size="w-16 h-16 text-xl" />
            <div className="flex gap-3 items-end">
              <div className="text-center">
                <ScoreRing score={prospect.score} band={prospect.band} size={90} />
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Engagement</div>
              </div>
              <div className="text-center">
                <ProbabilityRing probability={prospect.enrolmentProbability} confidence={prospect.probabilityConfidence} size={90} />
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Enrolment</div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-3xl text-slate-900 italic">
                  {prospect.name}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <BandPill band={prospect.band} size="lg" />
                  {pat && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-bold ${pat.pill}`}
                    >
                      {pat.label}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 ml-1 font-medium">
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
                className="text-sm bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
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
                  className="text-brand-600 hover:underline font-medium"
                >
                  {prospect.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-slate-400" />
                <a
                  href={`tel:${prospect.phone}`}
                  className="font-bold text-slate-800 hover:text-brand-600"
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
        <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100/60">
          <button
            onClick={() => onToast?.(`${prospect.name} marked as called`)}
            className="bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.97]"
          >
            <Phone size={14} /> Mark as Called
          </button>
          <button className="bg-slate-50 text-slate-700 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer border border-slate-200/60">
            <Calendar size={14} /> Book Open Day
          </button>
          <button className="bg-slate-50 text-slate-700 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer border border-slate-200/60">
            <Mail size={14} /> Send Email
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="col-span-1 space-y-5">
          {/* AI Summary */}
          <div className="ai-glow rounded-2xl p-5 border border-brand-100/40">
            <div className="relative flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center shadow-sm">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-sm font-bold text-brand-800">EnrolIQ Intelligence</span>
              <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-1.5 py-0.5 rounded-md ml-auto">
                AI
              </span>
            </div>
            <p className="relative text-[13px] text-slate-700 leading-relaxed">
              {prospect.aiSummary}
            </p>
          </div>

          {/* Enrolment Probability Factors */}
          {prospect.probabilityFactors && (
            <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">Enrolment Probability</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {prospect.similarEnrolled} similar families enrolled · {prospect.probabilityConfidence} confidence
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  prospect.probabilityConfidence === 'high'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : prospect.probabilityConfidence === 'medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}>
                  {prospect.probabilityConfidence}
                </span>
              </div>
              <div className="space-y-2">
                {prospect.probabilityFactors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${
                      f.positive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {f.positive ? '+' : '−'}
                    </span>
                    <span className="text-xs text-slate-600">{f.factor}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100/60 text-[11px] text-slate-400 italic">
                Based on 3 years of historical enrolment data from HubSpot
              </div>
            </div>
          )}

          {/* HubSpot CRM Data */}
          <HubSpotCard hubspot={prospect.hubspot} />

          {/* GA4 Acquisition Data */}
          <AcquisitionCard ga4={prospect.ga4} />

          {/* Call Script */}
          <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={14} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-900">Suggested Call Opener</span>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
              <p className="text-[13px] text-slate-600 italic leading-relaxed font-display text-base">
                &ldquo;Hi {prospect.name.split(' ')[0]}, this is Amanda from Alleyn's. I wanted
                to personally follow up on {prospect.childName}&rsquo;s enquiry and make sure you
                have everything you need. I noticed you&rsquo;ve been looking at our fees
                information — would you like me to walk you through our bursary options?&rdquo;
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-900">Notes</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Private
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about calls, meetings, observations..."
              className="w-full text-sm text-slate-700 bg-slate-50/80 border border-slate-200/60 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none transition-all"
              rows={4}
            />
            <button
              onClick={() => onToast?.('Notes saved')}
              className="mt-2.5 w-full text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 py-2.5 rounded-xl transition-colors cursor-pointer border border-brand-100/60"
            >
              Save Notes
            </button>
          </div>
        </div>

        {/* Right Column — Timeline */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-display text-lg text-slate-900 italic">Interaction Timeline</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {prospect.events.length} events &middot; {prospect.createdAt} to now
                </p>
              </div>
              <div className="flex gap-3 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center"><Eye size={10} className="text-slate-400" /></span>
                  Page View
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-brand-50 flex items-center justify-center"><FileText size={10} className="text-brand-600" /></span>
                  Enquiry
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center"><Mail size={10} className="text-emerald-600" /></span>
                  Email
                </span>
              </div>
            </div>

            {/* Engagement summary strip */}
            <div className="flex items-center gap-3 mt-4 mb-5 p-3 bg-slate-50/80 rounded-xl border border-slate-100/60">
              <div className="flex-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Engagement over time</div>
                <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
                  {prospect.events.map((ev, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full"
                      style={{
                        background: isConversion(ev.type)
                          ? '#7c3aed'
                          : ev.type === 'email_open'
                            ? '#10b981'
                            : ev.scroll && ev.scroll >= 80
                              ? '#334155'
                              : ev.scroll && ev.scroll >= 50
                                ? '#94a3b8'
                                : '#cbd5e1',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="border-l border-slate-200 pl-3 flex gap-4">
                <div className="text-center">
                  <div className="stat-number text-lg text-slate-900">
                    {prospect.events.filter((e) => e.type === 'page_view').length}
                  </div>
                  <div className="text-[10px] text-slate-400">Views</div>
                </div>
                <div className="text-center">
                  <div className="stat-number text-lg text-brand-600">
                    {prospect.events.filter((e) => isConversion(e.type)).length}
                  </div>
                  <div className="text-[10px] text-slate-400">Actions</div>
                </div>
              </div>
            </div>

            {/* Session-grouped timeline */}
            <div className="space-y-2">
              {timelineSessions.map((session, si) => (
                <div key={si}>
                  {si > 0 && (
                    <TimelineGap
                      fromTime={timelineSessions[si - 1].label}
                      toTime={session.label}
                      hasEnquiry={hasEnquiry}
                    />
                  )}
                  <SessionGroup session={session} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
