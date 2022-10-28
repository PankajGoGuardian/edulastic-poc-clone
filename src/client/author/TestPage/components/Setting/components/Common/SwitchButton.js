import React from 'react'
import PropTypes from 'prop-types'
import { EduSwitchStyled } from '@edulastic/common'
import { settingSwitchButtonTestId } from './constants'

const SwitchButton = ({ disabled, checked, onChangeHandler }) => {
  return (
    <EduSwitchStyled
      disabled={disabled}
      checked={checked}
      onChange={onChangeHandler}
      data-testid={settingSwitchButtonTestId}
      data-cy="allowTtsForPassage"
    />
  )
}

SwitchButton.propTypes = {
  disabled: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
}

SwitchButton.defaultProps = {
  disabled: false,
}

export default SwitchButton
