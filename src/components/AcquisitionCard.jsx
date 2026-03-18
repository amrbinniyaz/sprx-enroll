import {
  Globe,
  Search,
  Megaphone,
  Share2,
  Link2,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  BarChart3,
  ExternalLink,
  RefreshCw,
  CalendarDays,
  MapPin,
} from 'lucide-react'

const CHANNEL_CONFIG = {
  organic: {
    label: 'Organic Search',
    icon: Search,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    barColor: 'bg-emerald-500',
  },
  cpc: {
    label: 'Paid Search',
    icon: Megaphone,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    barColor: 'bg-amber-500',
  },
  social: {
    label: 'Social Media',
    icon: Share2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    barColor: 'bg-blue-500',
  },
  referral: {
    label: 'Referral',
    icon: Link2,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    barColor: 'bg-violet-500',
  },
  '(none)': {
    label: 'Direct',
    icon: Globe,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    barColor: 'bg-slate-500',
  },
}

const DEVICE_ICON = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

function getChannel(medium) {
  return CHANNEL_CONFIG[medium] || CHANNEL_CONFIG['(none)']
}

function MetricBlock({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-slate-400" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          {label}
        </div>
        <div className="text-[13px] font-semibold text-slate-800 mt-0.5 truncate">{value}</div>
        {sub && <div className="text-[11px] text-slate-400 mt-0.5 truncate">{sub}</div>}
      </div>
    </div>
  )
}

export default function AcquisitionCard({ ga4, posthog }) {
  const data = ga4 || posthog
  if (!data) return null

  // Normalize field names — PostHog uses snake_case, mock data uses camelCase
  const medium = data.medium || data.initial_medium || '(none)'
  const source = data.source || data.initial_source || 'Direct'
  const campaign = data.campaign || data.initial_campaign || null
  const landingPage = data.landingPage || data.landing_page || '/'
  const device = data.device || data.device_type || 'desktop'
  const browser = data.browser || data.browser_name || ''
  const gaSessions = data.gaSessions || data.session_count || 0
  const avgSessionDuration = data.avgSessionDuration || data.avg_session_duration || '—'
  const city = data.city || data.geoip_city_name || '—'
  const region = data.region || data.geoip_region || null
  const firstSeen = data.firstSeen || data.first_seen || '—'
  const lastSynced = data.lastSynced || data.last_synced || '—'

  const channel = getChannel(medium)
  const ChannelIcon = channel.icon
  const DeviceIcon = DEVICE_ICON[device] || Monitor

  return (
    <div className="bg-white rounded-2xl border border-slate-100/60 shadow-sm overflow-hidden">
      {/* Header — Channel banner */}
      <div className={`px-5 py-3.5 ${channel.bg} border-b ${channel.border} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center shadow-sm`}>
            <ChannelIcon size={14} className={channel.color} />
          </div>
          <div>
            <div className={`text-xs font-bold ${channel.color}`}>{channel.label}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {source}{medium !== '(none)' ? ` / ${medium}` : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{posthog ? 'PostHog' : 'GA4'}</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Campaign (if present) */}
        {campaign && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50/60 rounded-xl border border-amber-100">
            <Megaphone size={12} className="text-amber-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">Campaign</span>
              <div className="text-xs font-semibold text-amber-800 font-mono truncate">
                {campaign}
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics — 2x3 grid */}
        <div className="grid grid-cols-2 gap-4">
          <MetricBlock
            icon={BarChart3}
            label="Sessions"
            value={gaSessions}
            sub={`avg. ${avgSessionDuration}`}
          />
          <MetricBlock
            icon={DeviceIcon}
            label="Device"
            value={device.charAt(0).toUpperCase() + device.slice(1)}
            sub={browser}
          />
          <MetricBlock
            icon={ExternalLink}
            label="Landing Page"
            value={landingPage}
          />
          <MetricBlock
            icon={MapPin}
            label="Location"
            value={city}
            sub={region}
          />
          <MetricBlock
            icon={CalendarDays}
            label="First Seen"
            value={firstSeen}
          />
        </div>

        {/* Session bar visual */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Session Engagement
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{gaSessions} sessions</span>
          </div>
          <div className="flex gap-[3px]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i < gaSessions ? channel.barColor : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sync status */}
        <div className="flex items-center gap-1.5 pt-1">
          <RefreshCw size={10} className="text-slate-300" />
          <span className="text-[10px] text-slate-400">
            Last synced {lastSynced}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto" />
          <span className="text-[10px] text-emerald-500 font-medium">Connected</span>
        </div>
      </div>
    </div>
  )
}
