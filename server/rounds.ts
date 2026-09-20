import { randomUUID } from 'node:crypto'
import { SUSPECTS } from '../shared/suspects.ts'

interface Round {
  secretId: string
  questionsAsked: number
  createdAt: number
}

const rounds = new Map<string, Round>()
const TTL_MS = 60 * 60 * 1000

function sweep() {
  const cutoff = Date.now() - TTL_MS
  for (const [id, r] of rounds) if (r.createdAt < cutoff) rounds.delete(id)
}

export function createRound(): string {
  sweep()
  const id = randomUUID()
  const secret = SUSPECTS[Math.floor(Math.random() * SUSPECTS.length)]!
  rounds.set(id, { secretId: secret.id, questionsAsked: 0, createdAt: Date.now() })
  return id
}

export function getRound(id: string): Round | undefined {
  return rounds.get(id)
}

export function endRound(id: string): void {
  rounds.delete(id)
}
