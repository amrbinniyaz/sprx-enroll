import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
}

export const BAND_CONFIG = {
  hot: {
    label: 'Hot',
    emoji: '\uD83D\uDD25',
    color: '#EF4444',
    bg: '#FEF2F2',
    text: '#991B1B',
    pill: 'bg-red-50 text-red-700 border-red-200',
    ringColor: 'stroke-red-500',
  },
  warm: {
    label: 'Warm',
    emoji: '\u26A1',
    color: '#F59E0B',
    bg: '#FFFBEB',
    text: '#92400E',
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
    ringColor: 'stroke-amber-500',
  },
  interested: {
    label: 'Interested',
    emoji: '\uD83D\uDC40',
    color: '#3B82F6',
    bg: '#EFF6FF',
    text: '#1E40AF',
    pill: 'bg-blue-50 text-blue-700 border-blue-200',
    ringColor: 'stroke-blue-500',
  },
  cold: {
    label: 'Cold',
    emoji: '\u2744\uFE0F',
    color: '#94A3B8',
    bg: '#F8FAFC',
    text: '#475569',
    pill: 'bg-slate-100 text-slate-600 border-slate-200',
    ringColor: 'stroke-slate-400',
  },
}

export const PATTERN_CONFIG = {
  fee_checker: {
    label: 'Fee Checker',
    pill: 'bg-orange-50 text-orange-700 border-orange-200',
    tip: 'Visited fees page 3+ times',
  },
  silent_stalker: {
    label: 'Silent Stalker',
    pill: 'bg-violet-50 text-violet-700 border-violet-200',
    tip: '5+ visits, no enquiry yet',
  },
  ready_family: {
    label: 'Ready Family',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tip: 'Enquired + prospectus + open day',
  },
  going_cold: {
    label: 'Going Cold',
    pill: 'bg-slate-100 text-slate-600 border-slate-300',
    tip: 'Score decaying 14+ days',
  },
}

export function getBand(band) {
  return BAND_CONFIG[band] || BAND_CONFIG.cold
}

export function getPattern(pattern) {
  return pattern ? PATTERN_CONFIG[pattern] : null
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-cyan-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
]

export function avatarGradient(name) {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[idx]
}
