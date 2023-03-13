import React from 'react'
import { Tooltip } from 'antd'

import { IconInfo } from '@edulastic/icons'

const AvgStandardPerformanceTitle = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <span>Avg. Standard Performance</span>
    <Tooltip title="This is the average performance across all the standards assessed">
      <IconInfo height={10} />
    </Tooltip>
  </div>
)

export default AvgStandardPerformanceTitle
