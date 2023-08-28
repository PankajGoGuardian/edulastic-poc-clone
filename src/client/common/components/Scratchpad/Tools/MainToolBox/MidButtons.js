import React from 'react'
import PropTypes from 'prop-types'
import { FlexContainer } from '@edulastic/common'
import { StyledButton } from '../styled'
import { midControls } from '../constants/controls'

const MidButtons = ({ onChangeTool, activeMode }) => {
  const onClickHandler = (mode) => () => {
    onChangeTool(mode)
  }

  return (
    <FlexContainer>
      {midControls.map((btn) => (
        <StyledButton
          key={btn.mode}
          id={btn.mode}
          pos={btn.pos}
          aria-label={btn.label}
          onClick={onClickHandler(btn.mode)}
          selected={activeMode === btn.mode}
          aria-selected={activeMode === btn.mode}
        >
          <span />
        </StyledButton>
      ))}
    </FlexContainer>
  )
}

MidButtons.propTypes = {
  onChangeTool: PropTypes.func,
  activeMode: PropTypes.string,
}

MidButtons.defaultProps = {
  onChangeTool: () => null,
  activeMode: '',
}

export default MidButtons
