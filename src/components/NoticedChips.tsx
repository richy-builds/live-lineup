import type { DescribeAnswers } from '../../shared/api.ts'

const CHIPS: { key: keyof DescribeAnswers; label: string }[] = [
  { key: 'hair', label: 'hair' },
  { key: 'eyewear', label: 'eyewear' },
  { key: 'headwear', label: 'headwear' },
  { key: 'clothing', label: 'clothing' },
  { key: 'accessory', label: 'accessory' },
]

/** Speculative Nouls asked in the same call as the match. Lit when p(yes) >= 0.6. */
export function NoticedChips({ answers }: { answers: DescribeAnswers | null }) {
  const contradictory = answers ? answers.contradictory.noul >= 0.6 : false
  return (
    <div className="chips" aria-label="What Jev noticed in your description">
      <span className="chips__label">Jev noticed</span>
      {CHIPS.map(({ key, label }) => {
        const a = answers?.[key]
        const p = a && a.type === 'noul' ? a.noul : 0
        return (
          <span key={key} className={`chip ${p >= 0.6 ? 'chip--on' : ''}`} title={`p(yes) = ${p.toFixed(2)}`}>
            {label}
          </span>
        )
      })}
      <span className={`chip chip--warn ${contradictory ? 'chip--on' : ''}`} title={`p(contradictory) = ${(answers?.contradictory.noul ?? 0).toFixed(2)}`}>
        contradictory
      </span>
    </div>
  )
}
