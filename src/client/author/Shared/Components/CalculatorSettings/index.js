import React, { useMemo } from 'react'
import { Select } from 'antd'
import { CheckBoxGrp, CheckboxLabel } from '@edulastic/common'

import { LabelWithTooltip } from './LabelWithTooltip'
import { withCalcOptions } from '../../HOC/withCalcOptions'
import { CalculatorDropdown } from './styled-components'

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
    return [CalculatorDropdown, Select.Option, 'multiple']
  }, [isCheckBoxGroup])

  return (
    <Wrapper
      data-cy="calculatorSelector"
      onChange={onChange}
      value={calcTypes}
      disabled={disabled}
      placeholder="NONE"
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
