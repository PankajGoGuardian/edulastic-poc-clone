import React from 'react'
import { TableHeaderCellWrapper } from './styledComponents'

const TableHeaderCell = ({ title, value, color }) => {
  return (
    <TableHeaderCellWrapper color={color}>
      <span>{title}</span>
      <span>{value}</span>
    </TableHeaderCellWrapper>
  )
}

export default TableHeaderCell
