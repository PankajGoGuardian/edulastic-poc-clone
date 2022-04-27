import React, { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { Rnd } from 'react-rnd'
import { white, darkBlueSecondary, boxShadowDefault } from '@edulastic/colors'
import { IconClose, IconResize } from '@edulastic/icons'
import { fileTypes, test } from '@edulastic/constants'

import { updateTestPlayerAction } from '../../../author/sharedDucks/testPlayer'
import { themes } from '../../../theme'
import PdfView from './ReferenceMaterial/PdfView'

const { playerSkinValues } = test
const {
  playerSkin: { quester },
} = themes

const initSetting = { x: 120, y: 120, width: 600, height: 500 }

const imageTypes = [fileTypes.PNG, fileTypes.GIF, fileTypes.JPEG, fileTypes.JPG]

export const ReferenceDocModal = ({
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
      return (
        <PdfView
          data-testid="pdf-view-component"
          uri={source}
          size={size}
          zoomLevel={zoomLevel}
        />
      )
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
      data-testid="reference-material-modal"
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
        <div data-testid="reference" style={{ width: '100%', height: '100%' }}>
          {reference}
        </div>
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
const ResizeIcon = styled(IconResize)`
  position: absolute;
  right: 2px;
  bottom: 2px;
`
