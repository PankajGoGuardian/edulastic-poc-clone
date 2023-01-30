import React from 'react'
import Query from './QueryBuilder'

const QueryBuilder = ({ showAdvanceSearch, setShowAdvanceSearchModal }) => {
  return (
    <Query
      showAdvanceSearch={showAdvanceSearch}
      setShowAdvanceSearchModal={setShowAdvanceSearchModal}
    />
  )
}

export default QueryBuilder
