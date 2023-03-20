import React from 'react'
import { TableHeaderCellWrapper } from '../common/styledComponents'

const TableHeaderCell = ({
  title,
  value,
  color,
  onTableHeaderCellClick,
  cellKey,
  isSelected,
}) => {
  return (
    <TableHeaderCellWrapper color={color} isSelected={isSelected}>
      <span>{title}</span>
      <span
        onClick={() => {
          onTableHeaderCellClick(cellKey)
        }}
      >
        {value}
      </span>
    </TableHeaderCellWrapper>
  )
}

export default TableHeaderCell
