import Button from './Button.jsx'
import Icon from './Icon.jsx'

export default function Topbar({ breadcrumb, uploading, onImport, onNewSet }) {
  return (
    <header className="topbar">
      <span className="breadcrumb">{breadcrumb}</span>
      <div className="button-group">
        <label className={'button secondary file-button ' + (uploading ? 'disabled' : '')}>
          <Icon name="upload" size={17} />
          <span>{uploading ? 'Importing…' : 'Import notes'}</span>
          <input type="file" accept=".txt,.pdf,text/plain,application/pdf" aria-label="Import notes" disabled={uploading} onChange={onImport} />
        </label>
        <Button variant="primary" icon="plus" onClick={onNewSet}>New set</Button>
      </div>
    </header>
  )
}
