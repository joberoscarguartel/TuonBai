import Icon from './Icon.jsx'

export default function ModeCard({ mode, onOpen }) {
  return (
    <button className={'mode-card ' + mode.id} onClick={() => onOpen(mode.id)}>
      <span className="mode-icon"><Icon name={mode.icon} size={24} /></span>
      <span className="row-label"><strong>{mode.name}</strong><small>{mode.hint}</small></span>
      <Icon name="chevron" size={17} />
    </button>
  )
}
