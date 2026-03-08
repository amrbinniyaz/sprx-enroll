import { getPattern } from '../lib/utils'

export default function PatternPill({ pattern }) {
  const p = getPattern(pattern)
  if (!p) return null
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${p.pill}`}
    >
      {p.label}
    </span>
  )
}
