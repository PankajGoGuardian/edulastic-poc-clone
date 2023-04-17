import React from 'react'
import Popover from 'antd/lib/popover'
import { themeColor } from '@edulastic/colors'

const Tooltip = ({ value, record }) => {
  return (
    <Popover
      overlayClassName="gi-popover"
      placement="right"
      content={
        <div className="content">
          <p>Goal name:</p>
          <b>{record.name}</b>
          <p>Metric type:</p>
          <b>Average</b>
          <p>Applicable to:</p>
          <b>RL.1, RL. 2</b>
          <p>Threshold:</p>
          <b>80%</b>
        </div>
      }
      arrow={false}
    >
      <p style={{ color: themeColor }}>{value}</p>
    </Popover>
  )
}

export default Tooltip
