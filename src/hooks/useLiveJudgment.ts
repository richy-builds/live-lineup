import { useEffect, useRef, useState } from 'react'
import { api, RequestError } from '../api.ts'
import type { DescribeResponse } from '../../shared/api.ts'

export interface LiveJudgment {
  data: DescribeResponse | null
  /** Increments on every fresh answer; lets callers react to each new response. */
  version: number
  pending: boolean
  error: RequestError | null
}

const DEBOUNCE_MS = 120

/**
 * Re-judges `text` on every change: debounced, in-flight request aborted,
 * stale responses dropped by sequence number. Empty text clears the result.
 */
export function useLiveJudgment(text: string, enabled: boolean): LiveJudgment {
  const [state, setState] = useState<LiveJudgment>({ data: null, version: 0, pending: false, error: null })
  const seq = useRef(0)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!enabled) return
    const trimmed = text.trim()
    if (!trimmed) {
      controller.current?.abort()
      seq.current += 1
      setState((s) => ({ ...s, data: null, pending: false }))
      return
    }
    const mySeq = ++seq.current
    const timer = setTimeout(async () => {
      controller.current?.abort()
      const ac = new AbortController()
      controller.current = ac
      setState((s) => ({ ...s, pending: true }))
      try {
        const data = await api.describe(trimmed, ac.signal)
        if (mySeq !== seq.current) return // a newer keystroke already superseded this
        setState((s) => ({ data, version: s.version + 1, pending: false, error: null }))
      } catch (err) {
        if (ac.signal.aborted || mySeq !== seq.current) return
        setState((s) => ({ ...s, pending: false, error: err instanceof RequestError ? err : new RequestError(String(err)) }))
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [text, enabled])

  return state
}
