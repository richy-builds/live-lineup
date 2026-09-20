import type { Suspect } from '../../shared/suspects.ts'
import { Avatar } from './Avatar.tsx'
import { Sparkline } from './Sparkline.tsx'

interface Props {
  correct: boolean
  target: Suspect
  locked: Suspect | null
  score: number
  chars: number
  seconds: number
  history: number[]
  onNext: () => void
}

export function ResultPanel({ correct, target, locked, score, chars, seconds, history, onNext }: Props) {
  return (
    <div className={`result ${correct ? 'result--good' : 'result--bad'}`}>
      <div className="result__headline">
        {correct ? 'Jev picked out ' : 'Jev locked onto '}
        <strong>{locked?.name ?? 'nobody'}</strong>
        {correct ? '.' : <> instead of <strong>{target.name}</strong>.</>}
      </div>
      <div className="result__stats">
        <div><span className="stat__n">{score}</span><span className="stat__l">score</span></div>
        <div><span className="stat__n">{chars}</span><span className="stat__l">characters</span></div>
        <div><span className="stat__n">{seconds.toFixed(1)}s</span><span className="stat__l">typing</span></div>
        <div><span className="stat__n">{history.length}</span><span className="stat__l">Jev calls</span></div>
      </div>
      <div className="result__spark">
        <div className="result__sparklabel">Probability of {target.name} after each keystroke</div>
        <Sparkline values={history} />
      </div>
      {!correct && locked && (
        <div className="result__compare">
          <div><Avatar traits={target.traits} size={56} /><span>target</span></div>
          <div><Avatar traits={locked.traits} size={56} /><span>Jev's pick</span></div>
        </div>
      )}
      <button type="button" className="btn btn--primary" onClick={onNext} autoFocus>
        Next suspect
      </button>
    </div>
  )
}
