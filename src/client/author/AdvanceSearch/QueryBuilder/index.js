import React from 'react'
import Query from './components/QueryBuilder'

const QueryBuilder = ({ showAdvanceSearch, setShowAdvanceSearchModal }) => {
  return (
    <Query
      showAdvanceSearch={showAdvanceSearch}
      setShowAdvanceSearchModal={setShowAdvanceSearchModal}
    />
  )
}

export default QueryBuilder
