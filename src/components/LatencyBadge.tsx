interface Props {
  latencyMs: number | null
  pending: boolean
  tokens?: number
}

export function LatencyBadge({ latencyMs, pending, tokens }: Props) {
  return (
    <div className={`latency ${pending ? 'latency--pending' : ''}`}>
      <span className="latency__dot" />
      {latencyMs === null ? 'waiting for input' : `Jev answered in ${latencyMs} ms`}
      {tokens !== undefined && latencyMs !== null && <span className="latency__tokens"> · {tokens} tokens</span>}
    </div>
  )
}
