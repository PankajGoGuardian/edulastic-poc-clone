import React from 'react'
import { Tooltip } from '../../../../common/utils/helpers'
import { ButtonWithStyle } from './styled-components'

export const ActionButton = ({ title, icon, ...rest }) => (
  <Tooltip placement="top" title={title}>
    <ButtonWithStyle {...rest}>{icon}</ButtonWithStyle>
  </Tooltip>
)
