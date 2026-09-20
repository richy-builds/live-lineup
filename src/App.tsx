import { useState } from 'react'
import { DescribeMode } from './components/DescribeMode.tsx'
import { InterrogateMode } from './components/InterrogateMode.tsx'
import { readBest, type Mode } from './bestScores.ts'

export default function App() {
  const [mode, setMode] = useState<Mode>('describe')
  const [best, setBest] = useState({ describe: readBest('describe'), interrogate: readBest('interrogate') })

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand__title">Live Lineup</span>
          <span className="brand__sub">twelve suspects · one witness · Jev decides in milliseconds</span>
        </div>
        <nav className="tabs" aria-label="Game mode">
          <button type="button" className={`tab ${mode === 'describe' ? 'tab--on' : ''}`} onClick={() => setMode('describe')}>
            Describe <span className="tab__best">best {best.describe}</span>
          </button>
          <button type="button" className={`tab ${mode === 'interrogate' ? 'tab--on' : ''}`} onClick={() => setMode('interrogate')}>
            Interrogate <span className="tab__best">best {best.interrogate}</span>
          </button>
        </nav>
      </header>
      <main>
        {mode === 'describe' ? (
          <DescribeMode onBest={(b) => setBest((s) => ({ ...s, describe: b }))} />
        ) : (
          <InterrogateMode onBest={(b) => setBest((s) => ({ ...s, interrogate: b }))} />
        )}
      </main>
    </div>
  )
}
