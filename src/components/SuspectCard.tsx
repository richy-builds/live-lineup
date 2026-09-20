import type { Suspect } from '../../shared/suspects.ts'
import { Avatar } from './Avatar.tsx'
import { ProbabilityBar } from './ProbabilityBar.tsx'

interface Props {
  suspect: Suspect
  probability?: number
  leader?: boolean
  status?: 'target' | 'wrong' | 'revealed' | null
  onSelect?: (id: string) => void
  disabled?: boolean
}

export function SuspectCard({ suspect, probability, leader, status, onSelect, disabled }: Props) {
  const classes = ['card', leader && 'card--leader', status && `card--${status}`, onSelect && 'card--clickable']
    .filter(Boolean)
    .join(' ')
  const inner = (
    <>
      <Avatar traits={suspect.traits} size={72} className="card__avatar" />
      <div className="card__name">{suspect.name}</div>
      <div className="card__job">{suspect.occupation}</div>
      {probability !== undefined && <ProbabilityBar value={probability} leader={leader} label={`${suspect.name} probability`} />}
    </>
  )
  if (onSelect) {
    return (
      <button type="button" className={classes} onClick={() => onSelect(suspect.id)} disabled={disabled}>
        {inner}
      </button>
    )
  }
  return <div className={classes}>{inner}</div>
}
