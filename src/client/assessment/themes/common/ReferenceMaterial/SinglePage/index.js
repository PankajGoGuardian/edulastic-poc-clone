import React, { useRef, useEffect } from 'react'

export const SinglePage = ({ getPage, pageNum, size, zoomLevel }) => {
  const cavasRef = useRef()

  useEffect(() => {
    if (cavasRef.current) {
      ;(async () => {
        try {
          const page = await getPage(pageNum)
          // const outputScale = window.devicePixelRatio || 1
          const viewport = page.getViewport({ scale: 1 })

          let scale = size / viewport.width
          if (zoomLevel > 1 && zoomLevel !== undefined) {
            scale *= zoomLevel
          }

          const scaledViewport = page.getViewport({ scale })
          const context = cavasRef.current?.getContext('2d')
          if (cavasRef.current) {
            cavasRef.current.height = scaledViewport.height
            cavasRef.current.width = scaledViewport.width
          }

          const renderContext = {
            canvasContext: context,
            // transform: ctxTransform,
            viewport: scaledViewport,
          }
          page.render(renderContext)
        } catch (error) {
          console.error(`Err: ${error}`)
        }
      })()
    }
  }, [pageNum, getPage, size, zoomLevel])

  return <canvas width={0} height={0} ref={cavasRef} />
}

export default SinglePage
