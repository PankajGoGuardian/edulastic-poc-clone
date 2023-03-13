import React from 'react'

const StandardTitle = ({ standardName, standardOverallPerformance }) => (
  <>
    <span>{standardName}</span>
    <br />
    <span>{standardOverallPerformance}</span>
  </>
)

export default StandardTitle
