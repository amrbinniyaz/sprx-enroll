import { getBand, cn } from '../lib/utils'

export default function BandPill({ band, size = 'sm' }) {
  const b = getBand(band)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border',
        b.pill,
        size === 'lg' ? 'px-3 py-1 text-sm font-semibold' : 'px-2 py-0.5 text-xs font-medium'
      )}
    >
      {b.emoji} {b.label}
    </span>
  )
}
