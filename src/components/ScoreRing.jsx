import { getBand } from '../lib/utils'

export default function ScoreRing({ score, band, size = 96 }) {
  const b = getBand(band)
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const c = size / 2

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="#F1F5F9" strokeWidth="7" />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={b.color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="anim-score-ring"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-extrabold leading-none"
          style={{ fontSize: size * 0.28, color: b.color }}
        >
          {score}
        </span>
        <span className="text-slate-400 font-medium" style={{ fontSize: size * 0.11 }}>
          / 100
        </span>
      </div>
    </div>
  )
}
