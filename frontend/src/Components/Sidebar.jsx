
import Icon from './Icon.jsx'

export default function Sidebar({ items, page, name, onNavigate }) {
  return (
    <aside className="sidebar">
      <button className="brand" aria-label="TuonBai home" onClick={() => onNavigate('arcade')}>
        <img src="/mark.svg" alt="" />
        <span>Tuon<span>Bai</span></span>
      </button>
      <nav aria-label="Main navigation">
        {items.map((item) => (
          <button
            key={item.id}
            className={'nav-button ' + (page === item.id ? 'current' : '')}
            aria-current={page === item.id ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="profile-button" aria-label="Profile" aria-current={page === 'profile' ? 'page' : undefined} onClick={() => onNavigate('profile')}>
        <span className="avatar"><Icon name="user" size={19} /></span>
        <span className="row-label"><strong>{name}</strong><small>Profile</small></span>
        <Icon name="chevron" size={15} />
      </button>
    </aside>
  )
}
