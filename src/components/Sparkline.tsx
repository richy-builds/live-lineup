interface Props {
  values: number[]
  threshold?: number
}

/** Target probability after each keystroke. */
export function Sparkline({ values, threshold = 0.9 }: Props) {
  const w = 320
  const h = 80
  const pad = 4
  if (values.length === 0) return null
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0
  const y = (v: number) => h - pad - v * (h - pad * 2)
  const points = values.map((v, i) => `${pad + i * step},${y(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark" role="img" aria-label="Probability of the target after each keystroke">
      <line x1={pad} x2={w - pad} y1={y(threshold)} y2={y(threshold)} className="spark__threshold" />
      <polyline points={points} className="spark__line" />
      <circle cx={pad + (values.length - 1) * step} cy={y(values[values.length - 1]!)} r="3" className="spark__dot" />
    </svg>
  )
}
