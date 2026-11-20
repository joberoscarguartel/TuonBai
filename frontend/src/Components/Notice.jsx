import Icon from './Icon.jsx'

export default function Notice({ children, onDismiss }) {
  return (
    <div className="notice" role="status">
      <span>{children}</span>
      {onDismiss && (
        <button className="icon-button" onClick={onDismiss} aria-label="Dismiss message">
          <Icon name="close" size={17} />
        </button>
      )}
    </div>
  )
}
