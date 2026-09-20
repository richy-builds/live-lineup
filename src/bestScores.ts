export type Mode = 'describe' | 'interrogate'

const key = (mode: Mode) => `live-lineup.best.${mode}`

export function readBest(mode: Mode): number {
  try {
    return Number(localStorage.getItem(key(mode)) ?? 0) || 0
  } catch {
    return 0
  }
}

/** Stores the score if it beats the current best; returns the new best. */
export function recordScore(mode: Mode, score: number): number {
  const best = Math.max(readBest(mode), score)
  try {
    localStorage.setItem(key(mode), String(best))
  } catch {
    /* storage unavailable: best is per-session only */
  }
  return best
}
