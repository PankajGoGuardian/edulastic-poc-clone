import React from 'react'
import { greyThemeDark1, white } from '@edulastic/colors'
import { IconCircleCheck } from '@edulastic/icons'
import { TableHeaderCellWrapper } from '../common/styledComponents'

const TableHeaderCell = ({
  title,
  value,
  color,
  tableHeaderCellClick,
  isSelected,
  borderColor,
}) => {
  return (
    <TableHeaderCellWrapper
      color={color}
      isSelected={isSelected}
      isClickable={!!value}
      borderColor={borderColor}
    >
      <div>
        <IconCircleCheck width={18} color={greyThemeDark1} checkColor={white} />
        <span>{title}</span>
      </div>
      <div
        onClick={() => {
          tableHeaderCellClick()
        }}
      >
        {value}
      </div>
    </TableHeaderCellWrapper>
  )
}

export default TableHeaderCell
