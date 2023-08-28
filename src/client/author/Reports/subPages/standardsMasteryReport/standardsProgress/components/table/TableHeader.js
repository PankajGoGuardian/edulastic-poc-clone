import React from 'react'

import { StyledH3 } from '../../../../../common/styled'

const TableHeader = ({ tableFilters }) => {
  return (
    <StyledH3>
      Standard Mastery Over Time by {tableFilters.compareBy.title}
    </StyledH3>
  )
}

export default TableHeader
