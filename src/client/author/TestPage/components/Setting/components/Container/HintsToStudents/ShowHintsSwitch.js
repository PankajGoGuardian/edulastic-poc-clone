import React from 'react'
import { EduSwitchStyled } from '@edulastic/common'

import { hintsSwitchTestId } from './constants'

export default ({ disabled, checked, onChangeHandler }) => {
  return (
    <EduSwitchStyled
      disabled={disabled}
      checked={checked}
      onChange={onChangeHandler}
      data-cy="show-hints-to-students-switch"
      data-testid={hintsSwitchTestId}
    />
  )
}
