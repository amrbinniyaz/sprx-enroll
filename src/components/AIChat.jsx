import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowRight,
  Flame,
  Users,
  TrendingUp,
  Search,
  Zap,
} from 'lucide-react'
import { PROSPECTS } from '../data/prospects'
import { getBand } from '../lib/utils'

/* ── Suggested quick prompts ── */
const SUGGESTIONS = [
  { text: 'Who should I call today?', icon: Flame },
  { text: 'Show me hot prospects', icon: TrendingUp },
  { text: 'Pipeline summary', icon: Users },
  { text: 'Who is going cold?', icon: Zap },
  { text: 'Best campaign right now?', icon: Search },
  { text: 'Which families came from Google Ads?', icon: Search },
]

/* ── AI response engine — queries real prospect data ── */
function generateResponse(query) {
  const q = query.toLowerCase()

  const hot = PROSPECTS.filter((p) => p.band === 'hot')
  const warm = PROSPECTS.filter((p) => p.band === 'warm')
  const cold = PROSPECTS.filter((p) => p.band === 'cold')
  const goingCold = PROSPECTS.filter((p) => p.pattern === 'going_cold')
  const silentStalkers = PROSPECTS.filter((p) => p.pattern === 'silent_stalker')
  const feeCheckers = PROSPECTS.filter((p) => p.pattern === 'fee_checker')
  const sorted = [...PROSPECTS].sort((a, b) => b.score - a.score)
  const avg = Math.round(PROSPECTS.reduce((s, p) => s + p.score, 0) / PROSPECTS.length)

  // Who should I call / contact / priority
  if (q.includes('call') || q.includes('contact') || q.includes('priority') || q.includes('reach out')) {
    const top3 = sorted.slice(0, 3)
    return {
      text: `Based on current engagement scores, here are your top priorities today:`,
      prospects: top3.map((p, i) => ({
        id: p.id,
        rank: i + 1,
        name: p.name,
        score: p.score,
        band: p.band,
        reason:
          i === 0
            ? `Highest score (${p.score}) — ${p.pattern === 'ready_family' ? 'showing all buying signals' : 'peak engagement window'}`
            : i === 1
            ? `${p.pattern === 'fee_checker' ? 'Checked fees 3x this week — budget sensitive, needs personal touch' : `Score of ${p.score} — strong interest, conversion window open`}`
            : `Score trending at ${p.score} — ${p.visits} visits in ${p.createdAt}`,
      })),
      footer: `I'd recommend starting with ${top3[0].name} — their engagement is at its highest point. A personal call from the Head could be the deciding factor.`,
    }
  }

  // Hot prospects
  if (q.includes('hot')) {
    return {
      text: `You have ${hot.length} hot prospect${hot.length !== 1 ? 's' : ''} right now:`,
      prospects: hot.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: p.aiSummary.split('.').slice(0, 2).join('.') + '.',
      })),
      footer:
        hot.length > 0
          ? `${hot[0].name} at ${hot[0].score} is your highest priority. Don't let this one go — the conversion window is narrow.`
          : 'No hot prospects at the moment. Focus on warming up your interested leads.',
    }
  }

  // Warm prospects
  if (q.includes('warm')) {
    return {
      text: `You have ${warm.length} warm prospect${warm.length !== 1 ? 's' : ''} in your pipeline:`,
      prospects: warm.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: `Score: ${p.score} — ${p.childName} for ${p.yearGroup}, ${p.yearOfEntry}. ${p.visits} visits over ${p.createdAt}.`,
      })),
      footer: `${warm.filter((p) => p.score >= 75).length} of these are close to tipping into Hot. A well-timed open house invite could push them over.`,
    }
  }

  // Going cold / cold / inactive
  if (q.includes('cold') || q.includes('inactive') || q.includes('losing') || q.includes('risk')) {
    const atRisk = [...goingCold, ...cold.filter((p) => !goingCold.includes(p))]
    return {
      text: `${atRisk.length} prospect${atRisk.length !== 1 ? 's are' : ' is'} at risk of going cold:`,
      prospects: atRisk.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: `Last seen ${p.lastSeen}. ${p.pattern === 'going_cold' ? 'Score is actively declining — was previously warm.' : 'Low engagement, needs re-activation.'} Previously enquired for ${p.childName} (${p.yearGroup}).`,
      })),
      footer: `Urgent: Send a personal email from the Head with a specific hook — a private tour invitation or upcoming event. Generic nurture emails won't work at this stage.`,
    }
  }

  // Silent stalkers
  if (q.includes('stalker') || q.includes('silent') || q.includes('not enquired') || q.includes('no enquiry')) {
    return {
      text: `${silentStalkers.length} silent stalker${silentStalkers.length !== 1 ? 's' : ''} detected — high engagement but no enquiry:`,
      prospects: silentStalkers.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: `${p.visits} visits over ${p.createdAt} but hasn't submitted an enquiry. Viewed ${p.events.filter((e) => e.type === 'page_view').length} pages including fees. Something is holding them back.`,
      })),
      footer: `Strategy: Trigger a live chat prompt on their next visit, or run a targeted remarketing ad with an open house invitation. These families are interested — they just need a nudge.`,
    }
  }

  // Fee checkers
  if (q.includes('fee') || q.includes('price') || q.includes('cost') || q.includes('budget')) {
    return {
      text: `${feeCheckers.length} prospect${feeCheckers.length !== 1 ? 's are' : ' is'} showing fee-checking behavior:`,
      prospects: feeCheckers.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: `Visited the fees page ${p.events.filter((e) => e.title?.includes('Fees')).length}x. This suggests strong interest but possible budget sensitivity.`,
      })),
      footer: `Recommended approach: Lead with your bursary programme and flexible payment options. Don't wait for them to ask — proactively address affordability in your next conversation.`,
    }
  }

  // Pipeline summary / overview / stats
  if (q.includes('pipeline') || q.includes('summary') || q.includes('overview') || q.includes('stats') || q.includes('how are we doing')) {
    return {
      text: `Here's your pipeline snapshot:`,
      stats: [
        { label: 'Total Prospects', value: PROSPECTS.length },
        { label: 'Hot', value: hot.length, color: 'text-red-500' },
        { label: 'Warm', value: warm.length, color: 'text-amber-500' },
        { label: 'Interested', value: PROSPECTS.filter((p) => p.band === 'interested').length, color: 'text-blue-500' },
        { label: 'Cold', value: cold.length, color: 'text-slate-400' },
        { label: 'Avg. Score', value: avg, color: 'text-brand-600' },
      ],
      footer: `Your pipeline is healthy. ${hot.length} hot prospects need immediate attention today. ${warm.filter((p) => p.score >= 75).length} warm prospects are close to tipping hot — focus your open house invites there.`,
    }
  }

  // Campaign / Google Ads / source
  if (q.includes('campaign') || q.includes('google ad') || q.includes('paid') || q.includes('cpc') || q.includes('ad spend') || q.includes('ads')) {
    const fromAds = PROSPECTS.filter((p) => p.ga4?.medium === 'cpc')
    return {
      text: `${fromAds.length} prospect${fromAds.length !== 1 ? 's' : ''} came from paid search (Google Ads):`,
      prospects: fromAds.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: `Campaign: "${p.ga4.campaign}" — landed on ${p.ga4.landingPage}. ${p.ga4.gaSessions} sessions, avg. ${p.ga4.avgSessionDuration}. Currently ${p.band} (${p.score}).`,
      })),
      footer: fromAds.length > 0
        ? `Your "${fromAds[0].ga4.campaign}" campaign is generating real prospects. ${fromAds.filter((p) => p.band === 'hot' || p.band === 'warm').length} of ${fromAds.length} are warm or hot — that's a strong conversion signal.`
        : 'No paid search prospects found.',
    }
  }

  // Social media / facebook
  if (q.includes('social') || q.includes('facebook') || q.includes('instagram')) {
    const fromSocial = PROSPECTS.filter((p) => p.ga4?.medium === 'social')
    return {
      text: `${fromSocial.length} prospect${fromSocial.length !== 1 ? 's' : ''} came from social media:`,
      prospects: fromSocial.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: `Source: ${p.ga4.source} via "${p.ga4.campaign}" campaign. ${p.ga4.gaSessions} sessions from ${p.ga4.city}. Score: ${p.score}.`,
      })),
      footer: fromSocial.length > 0
        ? `Social is bringing in engaged prospects. ${fromSocial[0].name} came through your "${fromSocial[0].ga4.campaign}" campaign and is now ${fromSocial[0].band}.`
        : 'No social media prospects found.',
    }
  }

  // Referral
  if (q.includes('referral') || q.includes('referred')) {
    const fromReferral = PROSPECTS.filter((p) => p.ga4?.medium === 'referral')
    return {
      text: `${fromReferral.length} prospect${fromReferral.length !== 1 ? 's' : ''} came from referrals:`,
      prospects: fromReferral.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: `Referred from ${p.ga4.source}. ${p.notes || `${p.visits} visits, score ${p.score}.`}`,
      })),
      footer: `Referral prospects typically convert at 2x the rate of other channels. Prioritize personal outreach and leverage the referring family connection.`,
    }
  }

  // Specific prospect by name
  const nameMatch = PROSPECTS.find((p) => q.includes(p.name.toLowerCase().split(' ')[0].toLowerCase()) || q.includes(p.name.toLowerCase()))
  if (nameMatch) {
    return {
      text: `Here's what I know about ${nameMatch.name}:`,
      prospects: [
        {
          id: nameMatch.id,
          name: nameMatch.name,
          score: nameMatch.score,
          band: nameMatch.band,
          reason: nameMatch.aiSummary,
        },
      ],
      stats: [
        { label: 'Child', value: nameMatch.childName },
        { label: 'Year Group', value: nameMatch.yearGroup },
        { label: 'Entry', value: nameMatch.yearOfEntry },
        { label: 'Visits', value: nameMatch.visits },
        { label: 'Source', value: nameMatch.source },
        { label: 'Last Seen', value: nameMatch.lastSeen },
      ],
      footer: null,
    }
  }

  // Year group
  if (q.includes('year 7') || q.includes('year 8') || q.includes('year 9') || q.includes('year 10')) {
    const yearMatch = q.match(/year\s*(\d+)/i)
    const yearGroup = yearMatch ? `Year ${yearMatch[1]}` : null
    if (yearGroup) {
      const inYear = PROSPECTS.filter((p) => p.yearGroup === yearGroup)
      return {
        text: `${inYear.length} prospect${inYear.length !== 1 ? 's' : ''} for ${yearGroup} entry:`,
        prospects: inYear.map((p) => ({
          id: p.id,
          name: p.name,
          score: p.score,
          band: p.band,
          reason: `${p.childName} — ${p.band} (${p.score}). Source: ${p.source}. Last seen ${p.lastSeen}.`,
        })),
        footer: inYear.length > 0
          ? `Top priority for ${yearGroup}: ${inYear.sort((a, b) => b.score - a.score)[0].name} with a score of ${inYear.sort((a, b) => b.score - a.score)[0].score}.`
          : `No prospects found for ${yearGroup}.`,
      }
    }
  }

  // Top / best / highest
  if (q.includes('top') || q.includes('best') || q.includes('highest')) {
    const top5 = sorted.slice(0, 5)
    return {
      text: `Your top 5 prospects by engagement score:`,
      prospects: top5.map((p, i) => ({
        id: p.id,
        rank: i + 1,
        name: p.name,
        score: p.score,
        band: p.band,
        reason: `${p.childName} (${p.yearGroup}) — ${p.visits} visits, source: ${p.source}. Last seen ${p.lastSeen}.`,
      })),
      footer: `${top5[0].name} leads your pipeline at ${top5[0].score}. ${top5.filter((p) => p.band === 'hot').length} of these 5 are in the hot zone.`,
    }
  }

  // Help / what can you do
  if (q.includes('help') || q.includes('what can') || q.includes('how do')) {
    return {
      text: `I can help you with:`,
      bullets: [
        '"Who should I call today?" — Get prioritized call list',
        '"Show me hot prospects" — See your most engaged families',
        '"Pipeline summary" — Quick overview of your funnel',
        '"Who is going cold?" — Families at risk of dropping off',
        '"Best campaign right now?" — Campaign performance insights',
        '"Tell me about [name]" — Deep dive on any prospect',
        '"Which families came from Google Ads?" — Source analysis',
        '"Show me Year 7 prospects" — Filter by year group',
      ],
      footer: `Just type naturally — I understand context and can query your entire pipeline in real-time.`,
    }
  }

  // Fallback
  return {
    text: `I can help you explore your admissions pipeline. Try asking me:`,
    bullets: [
      '"Who should I call today?"',
      '"Show me hot prospects"',
      '"Pipeline summary"',
      '"Who is going cold?"',
      '"Tell me about David Chen"',
    ],
    footer: `I have real-time access to all ${PROSPECTS.length} prospects, their scores, behaviors, and campaign data.`,
  }
}

/* ── Typing dots animation ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-400"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400 ml-2">Sprx AI is thinking...</span>
    </div>
  )
}

/* ── Prospect card inside chat ── */
function ProspectCard({ prospect, onNavigate }) {
  const bc = getBand(prospect.band)
  return (
    <div
      onClick={() => onNavigate(prospect.id)}
      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 border border-slate-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
    >
      {prospect.rank && (
        <span className="text-xs font-bold text-slate-300 w-4 text-center">{prospect.rank}</span>
      )}
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br from-brand-500 to-violet-500 flex-shrink-0">
        {prospect.name
          .split(' ')
          .map((w) => w[0])
          .join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800">{prospect.name}</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{ color: bc.color, background: bc.bg }}
          >
            {prospect.score}
          </span>
        </div>
        {prospect.reason && (
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
            {prospect.reason}
          </p>
        )}
      </div>
      <ArrowRight
        size={12}
        className="text-slate-300 group-hover:text-brand-500 transition-colors flex-shrink-0"
      />
    </div>
  )
}

/* ── Main AIChat component ── */
export default function AIChat() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: {
        text: "Hi Amanda! I'm your Sprx AI assistant. I have real-time access to your entire admissions pipeline. Ask me anything — who to call, pipeline stats, campaign performance, or details about any prospect.",
        footer: null,
      },
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function handleSend(text) {
    const query = text || input.trim()
    if (!query) return

    setMessages((prev) => [...prev, { role: 'user', content: query }])
    setInput('')
    setTyping(true)

    // Simulate AI thinking delay
    const delay = 600 + Math.random() * 800
    setTimeout(() => {
      const response = generateResponse(query)
      setMessages((prev) => [...prev, { role: 'ai', content: response }])
      setTyping(false)
    }, delay)
  }

  function handleNavigate(id) {
    navigate(`/prospects/${id}`)
    setOpen(false)
  }

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-xl shadow-brand-500/30 flex items-center justify-center hover:shadow-2xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all z-50 cursor-pointer group"
          >
            <Sparkles size={22} className="group-hover:rotate-12 transition-transform" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-2xl bg-brand-500/30 animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200/80 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-brand-600 via-brand-500 to-violet-500 flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">Sprx AI</div>
                <div className="text-white/60 text-[11px] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Analysing {PROSPECTS.length} prospects in real-time
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              {messages.map((msg, i) =>
                msg.role === 'user' ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-brand-600 text-white text-[13px] px-4 py-2.5 rounded-2xl rounded-br-md max-w-[85%] font-medium shadow-sm">
                      {msg.content}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {/* AI icon */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
                        <Sparkles size={10} className="text-white" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Sprx AI
                      </span>
                    </div>

                    {/* Main text */}
                    <div className="bg-slate-50 rounded-2xl rounded-tl-md px-4 py-3 max-w-[95%]">
                      <p className="text-[13px] text-slate-700 leading-relaxed">
                        {msg.content.text}
                      </p>

                      {/* Stats grid */}
                      {msg.content.stats && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {msg.content.stats.map((s, j) => (
                            <div
                              key={j}
                              className="bg-white rounded-lg px-2.5 py-2 border border-slate-100"
                            >
                              <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                                {s.label}
                              </div>
                              <div
                                className={`text-sm font-extrabold mt-0.5 ${
                                  s.color || 'text-slate-800'
                                }`}
                              >
                                {s.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Prospect cards */}
                      {msg.content.prospects && (
                        <div className="mt-3 space-y-2">
                          {msg.content.prospects.map((p) => (
                            <ProspectCard
                              key={p.id}
                              prospect={p}
                              onNavigate={handleNavigate}
                            />
                          ))}
                        </div>
                      )}

                      {/* Bullet list */}
                      {msg.content.bullets && (
                        <ul className="mt-3 space-y-1.5">
                          {msg.content.bullets.map((b, j) => (
                            <li
                              key={j}
                              className="text-[12px] text-slate-600 flex items-start gap-2"
                            >
                              <span className="text-brand-500 mt-0.5 flex-shrink-0">
                                <Zap size={10} />
                              </span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Footer insight */}
                      {msg.content.footer && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-start gap-2">
                            <Sparkles
                              size={11}
                              className="text-brand-500 flex-shrink-0 mt-0.5"
                            />
                            <p className="text-[12px] text-brand-700 leading-relaxed font-medium">
                              {msg.content.footer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              )}

              {typing && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (only show when few messages) */}
            {messages.length <= 2 && !typing && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.slice(0, 4).map((s) => (
                  <button
                    key={s.text}
                    onClick={() => handleSend(s.text)}
                    className="text-[11px] font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer border border-brand-100"
                  >
                    <s.icon size={10} />
                    {s.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all"
              >
                <MessageSquare size={14} className="text-slate-300 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your pipeline..."
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send size={12} className="text-white" />
                </button>
              </form>
              <div className="text-[10px] text-slate-400 text-center mt-2">
                Powered by Sprx AI — intelligent admissions assistant for schools
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
