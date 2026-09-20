import { SUSPECTS, NONE_ID } from '../../shared/suspects.ts'
import { SuspectCard } from './SuspectCard.tsx'

interface Props {
  probabilities?: Record<string, number> | null
  leaderId?: string | null
  statuses?: Record<string, 'target' | 'wrong' | 'revealed'>
  onSelect?: (id: string) => void
  disabled?: boolean
}

export function SuspectGrid({ probabilities, leaderId, statuses = {}, onSelect, disabled }: Props) {
  const showBars = probabilities !== undefined
  return (
    <div>
      <div className="grid">
        {SUSPECTS.map((s) => (
          <SuspectCard
            key={s.id}
            suspect={s}
            probability={showBars ? probabilities?.[s.id] ?? 0 : undefined}
            leader={leaderId === s.id}
            status={statuses[s.id] ?? null}
            onSelect={onSelect}
            disabled={disabled}
          />
        ))}
      </div>
      {showBars && (
        <div className={`none-row ${leaderId === NONE_ID ? 'none-row--leader' : ''}`}>
          <span>Nobody in the lineup</span>
          <span className="none-row__pct">{Math.round((probabilities?.[NONE_ID] ?? 0) * 100)}%</span>
        </div>
      )}
    </div>
  )
}
