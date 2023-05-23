import React from 'react'
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
      <div>{title}</div>
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
