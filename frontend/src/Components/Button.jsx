import Icon from './Icon.jsx'

export default function Button({ icon, children, onClick, variant = 'secondary', disabled = false, type = 'button' }) {
  return <button type={type} className={'button ' + variant} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={17} />}{children}</button>
}
