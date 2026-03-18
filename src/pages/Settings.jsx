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
  const [posthogKey, setPosthogKey] = useState('')
  const [posthogProjectId, setPosthogProjectId] = useState('')
  const [posthogStatus, setPosthogStatus] = useState('disconnected') // 'disconnected' | 'checking' | 'connected' | 'error'
  const [hubspot, setHubspot] = useState({ connected: true, portalId: '44281937', lastSync: '12 mins ago' })
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

      {/* PostHog Connection */}
      <div className="bg-white rounded-2xl border border-slate-100/60 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-bold text-slate-900">PostHog Connection</h3>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-wider">
            Analytics
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Connect PostHog for visitor tracking, identity stitching, and prospect scoring
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">API Key</label>
            <input
              type="text"
              value={posthogKey}
              onChange={(e) => setPosthogKey(e.target.value)}
              className="w-full text-sm bg-slate-50/80 border border-slate-200/60 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all font-mono"
              placeholder="phc_xxxxxxxxxxxxxxxxxxxx"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">Project ID</label>
            <input
              type="text"
              value={posthogProjectId}
              onChange={(e) => setPosthogProjectId(e.target.value)}
              className="w-full text-sm bg-slate-50/80 border border-slate-200/60 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all font-mono"
              placeholder="12345"
            />
          </div>
          <button
            onClick={() => {
              setPosthogStatus('checking')
              fetch('/api/health')
                .then((r) => r.json())
                .then((d) => {
                  setPosthogStatus(d.posthog_connected ? 'connected' : 'error')
                  onToast?.(d.posthog_connected ? 'PostHog connected' : 'PostHog connection failed — check credentials')
                })
                .catch(() => {
                  setPosthogStatus('error')
                  onToast?.('Backend unreachable — running in demo mode')
                })
            }}
            className="bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm cursor-pointer active:scale-[0.97]"
          >
            {posthogStatus === 'checking' ? 'Checking...' : 'Test Connection'}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className={`w-2 h-2 rounded-full ${
            posthogStatus === 'connected' ? 'bg-emerald-400 animate-pulse'
            : posthogStatus === 'error' ? 'bg-red-400'
            : 'bg-slate-300'
          }`} />
          <span className="text-xs text-slate-500">
            {posthogStatus === 'connected' ? 'Connected to PostHog'
              : posthogStatus === 'error' ? 'Connection failed'
              : posthogStatus === 'checking' ? 'Checking...'
              : 'Not connected — using demo data'}
          </span>
        </div>
      </div>

      {/* HubSpot CRM Connection */}
      <div className="bg-white rounded-2xl border border-slate-100/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-0.5">
          <h3 className="text-sm font-bold text-slate-900">HubSpot CRM</h3>
          {hubspot.connected && (
            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 uppercase tracking-wider">
              Pro
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Connect HubSpot to unlock Revenue Intelligence, enrolment probability, and closed-loop campaign attribution
        </p>

        {hubspot.connected ? (
          <>
            {/* Connected state */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-600 font-semibold">Connected</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Portal ID</div>
                  <div className="text-sm font-mono font-bold text-slate-800">{hubspot.portalId}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Last Sync</div>
                  <div className="text-sm font-semibold text-slate-800">{hubspot.lastSync}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Sync Status</div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Contacts', count: 247, ok: true },
                    { label: 'Deals', count: 89, ok: true },
                    { label: 'Historical Outcomes (3 years)', count: 156, ok: true },
                    { label: 'Communications', count: 1420, ok: true },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-xs text-slate-600">{s.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{s.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deal Stage Mapping */}
            <div className="mt-4">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5">Deal Stage Mapping</div>
              <div className="bg-slate-50/80 rounded-xl border border-slate-100/60 overflow-hidden">
                {[
                  { hubspot: 'Enquiry', enroliq: 'Active — Interested', color: 'bg-blue-400' },
                  { hubspot: 'Tour Booked', enroliq: 'Active — Warm', color: 'bg-amber-400' },
                  { hubspot: 'Tour Attended', enroliq: 'Active — Warm', color: 'bg-amber-400' },
                  { hubspot: 'Application Submitted', enroliq: 'Active — Hot', color: 'bg-red-400' },
                  { hubspot: 'Offer Made', enroliq: 'Active — Hot', color: 'bg-red-400' },
                  { hubspot: 'Enrolled', enroliq: 'Enrolled', color: 'bg-emerald-400' },
                  { hubspot: 'Lost', enroliq: 'Lost', color: 'bg-slate-400' },
                ].map((m, i, arr) => (
                  <div
                    key={m.hubspot}
                    className={`flex items-center px-4 py-2.5 ${i < arr.length - 1 ? 'border-b border-slate-100/60' : ''}`}
                  >
                    <span className="text-xs font-medium text-slate-600 w-[160px]">{m.hubspot}</span>
                    <span className="text-slate-300 text-xs px-3">&rarr;</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${m.color}`} />
                      <span className="text-xs font-semibold text-slate-700">{m.enroliq}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => onToast?.('HubSpot sync triggered')}
                className="text-xs bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm cursor-pointer active:scale-[0.97]"
              >
                Sync Now
              </button>
              <button
                onClick={() => {
                  setHubspot({ connected: false, portalId: '', lastSync: '' })
                  onToast?.('HubSpot disconnected')
                }}
                className="text-xs bg-white text-red-600 font-bold px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all cursor-pointer border border-red-200/60"
              >
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Disconnected state */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-dashed border-slate-200 text-center">
              <div className="text-2xl mb-2">&#128279;</div>
              <div className="text-sm font-bold text-slate-700 mb-1">Connect your HubSpot account</div>
              <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                Authorise EnrolIQ to read your contacts, deals, and communications. We'll automatically map deal stages and import historical outcomes.
              </p>
              <button
                onClick={() => {
                  setHubspot({ connected: true, portalId: '44281937', lastSync: 'Just now' })
                  onToast?.('HubSpot connected successfully')
                }}
                className="bg-[#FF7A59] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#e86c4f] transition-all shadow-sm cursor-pointer active:scale-[0.97]"
              >
                Connect with HubSpot
              </button>
            </div>
          </>
        )}
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
  src="https://app.enrolliq.com/track.js"
  data-school-id="ALS-8K4MN2PLX1"
  data-api-key="phc_xxx"
  async>
</script>`}
          </pre>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(
              '<script src="https://app.enrolliq.com/track.js" data-school-id="ALS-8K4MN2PLX1" data-api-key="phc_xxx" async></script>'
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
