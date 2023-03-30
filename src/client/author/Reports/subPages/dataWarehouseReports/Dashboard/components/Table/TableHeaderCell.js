import React from 'react'
import { TableHeaderCellWrapper } from '../common/styledComponents'

const TableHeaderCell = ({
  title,
  value,
  color,
  tableHeaderCellClick,
  isSelected,
}) => {
  return (
    <TableHeaderCellWrapper color={color} isSelected={isSelected}>
      <span>{title}</span>
      <span
        onClick={() => {
          tableHeaderCellClick()
        }}
      >
        {value}
      </span>
    </TableHeaderCellWrapper>
  )
}

export default TableHeaderCell
