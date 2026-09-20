import { TypeSafeClient, choice, noul, type SystemOneResult, type Questions } from '@typesafe-ai/sdk'
import { SUSPECTS, NONE_ID } from '../shared/suspects.ts'

export class MissingKeyError extends Error {
  constructor() {
    super('TYPESAFE_API_KEY is not set. Copy .env.example to .env and add a key from https://console.typesafe.ai/keys')
  }
}

let client: TypeSafeClient | null = null
function getClient(): TypeSafeClient {
  if (!process.env.TYPESAFE_API_KEY) throw new MissingKeyError()
  client ??= new TypeSafeClient()
  return client
}

/** Run a System One request and time the round-trip. */
async function timed<Q extends Questions>(state: Parameters<TypeSafeClient['systemOne']>[0]['state'], questions: Q) {
  const started = performance.now()
  const result: SystemOneResult<Q> = await getClient().systemOne({ state, questions })
  return { result, latencyMs: Math.round(performance.now() - started) }
}

export const MODEL = 'jev-latest'

/** The exact question objects, so the UI can show what Jev is asked. */
export function questionSpecs() {
  return { model: MODEL, describe: describeQuestions, interrogate: interrogateQuestions }
}

/**
 * Mode A. One call, many questions: a Choice over every suspect (profiles as
 * the option descriptions) plus speculative Nouls about what the description
 * covers. They run in parallel inside Jev and come back together.
 */
const suspectCriteria = Object.fromEntries([
  ...SUSPECTS.map((s) => [s.id, s.profile]),
  [NONE_ID, 'The description is empty, nonsense, or does not fit any of the suspects listed.'],
])

export const describeQuestions = {
  match: choice(
    'A witness is describing a person from the lineup. Which suspect best matches the witness description in `description`? Judge by appearance: hair, facial hair, eyewear, headwear, clothing colour, accessories, skin tone.',
    suspectCriteria,
  ),
  hair: noul('The witness description in `description` mentions the person\'s hair (style, length, colour, or baldness).'),
  eyewear: noul('The witness description in `description` mentions glasses, spectacles, shades, a monocle, or the absence of eyewear.'),
  headwear: noul('The witness description in `description` mentions a hat, cap, beret, beanie or other headwear, or says the person is bare-headed.'),
  clothing: noul('The witness description in `description` mentions a coat, jacket or other clothing, or its colour.'),
  accessory: noul('The witness description in `description` mentions an accessory such as a scarf, tie, bow tie, jewellery, pipe, headphones, or a flower.'),
  contradictory: noul('The witness description in `description` contradicts itself or combines features that no single person in the lineup could have.'),
}

export type DescribeAnswers = SystemOneResult<typeof describeQuestions>['answers']

export async function describe(description: string) {
  return timed({ description }, describeQuestions)
}

/**
 * Mode B. A single Noul: does the secret suspect's profile answer the
 * player's yes/no question in the affirmative?
 */
export const interrogateQuestions = {
  answer: noul(
    'A detective is asking a yes/no question about the person described in `suspect`. Is the correct answer yes? If the profile gives no information either way, the answer is genuinely uncertain.',
  ),
}

export async function interrogate(profile: string, question: string) {
  return timed({ suspect: profile, question }, interrogateQuestions)
}
