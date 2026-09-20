import { useEffect, useState } from 'react'
import { api } from '../api.ts'
import type { SpecResponse } from '../../shared/api.ts'

let cached: SpecResponse | null = null

/** Loads the exact question objects the server sends to Jev, once per page. */
export function useSpec(): SpecResponse | null {
  const [spec, setSpec] = useState<SpecResponse | null>(cached)
  useEffect(() => {
    if (cached) return
    api.spec().then((s) => { cached = s; setSpec(s) }).catch(() => {})
  }, [])
  return spec
}
