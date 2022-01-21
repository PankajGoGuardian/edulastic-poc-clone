import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Tooltip } from 'antd'
import { RadioBtn, isValidDesmosState } from '@edulastic/common'
import { test as testContants } from '@edulastic/constants'
import {
  getCurrentSchoolState,
  isHomeSchoolSelector,
} from '../../../../../src/selectors/user'
import { StyledRadioGroup } from './styled'

const { calculators, calculatorTypes, calculatorKeys } = testContants

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
  calcType,
  schoolState,
  premium,
  calculatorProvider,
  isHomeSchool,
}) => {
  const calcKeys = useMemo(() => {
    if (premium && calculatorProvider !== 'DESMOS') {
      return calculatorKeys.filter((k) =>
        [calculatorTypes.NONE, calculatorTypes.BASIC].includes(k)
      )
    }

    if (isHomeSchool) {
      return calculatorKeys.filter(
        (k) => ![calculatorTypes.GRAPHING_STATE].includes(k)
      )
    }
    return calculatorKeys
  }, [premium, calculatorProvider, isHomeSchool])

  return (
    <StyledRadioGroup
      disabled={disabled}
      onChange={onChangeHandle}
      value={calcType}
    >
      {calcKeys.map((item) => (
        <RadioButton schoolState={schoolState} itemKey={item} key={item} />
      ))}
    </StyledRadioGroup>
  )
}

export default connect((state) => ({
  schoolState: getCurrentSchoolState(state),
  isHomeSchool: isHomeSchoolSelector(state),
}))(CalculatorSetting)
