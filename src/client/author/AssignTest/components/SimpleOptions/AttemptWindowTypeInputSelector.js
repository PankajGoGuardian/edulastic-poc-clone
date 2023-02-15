import React from 'react'
import { SelectInputStyled } from '@edulastic/common'
import { test as testConst } from '@edulastic/constants'
import { Select } from 'antd'

const { ATTEMPT_WINDOW_VALUE } = testConst

const AttemptWindowTypeInputSelector = ({
  selectedAttemptWindowType,
  handleChange,
}) => {
  return (
    <SelectInputStyled
      data-cy="selectAttemptWindow"
      placeholder="Please select"
      cache="false"
      value={selectedAttemptWindowType}
      onChange={handleChange}
    >
      {Object.keys(ATTEMPT_WINDOW_VALUE).map((key) => (
        <Select.Option data-cy="class" key={key} value={key}>
          {ATTEMPT_WINDOW_VALUE[key]}
        </Select.Option>
      ))}
    </SelectInputStyled>
  )
}

export default AttemptWindowTypeInputSelector
