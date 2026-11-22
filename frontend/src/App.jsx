import { useEffect, useState } from 'react'
import Arcade from './Components/Arcade.jsx'
import Editor from './Components/Editor.jsx'
import GameStatus from './Components/GameStatus.jsx'
import Library from './Components/Library.jsx'
import Notice from './Components/Notice.jsx'
import Profile from './Components/Profile.jsx'
import Results from './Components/Results.jsx'
import Scores from './Components/Scores.jsx'
import Sidebar from './Components/Sidebar.jsx'
import Topbar from './Components/Topbar.jsx'
import WordDrop from './Components/WordDrop.jsx'
import { loadStudy, modes, newId, readMaterial, saveStudy } from './study.js'

const navigation = [
  { id: 'arcade', label: 'Study Arcade', icon: 'home' },
  { id: 'library', label: 'My Library', icon: 'books' },
  { id: 'scores', label: 'Scores', icon: 'trophy' },
]

const pageLabels = {
  editor: 'Question editor',
  profile: 'Profile',
  result: 'Results',
}

export default function App() {
  const [study, setStudy] = useState(loadStudy)
  const [page, setPage] = useState('arcade')
  const [editor, setEditor] = useState(null)
  const [wordDropSetId, setWordDropSetId] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [result, setResult] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    setStorageError(!saveStudy(study))
  }, [study])

  function openSet(set) {
    setEditor(set)
    setPage('editor')
  }

  function openMode(mode, setId = '') {
    setWordDropSetId(setId)
    setPage(mode)
  }

  function newSet(materialId = '') {
    openSet({ id: newId(), title: '', description: '', materialId, version: 0, questions: [] })
  }

  function storeSet(set) {
    const saved = study.sets.some((item) => item.id === set.id)
    setStudy({ ...study, sets: saved ? study.sets.map((item) => item.id === set.id ? set : item) : [set, ...study.sets] })
  }

  function deleteSet(id) {
    setStudy({ ...study, sets: study.sets.filter((set) => set.id !== id) })
    setPage('library')
  }

  async function importFile(event) {
    const input = event.target
    const file = input.files[0]
    input.value = ''
    if (!file) return
    setUploading(true)
    setNotice('')
    setPage('library')
    try {
      const text = await readMaterial(file)
      const material = { id: newId(), name: file.name, text }
      setStudy((current) => ({ ...current, materials: [material, ...current.materials] }))
      setSelectedMaterial(material.id)
    } catch (error) {
      setNotice(error.message || 'This file could not be read.')
    } finally {
      setUploading(false)
    }
  }

  function viewResult(entry) {
    setResult(entry)
    setPage('result')
  }

  function finishWordDrop(set, responses, reason) {
    const entry = {
      id: newId(),
      mode: 'drop',
      date: Date.now(),
      set: { id: set.id, title: set.title, version: set.version },
      responses,
      answered: responses.length,
      correct: responses.filter((response) => response.correct).length,
      reason,
    }
    setStudy((current) => ({ ...current, history: [entry, ...current.history] }))
    viewResult(entry)
  }

  const activeNav = navigation.find((item) => item.id === page)
  const selectedMode = modes.find((item) => item.id === page)
  const breadcrumb = activeNav?.label || selectedMode?.name || pageLabels[page]

  return (
    <div className="app-shell">
      <Sidebar items={navigation} page={page} name={study.name} onNavigate={setPage} />
      <div className="workspace">
        <Topbar breadcrumb={breadcrumb} uploading={uploading} onImport={importFile} onNewSet={() => newSet()} />
        <main className="content">
          {notice && <Notice onDismiss={() => setNotice('')}>{notice}</Notice>}
          {storageError && <Notice>Browser storage is full or unavailable. Changes are kept for this visit.</Notice>}
          {page === 'arcade' && <Arcade sets={study.sets} history={study.history} onMode={openMode} onOpen={openSet} onNavigate={setPage} onResult={viewResult} />}
          {page === 'library' && <Library sets={study.sets} materials={study.materials} materialId={selectedMaterial} onNew={newSet} onOpen={openSet} onPreview={setSelectedMaterial} />}
          {page === 'editor' && <Editor key={editor.id} set={editor} materials={study.materials} onSave={storeSet} onDelete={deleteSet} onBack={() => setPage('library')} onPracticeWordDrop={(id) => openMode('drop', id)} />}
          {selectedMode && (
            selectedMode.id === 'drop'
              ? <WordDrop sets={study.sets} initialSetId={wordDropSetId} onFinish={finishWordDrop} />
              : <GameStatus name={selectedMode.name} />
          )}
          {page === 'scores' && <Scores history={study.history} onResult={viewResult} />}
          {page === 'result' && <Results result={result} onBack={() => setPage('scores')} />}
          {page === 'profile' && (
            <Profile
              currentName={study.name}
              email={study.email}
              program={study.program}
              yearLevel={study.yearLevel}
              section={study.section}
              onSave={(details) => setStudy({ ...study, ...details })}
            />
          )}
        </main>
      </div>
    </div>
  )
}
