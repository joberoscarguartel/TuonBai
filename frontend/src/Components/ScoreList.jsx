
import Icon from './Icon.jsx'
import { modes } from '../study.js'

export default function ScoreList({ history, onResult }) {
  if (!history.length) return <div className="empty-score"><Icon name="trophy" size={24} /><strong>No attempts yet</strong></div>
  return (
    <ul className="item-list">
      {history.map((entry) => (
        <li key={entry.id}>
          <button className="set-row" onClick={() => onResult(entry)}>
            <span className={'set-icon ' + entry.mode}><Icon name={modes.find((mode) => mode.id === entry.mode).icon} size={18} /></span>
            <span className="row-label"><strong>{entry.set.title}</strong><small>{new Date(entry.date).toLocaleDateString()}</small></span>
            <span className="row-count">{entry.correct}/{entry.answered}</span>
            <Icon name="chevron" size={16} />
          </button>
        </li>
      ))}
    </ul>
  )
}
