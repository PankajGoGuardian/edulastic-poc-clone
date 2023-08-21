import React from 'react'
import PropTypes from 'prop-types'

import { FlexContainer } from '@edulastic/common'
import { drawTools } from '@edulastic/constants'

import { StyledButton } from '../styled'
import { rightControls } from '../constants/controls'
import HideShowDataController from './ToggleScratchpadDataButton'

const RightButtons = ({ onChangeTool, deleteMode, canRedo, canUndo }) => {
  const onClickHandler = (mode) => () => {
    onChangeTool(mode)
  }

  return (
    <FlexContainer>
      <HideShowDataController />
      {rightControls.map((btn) => (
        <StyledButton
          key={btn.mode}
          id={btn.mode}
          pos={btn.pos}
          aria-label={btn.label}
          disabled={
            (!canRedo && btn.mode === drawTools.REDO_TOOL) ||
            (!canUndo && btn.mode === drawTools.UNDO_TOOL)
          }
          onClick={onClickHandler(btn.mode)}
          selected={deleteMode && btn.mode === drawTools.DELETE_TOOL}
          aria-selected={deleteMode && btn.mode === drawTools.DELETE_TOOL}
        >
          <span />
        </StyledButton>
      ))}
    </FlexContainer>
  )
}

RightButtons.propTypes = {
  onChangeTool: PropTypes.func,
}

RightButtons.defaultProps = {
  onChangeTool: () => null,
}

export default RightButtons
