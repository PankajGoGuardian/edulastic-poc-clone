import React from 'react'
import Demo from './demo/demo'

import 'react-awesome-query-builder/lib/css/styles.css'

const QueryBuilder = ({ showAdvanceSearch, setShowAdvanceSearch }) => {
  return (
    <Demo
      showAdvanceSearch={showAdvanceSearch}
      setShowAdvanceSearch={setShowAdvanceSearch}
    />
  )
}

export default QueryBuilder
