import React from 'react'
import Query from './QueryBuilder'

const QueryBuilder = ({ showAdvanceSearch, setShowAdvanceSearch }) => {
  return (
    <Query
      showAdvanceSearch={showAdvanceSearch}
      setShowAdvanceSearch={setShowAdvanceSearch}
    />
  )
}

export default QueryBuilder
