import { useState } from 'react'
import Button from './Button.jsx'
import WordDropGame from './WordDropGame.jsx'
import { wordDropSamples } from '../study.js'

const sampleSet = { id: 'word-drop-samples', title: 'Sample questions', version: 1, questions: wordDropSamples }

export default function WordDrop({ sets, initialSetId, onFinish }) {
  const compatibleSets = sets
    .map((set) => ({ ...set, questions: set.questions.filter((question) => question.type === 'drop') }))
    .filter((set) => set.questions.length > 0)
  const choices = compatibleSets.length ? compatibleSets : [sampleSet]
  const [setId, setSetId] = useState(initialSetId)
  const [speed, setSpeed] = useState('normal')
  const [attempt, setAttempt] = useState(null)
  const selected = choices.find((set) => set.id === setId) || choices[0]

  function start(event) {
    event.preventDefault()
    setAttempt({ set: selected, duration: speed === 'slow' ? 40 : 20 })
  }

  if (attempt) {
    return (
      <WordDropGame
        set={attempt.set}
        duration={attempt.duration}
        onFinish={(responses, reason) => onFinish(attempt.set, responses, reason)}
      />
    )
  }

  return (
    <section>
      <div className="page-heading"><h1>Word Drop</h1></div>
      <form className="panel form-stack word-drop-panel" onSubmit={start}>
        <label>
          Question set
          <select aria-label="Question set" value={selected.id} onChange={(event) => setSetId(event.target.value)}>
            {choices.map((set) => <option key={set.id} value={set.id}>{set.title}</option>)}
          </select>
        </label>
        <label>
          Speed
          <select aria-label="Speed" value={speed} onChange={(event) => setSpeed(event.target.value)}>
            <option value="normal">Normal (20 seconds per target)</option>
            <option value="slow">Slow (40 seconds per target)</option>
          </select>
        </label>
        <div className="button-group">
          <Button icon="drop" variant="primary" type="submit">Start Word Drop</Button>
          <p className="muted">{selected.questions.length} {selected.questions.length === 1 ? 'round' : 'rounds'}</p>
        </div>
      </form>
    </section>
  )
}
