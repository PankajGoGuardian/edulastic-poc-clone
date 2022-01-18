import React, { useMemo } from 'react'
import { Tooltip } from 'antd'
import { RadioBtn, isValidDesmosState } from '@edulastic/common'
import { test as testContants } from '@edulastic/constants'
import { StyledRadioGroup } from './styled'

const { calculators, calculatorTypes } = testContants

const RadioButton = ({ itemKey, schoolState }) => {
  const disabled = useMemo(() => {
    return (
      itemKey === calculatorTypes.GRAPHING_STATE &&
      !isValidDesmosState(schoolState)
    )
  }, [itemKey, schoolState])

  if (disabled) {
    return (
      <Tooltip title="State information missing, please raise a support request at support@edulastic.com">
        <RadioBtn data-cy={itemKey} value={itemKey} disabled={disabled}>
          {calculators[itemKey]}
        </RadioBtn>
      </Tooltip>
    )
  }

  return (
    <RadioBtn data-cy={itemKey} value={itemKey}>
      {calculators[itemKey]}
    </RadioBtn>
  )
}

const CalculatorSetting = ({
  onChangeHandle,
  disabled,
  calculatorKeysAvailable,
  calcType,
  schoolState,
}) => {
  return (
    <StyledRadioGroup
      disabled={disabled}
      onChange={onChangeHandle}
      value={calcType}
    >
      {calculatorKeysAvailable.map((item) => (
        <RadioButton schoolState={schoolState} itemKey={item} key={item} />
      ))}
    </StyledRadioGroup>
  )
}

export default CalculatorSetting
