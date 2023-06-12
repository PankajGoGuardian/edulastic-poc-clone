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
      onClick={() => {
        tableHeaderCellClick()
      }}
    >
      <div>
        <IconCircleCheck width={18} color={greyThemeDark1} checkColor={white} />
        <span>{title}</span>
      </div>
      <div>{value}</div>
    </TableHeaderCellWrapper>
  )
}

export default TableHeaderCell
