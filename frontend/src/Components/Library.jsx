import { useState } from 'react'
import Button from './Button.jsx'
import Icon from './Icon.jsx'
import SetRow from './SetRow.jsx'

export default function Library({ sets, materials, materialId, onPreview, onNew, onOpen }) {
  const [search, setSearch] = useState('')
  const filtered = sets.filter((set) => (set.title + ' ' + set.description).toLowerCase().includes(search.trim().toLowerCase()))
  const material = materials.find((item) => item.id === materialId)

  function handleSearch(event) {
    event.preventDefault()
    setSearch(search.trim())
  }

  return (
    <>
      <div className="page-heading">
        <h1>My Library</h1>
        <form className="search" role="search" onSubmit={handleSearch}>
          <button className="icon-button" type="submit" aria-label="Submit search"><Icon name="search" size={18} /></button>
          <input aria-label="Search sets" placeholder="Search sets" value={search} onChange={(event) => setSearch(event.target.value)} />
        </form>
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading"><h2>Question sets</h2></div>
          <ul className="item-list">
            {filtered.map((set) => <SetRow key={set.id} set={set} onOpen={onOpen} />)}
            {!filtered.length && <li className="empty-line">{search ? 'No matches.' : 'No sets yet.'}</li>}
          </ul>
        </section>
        <section className="panel">
          <div className="panel-heading"><h2>Study material</h2></div>
          {!materials.length && <p className="empty-line">Import a TXT or PDF file.</p>}
          <ul className="item-list">
            {materials.map((item) => (
              <li key={item.id}><button className={'set-row ' + (item.id === materialId ? 'selected-row' : '')} aria-pressed={item.id === materialId} onClick={() => onPreview(item.id)}>
                <span className="set-icon"><Icon name="file" size={18} /></span><span className="row-label"><strong>{item.name}</strong></span>
              </button></li>
            ))}
          </ul>
          {material && <div className="material-preview"><pre>{material.text}</pre><Button icon="plus" onClick={() => onNew(material.id)}>Create set</Button></div>}
        </section>
      </div>
    </>
  )
}
