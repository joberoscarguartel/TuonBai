export const modes = [
  { id: 'snake', name: 'Snake', icon: 'snake', hint: 'Multiple choice' },
  { id: 'drop', name: 'Word Drop', icon: 'drop', hint: 'Enumeration' },
  { id: 'grid', name: 'Crossword', icon: 'grid', hint: 'Clues and terms' },
]

const choice = (id, prompt, options, correct, explanation = '') => (
  { id, type: 'snake', prompt, options, correct, explanation }
)

const dataQuestions = [
  choice('d1', 'Which data type stores true or false?', ['Boolean', 'Integer', 'Float', 'String'], 0, 'A Boolean has two values, true and false.'),
  choice('d2', 'Which data type stores a whole number?', ['String', 'Integer', 'Boolean', 'Character'], 1),
  choice('d3', 'Which type represents a sequence of characters?', ['Array', 'Float', 'Integer', 'String'], 3),
  choice('d4', 'Which type can represent 3.14?', ['Boolean', 'Character', 'Float', 'Integer'], 2),
  choice('d5', 'Which type is used for a single letter in Java?', ['String', 'Boolean', 'char', 'int'], 2),
  choice('d6', 'What is the first index in a JavaScript array?', ['0', '1', '-1', '2'], 0),
  choice('d7', 'Which structure holds an ordered list of items in JavaScript?', ['Boolean', 'Number', 'Symbol', 'Array'], 3),
  choice('d8', 'Which JavaScript keyword declares a variable you can reassign?', ['const', 'let', 'return', 'case'], 1),
  choice('d9', 'What is the result of JavaScript’s typeof "42"?', ['number', 'boolean', 'string', 'object'], 2),
  choice('d10', 'Which JavaScript operator checks strict equality?', ['=', '==', '!=', '==='], 3),
  { id: 'd11', type: 'drop', prompt: 'Name five common data types.', count: 5, answers: [['Boolean', 'bool'], ['Integer', 'int'], ['Float', 'floating point'], ['String', 'str'], ['Character', 'char']] },
  { id: 'd12', type: 'drop', prompt: 'Name the two Boolean values.', count: 2, answers: [['True'], ['False']] },
  ...[
    ['STRING', 'A sequence of characters'],
    ['INTEGER', 'A whole number'],
    ['FLOAT', 'A number with a fractional part'],
    ['CHAR', 'Type for a single character in Java'],
    ['ARRAY', 'An ordered collection of items'],
    ['BOOLEAN', 'Type with the values true and false'],
  ].map(([answer, prompt]) => ({ id: answer, type: 'grid', prompt, answer })),
]

export const wordDropSamples = dataQuestions.filter((question) => question.type === 'drop')

export const demoSets = [
  { id: 'data-types', title: 'Data types', description: 'Programming fundamentals', materialId: '', version: 1, questions: dataQuestions },
  { id: 'networks', title: 'Networking terms', description: 'Computer networks', materialId: '', version: 1, questions: [
    choice('n1', 'What does LAN stand for?', ['Local Area Network', 'Long Access Node', 'Linked Area Name'], 0),
    choice('n2', 'What device forwards packets between networks?', ['Keyboard', 'Router', 'Monitor'], 1),
    choice('n3', 'Which service resolves a domain name to an IP address?', ['HTTP', 'FTP', 'DNS'], 2),
    choice('n4', 'Which protocol encrypts HTTP traffic?', ['HTTPS', 'DNS', 'ARP'], 0),
  ] },
  { id: 'react', title: 'React basics', description: 'Frontend development', materialId: '', version: 1, questions: [
    choice('r1', 'What do we call data passed to a component?', ['Props', 'Keys', 'Events'], 0),
    choice('r2', 'Which hook stores a value between renders?', ['useState', 'map', 'filter'], 0),
    choice('r3', 'Which method can turn an array into a list of JSX elements?', ['filter', 'map', 'slice'], 1),
  ] },
]

const storageKey = 'tuonbai-study-v1'

export function loadStudy() {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved) return JSON.parse(saved)
  } catch {
    // The library can still run when browser storage is unavailable.
  }
  return { sets: demoSets, materials: [], history: [], name: 'Student' }
}

export function saveStudy(study) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(study))
    return true
  } catch {
    return false
  }
}

export function newId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2)
}

export function normalize(answer) {
  return answer.trim().toLowerCase()
}

export async function readMaterial(file) {
  const extension = file.name.split('.').pop().toLowerCase()
  if (extension === 'txt') {
    const text = (await file.text()).trim()
    if (!text) throw new Error('This text file is empty.')
    return text
  }
  if (extension !== 'pdf') throw new Error('Choose a TXT or PDF file.')
  const { extractPdfText } = await import('./pdf.js')
  return extractPdfText(file)
}
