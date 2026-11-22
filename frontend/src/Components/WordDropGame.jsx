import { useEffect, useState } from 'react'
import Button from './Button.jsx'
import Icon from './Icon.jsx'
import { normalize } from '../study.js'

const lanes = [30, 68, 48]

function makeResponse(question, matches) {
  return {
    id: question.id,
    prompt: question.prompt,
    answer: matches.map((match) => match.typed).join(', '),
    expected: question.answers.map(([answer]) => answer).join(', '),
    correct: matches.length >= question.count,
  }
}

export default function WordDropGame({ set, duration, onFinish }) {
  const [round, setRound] = useState(0)
  const [seconds, setSeconds] = useState(duration)
  const [answer, setAnswer] = useState('')
  const [matches, setMatches] = useState([])
  const [responses, setResponses] = useState([])
  const [paused, setPaused] = useState(false)
  const [message, setMessage] = useState('')
  const question = set.questions[round]

  useEffect(() => {
    if (paused) return

    const timer = setTimeout(() => {
      if (seconds > 1) {
        setSeconds(seconds - 1)
        return
      }

      const remaining = question.answers.filter((_, index) => !matches.some((match) => match.index === index))
      const missing = remaining.map(([accepted]) => accepted).join(', ')
      onFinish([...responses, makeResponse(question, matches)], 'Time expired. Remaining accepted answers: ' + missing + '.')
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds, paused, question, matches, responses, onFinish])

  function shoot(event) {
    event.preventDefault()
    const typed = answer.trim()
    if (!typed || paused) return

    const index = question.answers.findIndex((aliases) => aliases.some((alias) => normalize(alias) === normalize(typed)))
    setAnswer('')
    if (index === -1) {
      setMessage('Try another answer.')
      return
    }
    if (matches.some((match) => match.index === index)) {
      setMessage('Already counted.')
      return
    }

    const updatedMatches = [...matches, { index, typed }]
    setSeconds(duration)
    if (updatedMatches.length < question.count) {
      setMatches(updatedMatches)
      setMessage('Target cleared.')
      return
    }

    const completed = [...responses, makeResponse(question, updatedMatches)]
    if (round + 1 === set.questions.length) {
      onFinish(completed, 'Set complete.')
      return
    }

    setResponses(completed)
    setRound(round + 1)
    setMatches([])
    setMessage('Round complete.')
  }

  function exit() {
    const attempted = matches.length ? [...responses, makeResponse(question, matches)] : responses
    onFinish(attempted, 'Attempt ended early.')
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Word Drop</h1>
        <div className="button-group">
          <Button onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</Button>
          <Button onClick={exit}>End attempt</Button>
        </div>
      </div>
      <div className="panel word-drop-panel word-drop-game">
        <div className="drop-meta">
          <span>Round {round + 1} / {set.questions.length}</span>
          <span>{matches.length} / {question.count} accepted</span>
          <span className="drop-clock" aria-label={seconds + ' seconds remaining'}>{seconds}s</span>
        </div>
        <h2>{question.prompt}</h2>
        <div className="drop-board" aria-hidden="true">
          <span key={round + '-' + matches.length} className="drop-target" style={{ left: lanes[(round + matches.length) % lanes.length] + '%', top: (9 + 84 * (duration - seconds) / (duration - 1)) + '%' }}>?</span>
          <span className="drop-launcher"><Icon name="drop" size={26} /></span>
          {paused && <div className="drop-paused">Paused</div>}
        </div>
        <form className="drop-answer" onSubmit={shoot}>
          <input
            aria-label="Type an answer"
            placeholder="Type an answer"
            autoComplete="off"
            autoFocus
            disabled={paused}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
          <Button type="submit" variant="primary" disabled={paused || !answer.trim()}>Shoot</Button>
        </form>
        {matches.length > 0 && (
          <ul className="drop-matches" aria-label="Accepted answers">
            {matches.map((match) => <li key={match.index}>{question.answers[match.index][0]}</li>)}
          </ul>
        )}
        <p className="drop-message muted" role="status">{message}</p>
      </div>
    </section>
  )
}
