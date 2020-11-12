import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { test, questionType } from '@edulastic/constants'
import {
  IconCalculator,
  IconClose,
  IconScratchPad,
  IconMagnify,
  IconCloudUpload,
} from '@edulastic/icons'
import { Tooltip } from '../../../../common/utils/helpers'
import { Container, StyledButton, StyledIcon } from './styled'
import TimedTestTimer from '../../common/TimedTestTimer'
import { enableUpdate } from '@edulastic/ext-libs/src/pdf-annotate'

const { calculatorTypes, SHOW_USER_WORK } = test

const zoomIndex = [1, 1.5, 1.75, 2.5, 3]

const ToolBar = ({
  settings = {},
  tool = [],
  changeCaculateMode,
  changeTool,
  qType,
  setZoomLevel,
  zoomLevel,
  isDocbased,
  handleMagnifier,
  toggleUserWorkUploadModal,
  showMagnifier,
  enableMagnifier,
  timedAssignment,
  utaId,
  groupId,
  header,
}) => {
  const [zoom, setZoom] = useState(0)
  const toolbarHandler = (value) => changeTool(value)

  const handleCalculateMode = (value) => {
    changeTool(2)
    changeCaculateMode(value)
  }

  const { calcType, showUserWork } = settings
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE
  const handleZoomIn = () => {
    if (zoom !== zoomIndex.length - 1) {
      setZoomLevel(zoomIndex[zoom + 1])
      setZoom(zoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (zoom !== 0) {
      setZoomLevel(zoomIndex[zoom - 1])
      setZoom(zoom - 1)
    }
  }

  return (
    <Container className="sbac-toolbar">
      {calcType !== calculatorTypes.NONE && (
        <Tooltip placement="top" title="Calculator">
          <StyledButton
            active={tool.indexOf(2) !== -1}
            onClick={() => toolbarHandler(2)}
          >
            <CaculatorIcon />
          </StyledButton>
        </Tooltip>
      )}

      {!isDocbased && (
        <Tooltip
          placement="top"
          title={
            isDisableCrossBtn
              ? 'This option is available only for multiple choice'
              : 'Crossout'
          }
        >
          <StyledButton
            active={tool.indexOf(3) !== -1}
            disabled={isDisableCrossBtn}
            onClick={() => toolbarHandler(3)}
          >
            <CloseIcon />
          </StyledButton>
        </Tooltip>
      )}

      {!isDocbased && showUserWork === SHOW_USER_WORK.SCRATCHPAD && (
        <Tooltip placement="top" title="Scratch Pad">
          <StyledButton
            active={tool.indexOf(5) !== -1}
            onClick={() => toolbarHandler(5)}
          >
            <ScratchPadIcon />
          </StyledButton>
        </Tooltip>
      )}
      {!isDocbased && showUserWork === SHOW_USER_WORK.UPLOAD && (
        <Tooltip placement="top" title="Upload Work">
          <StyledButton onClick={toggleUserWorkUploadModal}>
            <IconCloudUpload />
          </StyledButton>
        </Tooltip>
      )}
      {!isDocbased && (
        <Tooltip placement="top" title="Zoom in">
          <StyledButton onClick={handleZoomIn}>
            <StyledIcon type="zoom-in" />
          </StyledButton>
        </Tooltip>
      )}
      {!isDocbased && (
        <Tooltip placement="top" title="Zoom out">
          <StyledButton onClick={handleZoomOut}>
            <StyledIcon type="zoom-out" />
          </StyledButton>
        </Tooltip>
      )}
      {showMagnifier && (
        <Tooltip placement="top" title="Magnify">
          <StyledButton onClick={handleMagnifier} active={enableMagnifier}>
            <IconMagnify />
          </StyledButton>
        </Tooltip>
      )}
      {timedAssignment && (
        <TimedTestTimer
          utaId={utaId}
          groupId={groupId}
          fgColor={header?.logoColor}
        />
      )}
    </Container>
  )
}

ToolBar.propTypes = {
  changeCaculateMode: PropTypes.func.isRequired,
  tool: PropTypes.array.isRequired,
  changeTool: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  qType: PropTypes.string.isRequired,
}

export default ToolBar

export const CaculatorIcon = styled(IconCalculator)`
  ${({ theme }) => `
    width: ${theme.default.headerCaculatorIconWidth};
    height: ${theme.default.headerCaculatorIconHeight};
  `}
`

const CloseIcon = styled(IconClose)`
  ${({ theme }) => `
    width: ${theme.default.headerCloseIconWidth};
    height: ${theme.default.headerCloseIconHeight};
  `}
`

const ScratchPadIcon = styled(IconScratchPad)`
  ${({ theme }) => `
    width: ${theme.default.headerScratchPadIconWidth};
    height: ${theme.default.headerScratchPadIconHeight};
  `}
`
