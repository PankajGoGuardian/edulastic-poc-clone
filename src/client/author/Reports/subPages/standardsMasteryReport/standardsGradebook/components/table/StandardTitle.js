import React from 'react'
import { Tooltip } from 'antd'

const StandardTitle = ({
  standardName,
  standardDesc,
  standardOverallPerformance,
}) => (
  <Tooltip title={standardDesc}>
    <span>{standardName}</span>
    <br />
    <span>{standardOverallPerformance}</span>
  </Tooltip>
)

export default StandardTitle
