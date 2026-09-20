import { useEffect, useState } from 'react'
import type { AnyAnswer, QuestionSpec } from '../../shared/api.ts'

export interface CallLogEntry {
  id: number
  label: string
  latencyMs: number
  tokens: number
  summary: string
}

interface Props {
  title?: string
  model: string | null
  state: Record<string, unknown> | null
  questions: Record<string, QuestionSpec> | null
  answers: Record<string, AnyAnswer> | null
  latencyMs: number | null
  usage: { input_tokens: number; output_tokens: number } | null
  version: number
  log: CallLogEntry[]
}

function instructionText(v: unknown): string {
  return typeof v === 'string' ? v : JSON.stringify(v)
}

/**
 * The round trip, shown live: what the server sends to Jev, what comes back,
 * and a timeline of recent calls.
 */
export function InsideJev({ title = 'Inside the call', model, state, questions, answers, latencyMs, usage, version, log }: Props) {
  const [open, setOpen] = useState(true)
  const [raw, setRaw] = useState(false)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (version === 0) return
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 350)
    return () => clearTimeout(t)
  }, [version])

  const choice = answers ? Object.values(answers).find((a) => a.type === 'choice') : undefined
  const maxLatency = Math.max(1, ...log.map((l) => l.latencyMs))
  const totalTokens = log.reduce((n, l) => n + l.tokens, 0)
  const avgLatency = log.length ? Math.round(log.reduce((n, l) => n + l.latencyMs, 0) / log.length) : 0

  return (
    <section className={`inside ${open ? '' : 'inside--closed'}`}>
      <header className="inside__head">
        <button type="button" className="inside__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="inside__caret">{open ? '▾' : '▸'}</span> {title}
        </button>
        <span className="inside__meta">
          {model ? <code>POST /v1/systemone · model {model}</code> : <code>POST /v1/systemone</code>}
        </span>
        <label className="inside__raw">
          <input type="checkbox" checked={raw} onChange={(e) => setRaw(e.target.checked)} /> raw JSON
        </label>
      </header>

      {open && (
        <div className="inside__cols">
          {/* ---- request ---- */}
          <div className="inside__col">
            <div className="inside__label">
              <span className="pill pill--send">sent</span> state + {questions ? Object.keys(questions).length : 0} questions, one request
            </div>
            {raw ? (
              <pre className="json">{JSON.stringify({ model, state, questions }, null, 2)}</pre>
            ) : (
              <>
                <div className="kv">
                  <span className="kv__k">state</span>
                  <pre className="json json--inline">{state ? JSON.stringify(state, null, 2) : '—'}</pre>
                </div>
                <ol className="qlist">
                  {questions &&
                    Object.entries(questions).map(([id, q]) => (
                      <li key={id} className="q">
                        <div className="q__head">
                          <span className={`pill pill--${q.type}`}>{q.type}</span>
                          <code className="q__id">{id}</code>
                        </div>
                        <div className="q__text">{instructionText(q.instructions)}</div>
                        {q.type === 'choice' && (
                          <details className="q__criteria" open>
                            <summary>{Object.keys(q.criteria).length} options, each described by its profile</summary>
                            <ul>
                              {Object.entries(q.criteria)
                                .map(([opt, desc]) => ({ opt, desc, p: choice?.type === 'choice' ? choice.probabilities[opt] ?? 0 : 0 }))
                                .sort((a, b) => b.p - a.p)
                                .map(({ opt, desc, p }) => (
                                  <li key={opt} className={`opt ${choice?.type === 'choice' && choice.choice === opt ? 'opt--top' : ''}`}>
                                    <div className="opt__row">
                                      <code>{opt}</code>
                                      <span className="opt__bar"><span style={{ width: `${p * 100}%` }} /></span>
                                      <span className="opt__p">{(p * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="opt__desc">{instructionText(desc)}</div>
                                  </li>
                                ))}
                            </ul>
                          </details>
                        )}
                      </li>
                    ))}
                </ol>
              </>
            )}
          </div>

          {/* ---- response ---- */}
          <div className={`inside__col ${flash ? 'inside__col--flash' : ''}`}>
            <div className="inside__label">
              <span className="pill pill--recv">returned</span>
              {latencyMs !== null ? (
                <>
                  {latencyMs} ms · {usage ? `${usage.input_tokens} in / ${usage.output_tokens} out tokens` : ''}
                </>
              ) : (
                'nothing yet'
              )}
            </div>
            {raw ? (
              <pre className="json">{answers ? JSON.stringify({ model, answers, usage }, null, 2) : '—'}</pre>
            ) : (
              <ul className="alist">
                {answers &&
                  Object.entries(answers).map(([id, a]) => (
                    <li key={id} className="a">
                      <div className="a__head">
                        <code className="q__id">{id}</code>
                        {a.type === 'choice' ? (
                          <span className="a__val">
                            → <strong>{a.choice}</strong> <span className="a__conf">confidence {a.confidence.toFixed(2)}</span>
                          </span>
                        ) : (
                          <span className="a__val">
                            p(yes) = <strong>{a.noul.toFixed(2)}</strong>
                          </span>
                        )}
                      </div>
                      {a.type === 'noul' ? (
                        <div className="nbar">
                          <span className="nbar__fill" style={{ width: `${a.noul * 100}%` }} />
                          <span className="nbar__mid" />
                        </div>
                      ) : (
                        <div className="dist">
                          {Object.entries(a.probabilities)
                            .sort((x, y) => y[1] - x[1])
                            .slice(0, 5)
                            .map(([opt, p]) => (
                              <div key={opt} className="dist__row">
                                <code>{opt}</code>
                                <span className="opt__bar"><span style={{ width: `${p * 100}%` }} /></span>
                                <span className="opt__p">{(p * 100).toFixed(1)}%</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </li>
                  ))}
                {!answers && <li className="inside__empty">Type something and the answer lands here.</li>}
              </ul>
            )}
          </div>

          {/* ---- timeline ---- */}
          <div className="inside__col">
            <div className="inside__label">
              <span className="pill pill--log">timeline</span>
              {log.length ? `${log.length} calls · avg ${avgLatency} ms · ${totalTokens} tokens` : 'no calls yet'}
            </div>
            <ol className="tl">
              {[...log].reverse().map((e) => (
                <li key={e.id} className="tl__row">
                  <span className="tl__text" title={e.label}>{e.label}</span>
                  <span className="tl__bar"><span style={{ width: `${(e.latencyMs / maxLatency) * 100}%` }} /></span>
                  <span className="tl__ms">{e.latencyMs} ms</span>
                  <span className="tl__sum">{e.summary}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}
