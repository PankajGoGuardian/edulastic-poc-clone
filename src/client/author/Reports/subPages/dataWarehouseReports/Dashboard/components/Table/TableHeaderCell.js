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
      onClick={() => {
        tableHeaderCellClick()
      }}
    >
      <div>{title}</div>
      <div>{value}</div>
    </TableHeaderCellWrapper>
  )
}

export default TableHeaderCell
