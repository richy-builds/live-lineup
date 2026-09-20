import { useEffect, useMemo, useRef, useState } from 'react'
import { SUSPECTS, NONE_ID, suspectById, type Suspect } from '../../shared/suspects.ts'
import { useLiveJudgment } from '../hooks/useLiveJudgment.ts'
import { Avatar } from './Avatar.tsx'
import { SuspectGrid } from './SuspectGrid.tsx'
import { NoticedChips } from './NoticedChips.tsx'
import { LatencyBadge } from './LatencyBadge.tsx'
import { ResultPanel } from './ResultPanel.tsx'
import { recordScore } from '../bestScores.ts'
import { InsideJev, type CallLogEntry } from './InsideJev.tsx'
import { useSpec } from '../hooks/useSpec.ts'

const LOCK_THRESHOLD = 0.9
const LOCK_STREAK = 2

interface Outcome {
  correct: boolean
  lockedId: string
  score: number
  chars: number
  seconds: number
}

function pickTarget(avoid?: string): Suspect {
  const pool = SUSPECTS.filter((s) => s.id !== avoid)
  return pool[Math.floor(Math.random() * pool.length)]!
}

export function DescribeMode({ onBest }: { onBest: (best: number) => void }) {
  const [target, setTarget] = useState<Suspect>(() => pickTarget())
  // `?q=...` prefills the description, handy for demos and screenshots.
  const [text, setText] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [history, setHistory] = useState<number[]>([])
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [log, setLog] = useState<CallLogEntry[]>([])
  const streak = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const spec = useSpec()

  const playing = outcome === null
  const { data, version, pending, error } = useLiveJudgment(text, playing)
  const answers = data?.answers ?? null
  const probabilities = answers?.match.probabilities ?? null
  const leaderId = answers?.match.choice ?? null

  // React to each fresh answer: extend the history and check the lock rule.
  useEffect(() => {
    if (!playing || !answers || !data) return
    const pTarget = answers.match.probabilities[target.id] ?? 0
    setHistory((h) => [...h, pTarget])
    const top = answers.match.choice
    const pTop = answers.match.probabilities[top] ?? 0
    setLog((l) => [
      ...l.slice(-29),
      { id: version, label: text.trim(), latencyMs: data.latencyMs, tokens: data.usage.input_tokens + data.usage.output_tokens, summary: `→ ${top} ${(pTop * 100).toFixed(0)}%` },
    ])
    if (top !== NONE_ID && pTop >= LOCK_THRESHOLD) streak.current += 1
    else streak.current = 0
    if (streak.current >= LOCK_STREAK) {
      const seconds = startedAt ? (performance.now() - startedAt) / 1000 : 0
      const chars = text.trim().length
      const correct = top === target.id
      const score = correct ? Math.max(0, Math.round(1000 - 10 * chars - 5 * seconds)) : 0
      setOutcome({ correct, lockedId: top, score, chars, seconds })
      if (score > 0) onBest(recordScore('describe', score))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  function onChange(value: string) {
    if (startedAt === null && value.trim()) setStartedAt(performance.now())
    if (!value.trim()) {
      setHistory([])
      streak.current = 0
      setStartedAt(null)
    }
    setText(value)
  }

  function next() {
    setTarget((t) => pickTarget(t.id))
    setText('')
    setStartedAt(null)
    setHistory([])
    setOutcome(null)
    streak.current = 0
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const statuses = useMemo(() => {
    if (!outcome) return {}
    const s: Record<string, 'target' | 'wrong' | 'revealed'> = { [target.id]: 'target' }
    if (!outcome.correct) s[outcome.lockedId] = 'wrong'
    return s
  }, [outcome, target.id])

  return (
    <>
    <div className="mode">
      <aside className="panel">
        <h2 className="panel__title">Describe this suspect</h2>
        <p className="panel__hint">
          Jev only sees your words and twelve written profiles. Every keystroke asks it one Choice question over all twelve, plus six yes/no questions, in a single call.
        </p>
        <div className="portrait">
          <Avatar traits={target.traits} size={150} />
        </div>
        <input
          ref={inputRef}
          className="input"
          type="text"
          placeholder="e.g. the one in the green scarf with round glasses…"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          disabled={!playing}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <LatencyBadge latencyMs={data?.latencyMs ?? null} pending={pending} tokens={data ? data.usage.input_tokens + data.usage.output_tokens : undefined} />
        <NoticedChips answers={answers} />
        {error && <div className={`error ${error.code === 'missing_key' ? 'error--key' : ''}`}>{error.message}</div>}
        {outcome && (
          <ResultPanel
            correct={outcome.correct}
            target={target}
            locked={suspectById(outcome.lockedId) ?? null}
            score={outcome.score}
            chars={outcome.chars}
            seconds={outcome.seconds}
            history={history}
            onNext={next}
          />
        )}
        {playing && (
          <p className="panel__rule">
            Locks in when one suspect holds ≥ {Math.round(LOCK_THRESHOLD * 100)}% for {LOCK_STREAK} answers in a row. Fewer characters, higher score.
          </p>
        )}
      </aside>
      <section className="lineup">
        <SuspectGrid probabilities={probabilities} leaderId={leaderId} statuses={statuses} />
      </section>
    </div>
    <InsideJev
      model={data?.model ?? spec?.model ?? null}
      state={text.trim() ? { description: text.trim() } : null}
      questions={spec?.describe ?? null}
      answers={answers ? { ...answers } : null}
      latencyMs={data?.latencyMs ?? null}
      usage={data?.usage ?? null}
      version={version}
      log={log}
    />
    </>
  )
}
