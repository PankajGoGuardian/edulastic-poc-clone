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

const RadioButton = ({
  itemKey,
  schoolState,
  calculatorProvider,
  premium,
  isHomeSchool,
}) => {
  const showPopover = useMemo(() => {
    return (
      itemKey === calculatorTypes.GRAPHING_STATE &&
      !isValidDesmosState(schoolState)
    )
  }, [itemKey, schoolState])

  const disableOption =
    showPopover ||
    // @see EV-34375
    (premium &&
      calculatorProvider !== 'DESMOS' &&
      ![calculatorTypes.NONE, calculatorTypes.BASIC].includes(itemKey))

  const optLabel = useMemo(() => {
    if (isHomeSchool && itemKey === 'GRAPHING') {
      return 'Graphing'
    }
    return calculators[itemKey]
  }, [isHomeSchool, itemKey])

  if (showPopover) {
    return (
      <Tooltip title="State information missing, please raise a support request at support@edulastic.com">
        <RadioBtn data-cy={itemKey} value={itemKey} disabled>
          {optLabel}
        </RadioBtn>
      </Tooltip>
    )
  }

  return (
    <RadioBtn data-cy={itemKey} value={itemKey} disabled={disableOption}>
      {optLabel}
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
    if (isHomeSchool) {
      return calculatorKeys.filter(
        (k) => ![calculatorTypes.GRAPHING_STATE].includes(k)
      )
    }
    return calculatorKeys
  }, [isHomeSchool])

  return (
    <StyledRadioGroup
      disabled={disabled}
      onChange={onChangeHandle}
      value={calcType}
    >
      {calcKeys.map((item) => (
        <RadioButton
          schoolState={schoolState}
          itemKey={item}
          key={item}
          isHomeSchool={isHomeSchool}
          calculatorProvider={calculatorProvider}
          premium={premium}
        />
      ))}
    </StyledRadioGroup>
  )
}

export default connect((state) => ({
  schoolState: getCurrentSchoolState(state),
  isHomeSchool: isHomeSchoolSelector(state),
}))(CalculatorSetting)
