import { useState } from 'react'
import Button from './Button.jsx'
import Icon from './Icon.jsx'
import QuestionForm from './QuestionForm.jsx'
import { modes } from '../study.js'

export default function Editor({ set, materials, onSave, onDelete, onBack, onPracticeWordDrop }) {
  const [draft, setDraft] = useState(set)
  const [editing, setEditing] = useState(null)
  const [status, setStatus] = useState('')
  const [saved, setSaved] = useState(set.version > 0)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const material = materials.find((item) => item.id === draft.materialId)
  const hasWordDrop = draft.questions.some((item) => item.type === 'drop')

  function changeDraft(changes) {
    setDraft({ ...draft, ...changes })
    setSaved(false)
    setStatus('')
  }

  function changeDetails(event) {
    changeDraft({ [event.target.name]: event.target.value })
  }

  function saveQuestion(item) {
    const exists = draft.questions.some((question) => question.id === item.id)
    changeDraft({ questions: exists ? draft.questions.map((question) => question.id === item.id ? item : question) : [...draft.questions, item] })
    setEditing(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (editing) {
      setStatus('Save or cancel the open question first.')
      return
    }
    if (!draft.title.trim()) {
      setStatus('Enter a set name.')
      return
    }
    if (!saved) {
      const updated = { ...draft, title: draft.title.trim(), description: draft.description.trim(), version: draft.version + 1 }
      onSave(updated)
      setDraft(updated)
      setSaved(true)
    }
    setStatus('Set saved.')
  }

  return (
    <>
      <div className="page-heading"><h1>{set.version ? 'Question editor' : 'New question set'}</h1><Button icon="back" onClick={onBack}>Library</Button></div>
      <div className="editor-grid">
        <section className="panel editor-panel">
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-details">
              <label>Set name<input name="title" required maxLength={80} value={draft.title} onChange={changeDetails} placeholder="e.g. Data types" /></label>
              <label>Description <span className="muted">(optional)</span><input name="description" maxLength={140} value={draft.description} onChange={changeDetails} /></label>
            </div>
            <label>Study material<select aria-label="Study material" name="materialId" value={draft.materialId} onChange={changeDetails}><option value="">None</option>{materials.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <div className="button-group">
              <Button variant="primary" type="submit" icon="check">Save set</Button>
              {draft.version > 0 && <Button variant="quiet danger" icon="trash" onClick={() => setConfirmDelete(!confirmDelete)}>Delete set</Button>}
            </div>
            {status && <p role="status" className={status === 'Set saved.' ? 'success' : 'error'}>{status}</p>}
            {confirmDelete && <div className="button-group"><span>Delete this set?</span><Button variant="danger" onClick={() => onDelete(draft.id)}>Delete</Button><Button onClick={() => setConfirmDelete(false)}>Cancel</Button></div>}
          </form>
          <div className="section-heading editor-heading"><h2>Questions <span>({draft.questions.length})</span></h2><Button icon="plus" disabled={Boolean(editing)} onClick={() => setEditing({})}>Add question</Button></div>
          {editing && <QuestionForm key={editing.id || 'new'} item={editing.id ? editing : null} onSave={saveQuestion} onCancel={() => setEditing(null)} />}
          <ul className="item-list question-list">
            {draft.questions.map((item) => (
              <li key={item.id} className="question-row">
                <span className={'set-icon ' + item.type}><Icon name={modes.find((mode) => mode.id === item.type).icon} size={17} /></span>
                <span className="row-label"><strong>{item.prompt}</strong></span>
                <button className="icon-button" aria-label={'Edit ' + item.prompt} disabled={Boolean(editing)} onClick={() => setEditing(item)}><Icon name="edit" size={17} /></button>
                <button className="icon-button" aria-label={'Delete ' + item.prompt} disabled={Boolean(editing)} onClick={() => changeDraft({ questions: draft.questions.filter((question) => question.id !== item.id) })}><Icon name="trash" size={17} /></button>
              </li>
            ))}
            {!draft.questions.length && !editing && <li className="empty-line">No questions yet.</li>}
          </ul>
        </section>
        <div className="editor-aside">
          <section className="panel">
            <div className="panel-heading"><h2>Source preview</h2></div>
            {material ? <div className="material-preview"><strong>{material.name}</strong><pre>{material.text}</pre></div> : <p className="empty-line">Select study material to preview it.</p>}
          </section>
          <section className="panel">
            <div className="panel-heading practice-heading">
              <h2>Practice</h2>
              {hasWordDrop && !saved && <span className="muted">Save the set to play.</span>}
            </div>
            <div className="practice-list">
              {modes.map((mode) => (
                <Button
                  key={mode.id}
                  icon={mode.icon}
                  disabled={mode.id !== 'drop' || !hasWordDrop || !saved || Boolean(editing)}
                  onClick={() => onPracticeWordDrop(draft.id)}
                >
                  {mode.name}
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
