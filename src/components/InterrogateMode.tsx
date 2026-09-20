import { useEffect, useRef, useState } from 'react'
import { suspectById } from '../../shared/suspects.ts'
import { api, RequestError } from '../api.ts'
import { SuspectGrid } from './SuspectGrid.tsx'
import { recordScore } from '../bestScores.ts'
import { InsideJev, type CallLogEntry } from './InsideJev.tsx'
import { useSpec } from '../hooks/useSpec.ts'
import type { InterrogateResponse } from '../../shared/api.ts'

interface Entry {
  question: string
  probability: number
  latencyMs: number
}

interface Verdict {
  correct: boolean
  secretId: string
  accusedId: string
  score: number
}

function verdictFor(p: number): { label: string; cls: string } {
  if (p >= 0.8) return { label: 'Yes', cls: 'yes' }
  if (p <= 0.2) return { label: 'No', cls: 'no' }
  return { label: 'Unsure', cls: 'unsure' }
}

export function InterrogateMode({ onBest }: { onBest: (best: number) => void }) {
  const [roundId, setRoundId] = useState<string | null>(null)
  const [maxQuestions, setMaxQuestions] = useState(10)
  const [log, setLog] = useState<Entry[]>([])
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<RequestError | null>(null)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mounted = useRef(false)
  const spec = useSpec()
  const [last, setLast] = useState<{ question: string; res: InterrogateResponse } | null>(null)
  const [callLog, setCallLog] = useState<CallLogEntry[]>([])

  async function startRound() {
    setLog([])
    setLast(null)
    setQuestion('')
    setVerdict(null)
    setError(null)
    setRoundId(null)
    try {
      const r = await api.round()
      setRoundId(r.roundId)
      setMaxQuestions(r.maxQuestions)
      setTimeout(() => inputRef.current?.focus(), 0)
    } catch (err) {
      setError(err instanceof RequestError ? err : new RequestError(String(err)))
    }
  }

  useEffect(() => {
    if (mounted.current) return // StrictMode runs effects twice in dev; one round is enough
    mounted.current = true
    void startRound()
  }, [])

  const questionsLeft = maxQuestions - log.length
  const canAsk = roundId !== null && !busy && !verdict && questionsLeft > 0

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    const q = question.trim()
    if (!canAsk || !q) return
    setBusy(true)
    setError(null)
    try {
      const r = await api.interrogate(roundId!, q)
      setLog((l) => [...l, { question: q, probability: r.probability, latencyMs: r.latencyMs }])
      setLast({ question: q, res: r })
      setCallLog((l) => [
        ...l.slice(-29),
        { id: Date.now(), label: q, latencyMs: r.latencyMs, tokens: r.usage.input_tokens + r.usage.output_tokens, summary: `p(yes) = ${r.probability.toFixed(2)} → ${verdictFor(r.probability).label}` },
      ])
      setQuestion('')
    } catch (err) {
      setError(err instanceof RequestError ? err : new RequestError(String(err)))
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  async function accuse(suspectId: string) {
    if (!roundId || verdict || busy) return
    setBusy(true)
    try {
      const r = await api.accuse(roundId, suspectId)
      const score = r.correct ? Math.max(0, 1000 - 90 * r.questionsAsked) : 0
      setVerdict({ correct: r.correct, secretId: r.secretId, accusedId: suspectId, score })
      if (score > 0) onBest(recordScore('interrogate', score))
    } catch (err) {
      setError(err instanceof RequestError ? err : new RequestError(String(err)))
    } finally {
      setBusy(false)
    }
  }

  const statuses: Record<string, 'target' | 'wrong' | 'revealed'> = {}
  if (verdict) {
    statuses[verdict.secretId] = 'target'
    if (!verdict.correct) statuses[verdict.accusedId] = 'wrong'
  }

  const secretProfile = verdict ? suspectById(verdict.secretId)?.profile : undefined
  const insideState = last
    ? { suspect: secretProfile ?? '«the secret suspect\'s profile — hidden until you accuse»', question: last.question }
    : null

  return (
    <>
    <div className="mode">
      <aside className="panel">
        <h2 className="panel__title">Interrogate Jev</h2>
        <p className="panel__hint">
          Jev is holding one suspect's profile. Ask yes/no questions in your own words. Each one is a single Noul question, and the raw probability is shown so you can see when Jev genuinely doesn't know.
        </p>
        <form className="ask" onSubmit={ask}>
          <input
            ref={inputRef}
            className="input"
            type="text"
            placeholder={verdict ? 'Round over' : 'Does the suspect wear glasses?'}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!canAsk}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="btn" disabled={!canAsk || !question.trim()}>
            Ask
          </button>
        </form>
        <div className="counter">
          {verdict ? 'Case closed.' : `${questionsLeft} of ${maxQuestions} questions left · click a suspect to accuse`}
        </div>
        {error && <div className={`error ${error.code === 'missing_key' ? 'error--key' : ''}`}>{error.message}</div>}
        <ol className="log">
          {log.map((e, i) => {
            const v = verdictFor(e.probability)
            return (
              <li key={i} className={`log__item log__item--${v.cls}`}>
                <div className="log__q">{e.question}</div>
                <div className="log__a">
                  <span className="log__verdict">{v.label}</span>
                  <span className="log__bar"><span style={{ width: `${e.probability * 100}%` }} /></span>
                  <span className="log__p">p(yes) {e.probability.toFixed(2)}</span>
                  <span className="log__ms">{e.latencyMs} ms</span>
                </div>
              </li>
            )
          })}
        </ol>
        {verdict && (
          <div className={`result ${verdict.correct ? 'result--good' : 'result--bad'}`}>
            <div className="result__headline">
              {verdict.correct ? <>It was <strong>{suspectById(verdict.secretId)?.name}</strong>. Nailed it.</> : <>Wrong. It was <strong>{suspectById(verdict.secretId)?.name}</strong>.</>}
            </div>
            <div className="result__stats">
              <div><span className="stat__n">{verdict.score}</span><span className="stat__l">score</span></div>
              <div><span className="stat__n">{log.length}</span><span className="stat__l">questions</span></div>
            </div>
            <button type="button" className="btn btn--primary" onClick={startRound} autoFocus>
              New round
            </button>
          </div>
        )}
      </aside>
      <section className="lineup">
        <SuspectGrid statuses={statuses} onSelect={verdict ? undefined : accuse} disabled={!roundId || busy} />
      </section>
    </div>
    <InsideJev
      title="Inside the call (last question)"
      model={last?.res.model ?? spec?.model ?? null}
      state={insideState}
      questions={spec?.interrogate ?? null}
      answers={last ? { answer: { type: 'noul', noul: last.res.probability } } : null}
      latencyMs={last?.res.latencyMs ?? null}
      usage={last?.res.usage ?? null}
      version={log.length}
      log={callLog}
    />
    </>
  )
}
