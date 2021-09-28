import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Rnd } from 'react-rnd'
import { Document, Page } from 'react-pdf'
import { white, darkBlueSecondary, boxShadowDefault } from '@edulastic/colors'
import { IconClose, IconDownload } from '@edulastic/icons'
import { fileTypes } from '@edulastic/constants'
import { updateTestPlayerAction } from '../../../author/sharedDucks/testPlayer'

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
}
const PdfView = ({ uri, size }) => {
  const [numPages, setNumPages] = useState(null)
  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages)
  }
  return (
    <Document
      file={uri}
      options={options}
      loading=""
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} width={size} />
      ))}
    </Document>
  )
}

const initSetting = { x: 120, y: 120, width: 600, height: 500 }

const imageTypes = [fileTypes.PNG, fileTypes.GIF, fileTypes.JPEG, fileTypes.JPG]

const ReferenceDocModal = ({ attributes, updateTestPlayer }) => {
  const [size, setSize] = useState(600)
  const handleClose = () => {
    updateTestPlayer({ isShowReferenceModal: false })
  }

  const handleDownload = () => {
    if (!attributes) {
      return null
    }
    const { source, name } = attributes
    const link = document.createElement('a')
    link.setAttribute('target', '_blank')
    link.setAttribute('href', source)
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
      return <Image src={source} />
    }
    if (type === fileTypes.PDF) {
      return <PdfView uri={source} size={size} />
    }
    return null
  }, [attributes, size])

  return (
    <RndWrapper
      default={initSetting}
      onResizeStop={handleResizeStop}
      dragHandleClassName="reference-material-drag-handler"
    >
      <div className="reference-material-drag-handler">
        <CloseIcon color={white} onClick={handleClose} />
        <DownloadIcon color={white} onClick={handleDownload} />
        <Title data-cy="ReferenceMaterial">Reference Material</Title>
      </div>
      <ReferenceMaterialView isPdf={attributes?.type === fileTypes.PDF}>
        {reference}
      </ReferenceMaterialView>
    </RndWrapper>
  )
}

export default connect(null, { updateTestPlayer: updateTestPlayerAction })(
  ReferenceDocModal
)

const RndWrapper = styled(Rnd)`
  background: ${white};
  box-shadow: ${boxShadowDefault};
  z-index: 1500;
`

const ReferenceMaterialView = styled.div`
  width: 100%;
  height: calc(100% - 35px);
  overflow-y: auto;
  overflow-x: ${({ isPdf }) => isPdf && 'hidden'};
`

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`

const CloseIcon = styled(IconClose)`
  width: 30px;
  float: right;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 8px;
`

const DownloadIcon = styled(IconDownload)`
  width: 30px;
  float: right;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 4px;

  path {
    fill: ${white};
  }
`

const Title = styled.div`
  width: 100%;
  height: 35px;
  background: ${darkBlueSecondary};
  color: ${white};
  font-size: 16px;
  line-height: 35px;
  padding: 0 12px;
  font-weight: 600;
  text-align: left;
  cursor: move;
`
