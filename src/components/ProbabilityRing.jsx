function getColor(probability) {
  if (probability >= 70) return '#10B981'
  if (probability >= 40) return '#F59E0B'
  return '#94A3B8'
}

export default function ProbabilityRing({ probability, confidence, size = 96 }) {
  const color = getColor(probability)
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (probability / 100) * circ
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
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-extrabold leading-none"
          style={{ fontSize: size * 0.24, color }}
        >
          {probability}%
        </span>
        <span className="text-slate-400 font-medium" style={{ fontSize: size * 0.1 }}>
          likely
        </span>
      </div>
    </div>
  )
}
