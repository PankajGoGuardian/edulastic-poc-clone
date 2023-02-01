import React, { useMemo } from 'react'
import { Select } from 'antd'
import {
  CheckBoxGrp,
  CheckboxLabel,
  SelectInputStyled,
} from '@edulastic/common'

import { withCalcOptions } from '../../HOC/withCalcOptions'
import { LabelWithTooltip } from './LabelWithTooltip'

const CalculatorSettings = ({
  calcTypes,
  disabled,
  onChange,
  calcOptions,
  isCheckBoxGroup,
}) => {
  const [Wrapper, Option, mode] = useMemo(() => {
    if (isCheckBoxGroup) {
      return [CheckBoxGrp, CheckboxLabel, 'vertical']
    }
    return [SelectInputStyled, Select.Option, 'multiple']
  }, [isCheckBoxGroup])

  return (
    <Wrapper
      data-cy="calculatorSelector"
      onChange={onChange}
      value={calcTypes}
      disabled={disabled}
      mode={mode}
    >
      {calcOptions.map((item) => (
        <Option
          data-cy={item.id}
          value={item.id}
          key={item.id}
          disabled={item.disabled}
        >
          <LabelWithTooltip showPopover={item.showPopover} text={item.text} />
        </Option>
      ))}
    </Wrapper>
  )
}

export default withCalcOptions(CalculatorSettings)
