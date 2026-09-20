/** Wire types shared by server and client (mirrors the SDK answer shapes). */
export interface ChoiceAnswer {
  type: 'choice'
  choice: string
  confidence: number
  probabilities: Record<string, number>
}
export interface NoulAnswer {
  type: 'noul'
  noul: number
}
export interface DescribeAnswers {
  match: ChoiceAnswer
  hair: NoulAnswer
  eyewear: NoulAnswer
  headwear: NoulAnswer
  clothing: NoulAnswer
  accessory: NoulAnswer
  contradictory: NoulAnswer
}
export interface DescribeResponse {
  answers: DescribeAnswers
  latencyMs: number
  usage: { input_tokens: number; output_tokens: number }
  model: string
}

/** The question objects exactly as the server sends them to Jev. */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
export interface ChoiceSpec {
  type: 'choice'
  instructions?: JsonValue
  criteria: Record<string, JsonValue>
}
export interface NoulSpec {
  type: 'noul'
  instructions?: JsonValue
  criteria?: { true?: JsonValue; false?: JsonValue } | null
}
export type QuestionSpec = ChoiceSpec | NoulSpec
export interface SpecResponse {
  model: string
  describe: Record<string, QuestionSpec>
  interrogate: Record<string, QuestionSpec>
}
export type AnyAnswer = ChoiceAnswer | NoulAnswer
export interface RoundResponse {
  roundId: string
  maxQuestions: number
}
export interface InterrogateResponse {
  probability: number
  latencyMs: number
  usage: { input_tokens: number; output_tokens: number }
  model: string
  questionsAsked: number
  questionsLeft: number
}
export interface AccuseResponse {
  correct: boolean
  secretId: string
  questionsAsked: number
}
export interface ApiError {
  error: string
  code?: string
}
