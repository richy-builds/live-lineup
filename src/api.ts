import type { AccuseResponse, DescribeResponse, InterrogateResponse, RoundResponse, SpecResponse } from '../shared/api.ts'

export class RequestError extends Error {
  code?: string
  constructor(message: string, code?: string) {
    super(message)
    this.code = code
  }
}

async function post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new RequestError(data.error ?? `Request failed (${res.status})`, data.code)
  return data as T
}

export const api = {
  spec: async () => {
    const res = await fetch('/api/spec')
    if (!res.ok) throw new RequestError(`Could not load question spec (${res.status})`)
    return (await res.json()) as SpecResponse
  },
  describe: (text: string, signal?: AbortSignal) => post<DescribeResponse>('/api/describe', { text }, signal),
  round: () => post<RoundResponse>('/api/round', {}),
  interrogate: (roundId: string, question: string) => post<InterrogateResponse>('/api/interrogate', { roundId, question }),
  accuse: (roundId: string, suspectId: string) => post<AccuseResponse>('/api/accuse', { roundId, suspectId }),
}
