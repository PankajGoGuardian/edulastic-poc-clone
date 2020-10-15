import React, { useState, useEffect, useRef } from 'react'
import { Spin } from 'antd'
import loadable from '@loadable/component'
// eslint-disable-next-line
import { PDFJSAnnotate } from '@edulastic/ext-libs'
import { BLANK_URL } from '../Worksheet/Worksheet'
import PdfStoreAdapter from './PdfStoreAdapter'

const PDFJSLIB = loadable.lib(() => import('pdfjs-dist/es5/build/pdf'))

const { UI } = PDFJSAnnotate

const PDFViewer = ({
  page,
  pdfScale,
  docLoading,
  setDocLoading,
  setOriginalDimensions,
  currentAnnotationTool,
  annotationToolsProperties,
  annotationsStack,
  currentPage,
  authoringMode,
}) => {
  const { pageNo, URL, rotate } = page
  const pageNumber = URL === BLANK_URL ? 1 : pageNo
  const viewerRef = useRef(null)
  const pdfLib = useRef(null)
  const [pdfDocument, setPdfDocument] = useState(null)

  const clearAllTools = () => {
    UI.disableUpdate()
    UI.disableEdit()
    UI.disablePen()
    UI.disableText()
    UI.disablePoint()
    UI.disableRect()
    UI.disableVideo()
    UI.disableImage()
    UI.setColor(null)
  }

  const enableCurrentTool = (type) => {
    const { size, color } =
      annotationToolsProperties[currentAnnotationTool] || {}

    if (size || color) {
      UI.setPen(size || 1, color)
      UI.setText(size || 12, color)
    }

    switch (type) {
      case 'cursor':
        UI.enableUpdate()
        break
      case 'drag':
        UI.enableEdit()
        break
      case 'draw':
        UI.enablePen()
        UI.setPen(size || 1, color || '#F00')
        break
      case 'text':
        UI.enableText()
        UI.setText(size || 12, color || '#F00')
        break
      case 'point':
        UI.enablePoint()
        break
      case 'area':
      case 'highlight':
      case 'strikeout':
      case 'mask':
        UI.enableRect(type)
        UI.setColor(color || '#F00')
        break
      case 'video':
        UI.enableVideo()
        break
      case 'image':
        UI.enableImage()
        break
      default:
        break
    }
  }

  const loadPdf = () => {
    if (!docLoading) {
      setDocLoading(true)
    }
    const loadingTask = pdfLib.current.getDocument(URL)
    loadingTask.promise
      .then((_pdfDocument) => {
        _pdfDocument
          .getPage(pageNumber)
          .then((_page) => {
            const viewport = _page.getViewport({ scale: 1 })
            setOriginalDimensions({
              width: viewport.width,
              height: viewport.height,
            })
            setPdfDocument(_pdfDocument)
            setDocLoading(false)
          })
          .catch((err) => console.error(`Error on page ${pageNumber}: ${err}`))
      })
      .catch((err) => console.error(`Error: ${err}`))
  }

  useEffect(() => {
    clearAllTools()
    if (!authoringMode) {
      UI.enableUpdate()
      return
    }
    enableCurrentTool(currentAnnotationTool)
  }, [authoringMode, currentAnnotationTool, annotationToolsProperties])

  useEffect(() => {
    if (pdfLib.current)
      pdfLib.current.GlobalWorkerOptions.workerSrc =
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/build/pdf.worker.min.js'
    if (!pdfDocument) {
      loadPdf()
    }
    PDFJSAnnotate.setStoreAdapter(PdfStoreAdapter)
  }, [])

  useEffect(() => {
    /**
     * If the doc's loaded AND loaded doc URL doesn't match with incomming URL
     * then load doc based on incomming URL
     */
    if (pdfDocument && URL !== pdfDocument?._transport?._params?.url) {
      loadPdf()
    }
  }, [currentPage])
  useEffect(() => {
    if (
      !docLoading &&
      pdfDocument &&
      viewerRef.current &&
      URL === pdfDocument?._transport?._params?.url
    ) {
      viewerRef.current.innerHTML = ''

      const _page = UI.createPage(pageNumber)
      viewerRef.current.appendChild(_page)
      // TODO: dont rely on currentPage number as documentId !!!
      const RENDER_OPTIONS = {
        documentId: pageNumber,
        pdfDocument,
        scale: pdfScale || 1.33,
        rotate: rotate || 0,
      }
      UI.renderPage(pageNumber, RENDER_OPTIONS)
    }
  }, [
    docLoading,
    pdfDocument,
    pageNumber,
    currentPage,
    pdfScale,
    rotate,
    annotationsStack.length,
  ])

  if (docLoading) {
    return (
      <Spin>
        <div style={{ width: '100%', height: '800px', background: 'white' }} />
      </Spin>
    )
  }

  return (
    <>
      <div id="viewer" className="pdfViewer" ref={viewerRef} />
      <PDFJSLIB ref={pdfLib} />
    </>
  )
}

export default PDFViewer
