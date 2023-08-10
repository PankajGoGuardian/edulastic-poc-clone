import React from 'react'
import PropTypes from 'prop-types'
import { FlexContainer } from '@edulastic/common'

import { StyledButton } from '../styled'
import { leftControls } from '../constants/controls'

const LeftButtons = ({ onChangeTool, activeMode }) => {
  const onClickHandler = (mode) => () => {
    onChangeTool(mode)
  }

  return (
    <FlexContainer>
      {leftControls.map((btn, idx) => (
        <StyledButton
          key={btn.mode}
          id={btn.mode}
          pos={btn.pos}
          onClick={onClickHandler(btn.mode)}
          selected={activeMode === btn.mode || (!activeMode && idx === 0)}
          aria-selected={activeMode === btn.mode || (!activeMode && idx === 0)}
        >
          <span />
        </StyledButton>
      ))}
    </FlexContainer>
  )
}

LeftButtons.propTypes = {
  onChangeTool: PropTypes.func,
  activeMode: PropTypes.string,
}

LeftButtons.defaultProps = {
  onChangeTool: () => null,
  activeMode: '',
}

export default LeftButtons
