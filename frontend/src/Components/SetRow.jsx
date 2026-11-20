import Icon from './Icon.jsx'

export default function SetRow({ set, onOpen }) {
  return (
    <li>
      <button className="set-row" type="button" onClick={() => onOpen(set)}>
        <span className="set-icon"><Icon name="stack" size={19} /></span>
        <span className="row-label"><strong>{set.title}</strong>{set.description && <small>{set.description}</small>}</span>
        <span className="row-count">{set.questions.length} {set.questions.length === 1 ? 'item' : 'items'}</span>
        <Icon name="chevron" size={16} />
      </button>
    </li>
  )
}
