import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

export async function extractPdfText(file) {
  const data = await file.arrayBuffer()
  const task = getDocument({ data })
  const pages = []
  try {
    const pdf = await task.promise
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const page = await pdf.getPage(number)
      const content = await page.getTextContent()
      pages.push(content.items.map((item) => item.str ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('').trim())
    }
  } catch {
    throw new Error('This PDF could not be read. Check that it opens without a password.')
  } finally {
    await task.destroy()
  }
  const text = pages.filter(Boolean).join('\n\n')
  if (!text) throw new Error('No selectable text found. Image-only PDFs are unsupported.')
  return text
}
