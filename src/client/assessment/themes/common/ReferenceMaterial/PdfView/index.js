import React, { useRef, useState, useCallback, useEffect } from 'react'
import pdfjsLib from 'pdfjs-dist'

import SinglePage from '../SinglePage'
import { PdfDocument } from './styled'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.1.266/build/pdf.worker.min.js'

const PdfView = ({ uri, size, zoomLevel }) => {
  const pdfRef = useRef()
  const [numPages, setNumPages] = useState(null)

  const getPage = useCallback((num) => pdfRef.current.getPage(num), [])

  useEffect(() => {
    if (uri) {
      const loadingTask = pdfjsLib.getDocument(uri)
      loadingTask.promise
        .then((pdf) => {
          pdfRef.current = pdf
          setNumPages(pdf.numPages)
        })
        .catch((err) => console.error(`Error: ${err}`))
    }
  }, [uri])

  if (numPages === null) {
    return null
  }

  return (
    <PdfDocument data-testid="pdf-document">
      {new Array(numPages).fill(true).map((_, i) => (
        <SinglePage
          key={i}
          getPage={getPage}
          pageNum={i + 1}
          size={size}
          zoomLevel={zoomLevel}
        />
      ))}
    </PdfDocument>
  )
}

export default PdfView
