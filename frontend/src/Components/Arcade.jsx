import Button from './Button.jsx'
import HeroArt from './HeroArt.jsx'
import Icon from './Icon.jsx'
import ScoreList from './ScoreList.jsx'
import SetRow from './SetRow.jsx'
import { modes } from '../study.js'

export default function Arcade({ sets, history, onMode, onOpen, onNavigate, onResult }) {
  return (
    <>
      <section className="hero">
        <HeroArt />
        <div className="hero-content">
          <h1>Study<br />Arcade<span>.</span></h1>
          <p>Turn your notes into a game.</p>
          <Button icon="drop" variant="primary" onClick={() => onMode('drop')}>Play Word Drop</Button>
        </div>
      </section>
      <section className="arcade-section" aria-labelledby="modes-heading">
        <div className="section-heading">
          <h2 id="modes-heading">Game modes</h2>
        </div>
        <div className="mode-grid">
          {modes.map((mode) => (
            <button className={'mode-card ' + mode.id} key={mode.id} onClick={() => onMode(mode.id)}>
              <span className="mode-icon"><Icon name={mode.icon} size={24} /></span>
              <span className="row-label"><strong>{mode.name}</strong><small>{mode.hint}</small></span>
              <Icon name="chevron" size={17} />
            </button>
          ))}
        </div>
      </section>
      <div className="dashboard-grid arcade-section">
        <section>
          <div className="section-heading"><h2>Question sets</h2><button className="text-button" onClick={() => onNavigate('library')}>View library <Icon name="chevron" size={14} /></button></div>
          <ul className="panel item-list">
            {sets.slice(0, 3).map((set) => <SetRow key={set.id} set={set} onOpen={onOpen} />)}
            {!sets.length && <li className="empty-line">No sets yet.</li>}
          </ul>
        </section>
        <section>
          <div className="section-heading"><h2>Recent scores</h2><button className="text-button" onClick={() => onNavigate('scores')}>View all <Icon name="chevron" size={14} /></button></div>
          <div className="panel"><ScoreList history={history.slice(0, 3)} onResult={onResult} /></div>
        </section>
      </div>
    </>
  )
}
