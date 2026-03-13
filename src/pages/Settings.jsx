import { useState } from 'react'
import { motion } from 'framer-motion'

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
        on ? 'bg-brand-600' : 'bg-slate-200'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
          on ? 'translate-x-[22px]' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function Settings({ onToast }) {
  const [alerts, setAlerts] = useState({ immediate: true, daily: true, weekly: false })
  const [ga4, setGa4] = useState('G-8K4MN2PLX1')
  const [emails, setEmails] = useState(
    'amanda@alleyns.org.uk\njames@alleyns.org.uk'
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 max-w-2xl"
    >
      <div>
        <h1 className="font-display text-3xl text-slate-900 italic">Settings</h1>
        <p className="text-slate-500 mt-1">Configure your EnrolIQ account</p>
      </div>

      {/* Alert Preferences */}
      <div className="bg-white rounded-2xl border border-slate-100/60 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-0.5">Alert Preferences</h3>
        <p className="text-xs text-slate-400 mb-5">
          Choose when you receive prospect notifications
        </p>
        <div className="space-y-4">
          {[
            {
              k: 'immediate',
              l: 'Immediate Alerts',
              d: 'Email when a prospect reaches Hot status (80+)',
            },
            {
              k: 'daily',
              l: 'Daily Digest',
              d: 'Top 5 prospects to contact, delivered at 8:00am',
            },
            {
              k: 'weekly',
              l: 'Weekly Summary',
              d: 'Pipeline overview every Monday morning',
            },
          ].map((a) => (
            <div key={a.k} className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-bold text-slate-700">{a.l}</div>
                <div className="text-xs text-slate-400 mt-0.5">{a.d}</div>
              </div>
              <Toggle
                on={alerts[a.k]}
                onToggle={() => setAlerts((prev) => ({ ...prev, [a.k]: !prev[a.k] }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* GA4 Connection */}
      <div className="bg-white rounded-2xl border border-slate-100/60 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-0.5">Google Analytics 4 Connection</h3>
        <p className="text-xs text-slate-400 mb-4">
          Enrich prospect profiles with acquisition and traffic data
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={ga4}
            onChange={(e) => setGa4(e.target.value)}
            className="flex-1 text-sm bg-slate-50/80 border border-slate-200/60 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all font-mono"
            placeholder="G-XXXXXXXXXX"
          />
          <button
            onClick={() => onToast?.('GA4 property connected')}
            className="bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm cursor-pointer active:scale-[0.97]"
          >
            Connect
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-500">
            Connected to <strong className="font-mono">{ga4}</strong>
          </span>
        </div>
      </div>

      {/* Team Emails */}
      <div className="bg-white rounded-2xl border border-slate-100/60 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-0.5">Team Alert Emails</h3>
        <p className="text-xs text-slate-400 mb-4">
          One email per line. All alerts will be delivered to these addresses.
        </p>
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="w-full text-sm bg-slate-50/80 border border-slate-200/60 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none font-mono transition-all"
          rows={3}
        />
        <button
          onClick={() => onToast?.('Team emails saved')}
          className="mt-3 bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm cursor-pointer active:scale-[0.97]"
        >
          Save
        </button>
      </div>

      {/* Tracking Script */}
      <div className="bg-white rounded-2xl border border-slate-100/60 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-0.5">Tracking Script</h3>
        <p className="text-xs text-slate-400 mb-4">
          Add this snippet to the &lt;head&gt; of your school website
        </p>
        <div className="bg-slate-950 rounded-xl p-5 overflow-x-auto">
          <pre className="text-[13px] text-brand-300 leading-relaxed font-mono">
{`<script
  src="https://app.enroliq.io/track.js"
  data-school-id="ALS-8K4MN2PLX1"
  async>
</script>`}
          </pre>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(
              '<script src="https://app.enroliq.io/track.js" data-school-id="ALS-8K4MN2PLX1" async></script>'
            )
            onToast?.('Copied to clipboard')
          }}
          className="mt-3 text-xs bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/60"
        >
          Copy to Clipboard
        </button>
      </div>
    </motion.div>
  )
}
