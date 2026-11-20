
import { useState } from 'react'
import Button from './Button.jsx'

const yearLevels = ['1st year', '2nd year', '3rd year', '4th year', '5th year', 'Other']

export default function Profile({ currentName, email = '', program = '', yearLevel = '', section = '', onSave }) {
  const [form, setForm] = useState({ name: currentName, email, program, yearLevel, section })
  const [updated, setUpdated] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setUpdated(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = form.name.trim()
    if (!trimmedName) return
    const details = {
      ...form,
      name: trimmedName,
      email: form.email.trim(),
      program: form.program.trim(),
      section: form.section.trim(),
    }
    onSave(details)
    setForm(details)
    setUpdated(true)
  }

  return (
    <section aria-labelledby="profile-title">
      <div className="page-heading"><h1 id="profile-title">Profile</h1></div>
      <form className="panel form-stack profile-form" onSubmit={handleSubmit}>
        <div className="form-details">
          <label>
            Name
            <input name="name" value={form.name} autoComplete="name" required maxLength={40} onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} autoComplete="email" maxLength={120} onChange={handleChange} />
          </label>
        </div>
        <label>
          Program
          <input name="program" value={form.program} maxLength={80} onChange={handleChange} />
        </label>
        <div className="form-details">
          <label>
            Year level
            <select name="yearLevel" aria-label="Year level" value={form.yearLevel} onChange={handleChange}>
              <option value="">Select year</option>
              {yearLevels.map((level) => <option key={level}>{level}</option>)}
            </select>
          </label>
          <label>
            Section
            <input name="section" value={form.section} maxLength={40} onChange={handleChange} />
          </label>
        </div>
        <div className="button-group">
          <Button icon="check" variant="primary" type="submit" disabled={!form.name.trim()}>Save profile</Button>
          {updated && <p className="success" role="status">Profile updated.</p>}
        </div>
      </form>
    </section>
  )
}
