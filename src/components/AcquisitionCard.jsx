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

export default function AcquisitionCard({ ga4 }) {
  if (!ga4) return null

  const channel = getChannel(ga4.medium)
  const ChannelIcon = channel.icon
  const DeviceIcon = DEVICE_ICON[ga4.device] || Monitor

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
              {ga4.source}{ga4.medium !== '(none)' ? ` / ${ga4.medium}` : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <img
            src="https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg"
            alt="GA4"
            className="w-4 h-4 opacity-50"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GA4</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Campaign (if present) */}
        {ga4.campaign && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50/60 rounded-xl border border-amber-100">
            <Megaphone size={12} className="text-amber-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">Campaign</span>
              <div className="text-xs font-semibold text-amber-800 font-mono truncate">
                {ga4.campaign}
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics — 2x3 grid */}
        <div className="grid grid-cols-2 gap-4">
          <MetricBlock
            icon={BarChart3}
            label="GA Sessions"
            value={ga4.gaSessions}
            sub={`avg. ${ga4.avgSessionDuration}`}
          />
          <MetricBlock
            icon={DeviceIcon}
            label="Device"
            value={ga4.device.charAt(0).toUpperCase() + ga4.device.slice(1)}
            sub={ga4.browser}
          />
          <MetricBlock
            icon={ExternalLink}
            label="Landing Page"
            value={ga4.landingPage}
          />
          <MetricBlock
            icon={MapPin}
            label="Location"
            value={ga4.city || '—'}
            sub={ga4.region || null}
          />
          <MetricBlock
            icon={CalendarDays}
            label="First Seen"
            value={ga4.firstSeen}
          />
        </div>

        {/* Session bar visual */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Session Engagement
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{ga4.gaSessions} sessions</span>
          </div>
          <div className="flex gap-[3px]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i < ga4.gaSessions ? channel.barColor : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sync status */}
        <div className="flex items-center gap-1.5 pt-1">
          <RefreshCw size={10} className="text-slate-300" />
          <span className="text-[10px] text-slate-400">
            Last synced {ga4.lastSynced}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto" />
          <span className="text-[10px] text-emerald-500 font-medium">Connected</span>
        </div>
      </div>
    </div>
  )
}
