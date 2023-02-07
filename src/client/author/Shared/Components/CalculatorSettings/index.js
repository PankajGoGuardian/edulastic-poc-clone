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
  const [Wrapper, Option, restProps] = useMemo(() => {
    if (isCheckBoxGroup) {
      return [CheckBoxGrp, CheckboxLabel, { mode: 'vertical' }]
    }
    return [
      CalculatorDropdown,
      Select.Option,
      {
        mode: 'multiple',
        placeholder: 'NONE',
        getPopupContainer: (triggerNode) => triggerNode.parentNode,
      },
    ]
  }, [isCheckBoxGroup])

  return (
    <Wrapper
      data-cy="calculatorSelector"
      onChange={onChange}
      value={calcTypes}
      disabled={disabled}
      {...restProps}
    >
      {calcOptions.map((item) => (
        <Option
          data-cy={item.id}
          value={item.id}
          key={item.id}
          disabled={[disabled, item.disabled].some((isDisabled) => isDisabled)}
        >
          <LabelWithTooltip showPopover={item.showPopover} text={item.text} />
        </Option>
      ))}
    </Wrapper>
  )
}

export default withCalcOptions(CalculatorSettings)
