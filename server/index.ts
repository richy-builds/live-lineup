import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { describe, interrogate, questionSpecs, MissingKeyError } from './jev.ts'
import { createRound, getRound, endRound } from './rounds.ts'
import { suspectById } from '../shared/suspects.ts'

const app = express()
app.use(cors())
app.use(express.json())

const MAX_QUESTIONS = 10

app.get('/api/spec', (_req, res) => {
  res.json(questionSpecs())
})

app.post('/api/describe', async (req, res, next) => {
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.slice(0, 500) : ''
    const { result, latencyMs } = await describe(text)
    console.log(`describe  ${latencyMs}ms  top=${result.answers.match.choice} (${result.answers.match.probabilities[result.answers.match.choice].toFixed(2)})  "${text}"`)
    res.json({ answers: result.answers, latencyMs, usage: result.usage, model: result.model })
  } catch (err) {
    next(err)
  }
})

app.post('/api/round', (_req, res) => {
  res.json({ roundId: createRound(), maxQuestions: MAX_QUESTIONS })
})

app.post('/api/interrogate', async (req, res, next) => {
  try {
    const { roundId, question } = req.body ?? {}
    const round = typeof roundId === 'string' ? getRound(roundId) : undefined
    if (!round) return res.status(404).json({ error: 'Unknown or expired round. Start a new one.' })
    if (typeof question !== 'string' || !question.trim()) return res.status(400).json({ error: 'Ask a question.' })
    if (round.questionsAsked >= MAX_QUESTIONS) return res.status(400).json({ error: 'No questions left. Make your accusation.' })
    const secret = suspectById(round.secretId)!
    const { result, latencyMs } = await interrogate(secret.profile, question.slice(0, 300))
    round.questionsAsked += 1
    console.log(`interrogate ${latencyMs}ms  p=${result.answers.answer.noul.toFixed(2)}  "${question}"`)
    res.json({ probability: result.answers.answer.noul, latencyMs, usage: result.usage, model: result.model, questionsAsked: round.questionsAsked, questionsLeft: MAX_QUESTIONS - round.questionsAsked })
  } catch (err) {
    next(err)
  }
})

app.post('/api/accuse', (req, res) => {
  const { roundId, suspectId } = req.body ?? {}
  const round = typeof roundId === 'string' ? getRound(roundId) : undefined
  if (!round) return res.status(404).json({ error: 'Unknown or expired round. Start a new one.' })
  endRound(roundId)
  res.json({ correct: suspectId === round.secretId, secretId: round.secretId, questionsAsked: round.questionsAsked })
})

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof MissingKeyError) return res.status(500).json({ error: err.message, code: 'missing_key' })
  const message = err instanceof Error ? err.message : 'Unknown error'
  console.error(err)
  res.status(502).json({ error: `Jev request failed: ${message}` })
})

const PORT = Number(process.env.PORT ?? 8787)
app.listen(PORT, () => {
  console.log(`Live Lineup server on http://localhost:${PORT}  key=${process.env.TYPESAFE_API_KEY ? 'set' : 'MISSING'}`)
})
