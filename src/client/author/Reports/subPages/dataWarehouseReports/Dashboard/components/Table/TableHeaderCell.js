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
    <TableHeaderCellWrapper
      color={color}
      isSelected={isSelected}
      isClickable={!!value}
    >
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
