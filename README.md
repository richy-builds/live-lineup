# Live Lineup

A small local game that shows off **Jev**, TypeSafe's System One model: typed
judgments with calibrated probabilities in ~150 ms, many questions per call, and
no generated text. Twelve suspects, one witness, and Jev decides who you mean
while you are still typing.

## Run it

```sh
cp .env.example .env      # paste a key from https://console.typesafe.ai/keys
npm install
npm run dev               # web on http://localhost:5173, API proxy on :8787
```

The API key stays on the Node server. The browser only talks to `/api/*`.

## How to play

**Describe.** You see a portrait. Type a description in your own words. On every
keystroke the probability bars across the lineup move. When one suspect holds
90% or more for two answers in a row, the round locks. Fewer characters and
less time mean a higher score.

**Interrogate.** Jev holds a secret suspect. Ask yes/no questions in free text.
Each answer shows the raw probability, so you can see when Jev is genuinely
unsure. Click a suspect to accuse. Fewer questions mean a higher score.

## Inside the call

Under the lineup, the **Inside the call** panel shows the round trip live on
every keystroke:

- **Sent**: the `state` object and the seven question objects exactly as the
  server passes them to the SDK, including all thirteen Choice options with
  each suspect's profile and its current probability.
- **Returned**: the selected option with its confidence, the top of the
  probability distribution, and every Noul's p(yes) on a no-to-yes bar.
- **Timeline**: recent calls with latency and token counts.

Tick **raw JSON** to see the literal request and response bodies. In
Interrogate mode the same panel shows the last question, with the secret
profile redacted until you accuse.

Add `?q=some description` to the URL to start a Describe round with text
already typed, which is handy for demos.

## What Jev is doing on each screen

| On screen | Jev primitive | Where |
| --- | --- | --- |
| Probability bars on the twelve cards | one **Choice** over 13 options (12 suspects + "nobody"), each suspect's prose profile as the option description | `server/jev.ts` `describeQuestions.match` |
| "Jev noticed" chips (hair, eyewear, headwear, clothing, accessory, contradictory) | six speculative **Noul** questions sent in the *same call* as the Choice | `server/jev.ts` |
| Latency badge | wall-clock round trip of that one call, measured on the server | `server/jev.ts` `timed()` |
| Interrogation answers with Yes / No / Unsure | one **Noul** per question; the UI thresholds p(yes) at 0.8 and 0.2 | `server/jev.ts` `interrogate()` |
| Lock-in, scoring, best scores | plain code; Jev supplies judgments, the game owns the rules | `src/components/DescribeMode.tsx` |

The profiles in `shared/suspects.ts` are written with different vocabulary from
the avatar traits ("moss muffler, wire spectacles" for a green scarf and round
glasses) so that the match is a genuine language-understanding step rather than
keyword overlap.

## Layout

```
shared/suspects.ts   roster: traits (draw the avatar) + prose profile (what Jev reads)
shared/api.ts        wire types
server/              Express on :8787, holds the key, four routes
src/                 Vite + React, no router, vanilla CSS
```

Client-side, `src/hooks/useLiveJudgment.ts` debounces keystrokes by 120 ms,
aborts the in-flight request, and drops stale responses by sequence number, so
the bars only ever reflect the latest text.
