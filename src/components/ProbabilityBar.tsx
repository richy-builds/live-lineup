interface Props {
  value: number
  leader?: boolean
  label?: string
}

export function ProbabilityBar({ value, leader = false, label }: Props) {
  const pct = Math.round(value * 100)
  return (
    <div className={`bar ${leader ? 'bar--leader' : ''}`} role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="bar__fill" style={{ width: `${Math.max(1, value * 100)}%` }} />
      <span className="bar__pct">{pct}%</span>
    </div>
  )
}
