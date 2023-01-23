import React from 'react'
import Query from './QueryBuilder'

const QueryBuilder = ({
  showAdvanceSearch,
  setShowAdvanceSearchModal,
  setSaveQuickFilter,
}) => {
  return (
    <Query
      showAdvanceSearch={showAdvanceSearch}
      setShowAdvanceSearchModal={setShowAdvanceSearchModal}
      setSaveQuickFilter={setSaveQuickFilter}
    />
  )
}

export default QueryBuilder
