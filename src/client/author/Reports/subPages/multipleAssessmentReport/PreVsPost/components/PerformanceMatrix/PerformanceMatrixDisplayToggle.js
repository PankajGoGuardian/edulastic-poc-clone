import React from 'react'
import { Radio } from 'antd'

const PerformanceMatrixDisplayToggle = ({ selected, selectCB, data }) => {
  const radioOptions = data.map(({ key, title }) => {
    return (
      <Radio key={key} value={key}>
        {title}
      </Radio>
    )
  })
  return (
    <Radio.Group value={selected} onChange={(e) => selectCB(e.target.value)}>
      {radioOptions}
    </Radio.Group>
  )
}

export default PerformanceMatrixDisplayToggle
