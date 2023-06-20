import React from 'react'

import { themeColor } from '@edulastic/colors'
import { IconWrapper } from '../../common/components/StyledComponents'

const TableActionIcon = ({
  IconComponent,
  onClick,
  disabled,
  onDisabledClick,
}) => (
  <IconWrapper
    onClick={disabled ? onDisabledClick : onClick}
    $disabled={disabled}
  >
    <IconComponent color={themeColor} size="18px" />
  </IconWrapper>
)

export default TableActionIcon
