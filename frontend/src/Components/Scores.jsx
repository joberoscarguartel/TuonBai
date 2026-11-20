
import ScoreList from './ScoreList.jsx'

export default function Scores({ history, onResult }) {
  return (
    <section>
      <div className="page-heading"><h1>Scores</h1></div>
      <div className="panel">
        <ScoreList history={history} onResult={onResult} />
      </div>
    </section>
  )
}
