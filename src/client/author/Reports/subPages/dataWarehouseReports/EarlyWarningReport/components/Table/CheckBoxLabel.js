import React from 'react'
import { CustomStyledCell } from '../common/styledComponents'

const CheckBoxLabel = ({ value }) => {
  return (
    <CustomStyledCell color={value.color} width="65px" fontSize="11px">
      {value.level}
    </CustomStyledCell>
  )
}

export default CheckBoxLabel
