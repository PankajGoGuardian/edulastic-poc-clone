import React from 'react'
import Demo from './demo/demo'

const QueryBuilder = ({ showAdvanceSearch, setShowAdvanceSearch }) => {
  return (
    <Demo
      showAdvanceSearch={showAdvanceSearch}
      setShowAdvanceSearch={setShowAdvanceSearch}
    />
  )
}

export default QueryBuilder
