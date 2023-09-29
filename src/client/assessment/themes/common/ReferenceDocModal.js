import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { Rnd } from 'react-rnd'
import pdfjsLib from 'pdfjs-dist'
import {
  white,
  darkBlueSecondary,
  themeLightGrayBgColor,
  boxShadowDefault,
} from '@edulastic/colors'
import { IconClose, IconResize } from '@edulastic/icons'
import { fileTypes, test } from '@edulastic/constants'
import { updateTestPlayerAction } from '../../../author/sharedDucks/testPlayer'
import { themes } from '../../../theme'

const { playerSkinValues } = test
const {
  playerSkin: { quester, parcc },
} = themes

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.1.266/build/pdf.worker.min.js'

const SinglePage = ({ getPage, pageNum, size, zoomLevel }) => {
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
          const context = cavasRef.current.getContext('2d')
          cavasRef.current.height = scaledViewport.height
          cavasRef.current.width = scaledViewport.width

          // const ctxTransform =
          //   outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null

          const renderContext = {
            canvasContext: context,
            // transform: ctxTransform,
            viewport: scaledViewport,
          }

          page.render(renderContext)
        } catch (error) {
          console.log(`Err: ${error}`)
        }
      })()
    }
  }, [pageNum, getPage, size, zoomLevel])

  return <canvas width={0} height={0} ref={cavasRef} />
}

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
        .catch((err) => console.log(`Error: ${err}`))
    }
  }, [uri])

  if (numPages === null) {
    return null
  }

  return (
    <PdfDocument>
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

const initSetting = { x: 120, y: 120, width: 600, height: 500 }

const imageTypes = [fileTypes.PNG, fileTypes.GIF, fileTypes.JPEG, fileTypes.JPG]

const ReferenceDocModal = ({
  playerSkinType,
  attributes,
  updateTestPlayer,
  zoomLevel,
}) => {
  const [size, setSize] = useState(600)
  const handleClose = () => {
    updateTestPlayer({ isShowReferenceModal: false })
  }

  const handleResizeStop = (evt, dir, ref) => {
    if (attributes?.type === fileTypes.PDF) {
      setSize(ref.clientWidth)
    }
  }

  const reference = useMemo(() => {
    if (!attributes) {
      return null
    }

    const { source, type } = attributes
    if (imageTypes.includes(type)) {
      return <Image src={source} zoomLevel={zoomLevel} />
    }
    if (type === fileTypes.PDF) {
      return <PdfView uri={source} size={size} zoomLevel={zoomLevel} />
    }
    return null
  }, [attributes, size, zoomLevel])

  const skinType = playerSkinType ? playerSkinType.toLowerCase() : ''
  const isQuestarSkin = skinType === playerSkinValues.quester.toLowerCase()
  const zoomed = zoomLevel > 1 && zoomLevel !== undefined

  return (
    <RndWrapper
      bounds="parent"
      default={initSetting}
      onResizeStop={handleResizeStop}
      dragHandleClassName="reference-material-drag-handler"
    >
      <div className="reference-material-drag-handler">
        <CloseIcon color={white} onClick={handleClose} />
        <Title data-cy="ReferenceMaterial" skinType={skinType}>
          Reference {isQuestarSkin ? 'Guide' : 'Material'}
        </Title>
      </div>
      <ReferenceMaterialView
        zoomed={zoomed}
        isQuestarSkin={isQuestarSkin}
        isPdf={attributes?.type === fileTypes.PDF}
      >
        <div style={{ width: '100%', height: '100%' }}>{reference}</div>
      </ReferenceMaterialView>
      {isQuestarSkin && <ResizeIcon />}
    </RndWrapper>
  )
}

export default connect(null, { updateTestPlayer: updateTestPlayerAction })(
  ReferenceDocModal
)

const RndWrapper = styled(Rnd)`
  background: ${white};
  box-shadow: ${boxShadowDefault};
  z-index: 999;
`

const ReferenceMaterialView = styled.div`
  width: 100%;
  height: ${({ isQuestarSkin }) =>
    isQuestarSkin ? 'calc(100% - 45px)' : 'calc(100% - 35px)'};
  overflow-y: auto;
  overflow-x: ${({ isPdf, zoomed }) => !zoomed && isPdf && 'hidden'};
`

const Image = styled.img`
  height: auto;
  width: 100%;
  object-fit: cover;

  ${({ zoomLevel }) => {
    const zoomed = zoomLevel > 1 && zoomLevel !== undefined
    if (!zoomed) {
      return ''
    }

    return `
      transform: ${zoomed ? `scale(${zoomLevel})` : ''};
      transform-origin: ${zoomed ? `top left` : ''};
    `
  }};
`

const CloseIcon = styled(IconClose)`
  width: 30px;
  float: right;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 8px;
`

const titleStyles = {
  [playerSkinValues.quester.toLowerCase()]: css`
    background: ${quester.header2.background};
    color: ${quester.footer.textColor};
  `,
  [playerSkinValues.parcc.toLowerCase()]: css`
    background: ${parcc.breadcrumb.background};
    color: ${parcc.breadcrumb.color};
  `,
  [playerSkinValues.edulastic.toLowerCase()]: css`
    background: ${darkBlueSecondary};
    color: ${white};
  `,
}

const Title = styled.div`
  width: 100%;
  height: 35px;
  font-size: 16px;
  line-height: 35px;
  padding: 0 12px;
  font-weight: 600;
  text-align: left;
  cursor: move;
  ${({ skinType }) => titleStyles[skinType] || titleStyles.edulastic}
`

const PdfDocument = styled.div`
  background: ${themeLightGrayBgColor};

  canvas + canvas {
    margin-top: 24px;
  }
`

const ResizeIcon = styled(IconResize)`
  position: absolute;
  right: 2px;
  bottom: 2px;
`
