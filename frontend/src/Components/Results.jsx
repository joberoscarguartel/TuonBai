import Button from './Button.jsx'
import Icon from './Icon.jsx'
import { modes } from '../study.js'

export default function Results({ result, onBack }) {
  const accuracy = result.answered ? Math.round(result.correct / result.answered * 100) : 0
  const mode = modes.find((item) => item.id === result.mode)
  return (
    <section className="results">
      <div className="page-heading"><div><p className="muted">{result.set.title} · {mode.name}</p><h1>Attempt results</h1></div><Button icon="back" onClick={onBack}>Scores</Button></div>
      <p className="muted">{result.reason}</p>
      <div className="result-stats">
        <div className="panel"><strong>{result.answered}</strong><span>Answered</span></div>
        <div className="panel"><strong>{result.correct}</strong><span>Correct</span></div>
        <div className="panel"><strong>{accuracy}%</strong><span>Accuracy</span></div>
        <div className="panel"><strong>{result.correct * 10}</strong><span>Arcade points</span></div>
      </div>
      {result.responses.length > 0 && <div className="panel result-review"><h2>Answer review</h2>
        <ul className="item-list">
          {result.responses.map((response) => (
            <li key={response.id} className="review-row"><span className={response.correct ? 'success' : 'error'}><Icon name={response.correct ? 'check' : 'close'} size={19} /></span>
              <div><strong>{response.prompt}</strong><p>Yours: {response.answer || '—'}</p><p>Expected: {response.expected}</p></div>
            </li>
          ))}
        </ul>
      </div>}
    </section>
  )
}
