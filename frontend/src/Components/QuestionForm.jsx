import { useState } from 'react'
import Button from './Button.jsx'
import { modes, newId, normalize } from '../study.js'

const letters = ['A', 'B', 'C', 'D']

export default function QuestionForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState({
    type: item?.type || 'snake',
    prompt: item?.prompt || '',
    optionCount: item?.options?.length || 4,
    optionA: item?.options?.[0] || '',
    optionB: item?.options?.[1] || '',
    optionC: item?.options?.[2] || '',
    optionD: item?.options?.[3] || '',
    correct: item?.correct ?? '',
    showExplanation: Boolean(item?.explanation),
    explanation: item?.explanation || '',
    count: item?.count || 2,
    accepted: item?.answers?.map((group) => group.join(', ')).join('\n') || '',
    answer: item?.answer || '',
  })
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value, checked, type } = event.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const prompt = form.prompt.trim()
    const base = { id: item?.id || newId(), type: form.type, prompt }
    if (!prompt) return setError('Enter a prompt.')

    if (form.type === 'snake') {
      const options = letters.slice(0, Number(form.optionCount)).map((letter) => form['option' + letter].trim())
      const correct = Number(form.correct)
      if (options.some((option) => !option)) return setError('Fill in every choice.')
      if (new Set(options.map(normalize)).size !== options.length) return setError('Use different choices.')
      if (form.correct === '' || correct >= options.length) return setError('Select the correct answer.')
      onSave({ ...base, options, correct, explanation: form.showExplanation ? form.explanation.trim() : '' })
    }

    if (form.type === 'drop') {
      const answers = form.accepted.split('\n').filter((line) => line.trim()).map((line) => line.split(',').map((word) => word.trim()).filter(Boolean))
      const count = Number(form.count)
      if (answers.some((group) => !group.length) || !Number.isInteger(count) || count < 1 || count > answers.length) return setError('Set the required count within the number of answers.')
      const aliases = answers.flat().map(normalize)
      if (new Set(aliases).size !== aliases.length) return setError('Each answer and alias must be unique.')
      onSave({ ...base, answers, count })
    }

    if (form.type === 'grid') {
      const answer = form.answer.trim().toUpperCase()
      if (!/^[A-Z]{2,16}$/.test(answer)) return setError('Use 2–16 letters for the crossword term.')
      onSave({ ...base, answer })
    }
  }

  return (
    <form className="form-stack question-form" onSubmit={handleSubmit}>
      <h2>{item ? 'Edit question' : 'New question'}</h2>
      <label>Question type<select aria-label="Question type" name="type" value={form.type} onChange={handleChange}>{modes.map((mode) => <option key={mode.id} value={mode.id}>{mode.hint}</option>)}</select></label>
      <label>{form.type === 'grid' ? 'Clue' : 'Prompt'}<textarea aria-label={form.type === 'grid' ? 'Clue' : 'Prompt'} name="prompt" rows="2" required maxLength={350} value={form.prompt} onChange={handleChange} /></label>
      {form.type === 'snake' && <>
        <label className="short-field">Choices<select aria-label="Choices" name="optionCount" value={form.optionCount} onChange={handleChange}><option>2</option><option>3</option><option>4</option></select></label>
        <fieldset className="choices">
          <legend>Mark the correct answer</legend>
          {letters.slice(0, Number(form.optionCount)).map((letter, index) => (
            <div className="choice-row" key={letter}>
              <input aria-label={letter + ' is correct'} type="radio" name="correct" value={index} checked={form.correct !== '' && Number(form.correct) === index} onChange={handleChange} />
              <span>{letter}</span>
              <input aria-label={'Choice ' + letter} name={'option' + letter} value={form['option' + letter]} onChange={handleChange} required maxLength={100} />
            </div>
          ))}
        </fieldset>
        <label className="checkbox"><input type="checkbox" name="showExplanation" checked={form.showExplanation} onChange={handleChange} /> Add an explanation</label>
        {form.showExplanation && <label>Explanation<textarea aria-label="Explanation" name="explanation" rows="2" maxLength={500} value={form.explanation} onChange={handleChange} /></label>}
      </>}
      {form.type === 'drop' && <>
        <label className="short-field">Answers needed<input type="number" name="count" min="1" required value={form.count} onChange={handleChange} /></label>
        <label>Accepted answers<textarea aria-label="Accepted answers" aria-describedby="alias-help" name="accepted" rows="5" required value={form.accepted} onChange={handleChange} /><small id="alias-help">One answer per line. Use commas for aliases.</small></label>
      </>}
      {form.type === 'grid' && <label>Term<input name="answer" required maxLength={16} value={form.answer} onChange={handleChange} /></label>}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="button-group"><Button type="submit" variant="primary" icon="check">Save question</Button><Button onClick={onCancel}>Cancel</Button></div>
    </form>
  )
}
