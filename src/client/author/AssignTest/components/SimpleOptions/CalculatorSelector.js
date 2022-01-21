import React, { useMemo } from 'react'
import { Select, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { test } from '@edulastic/constants'
import { SelectInputStyled, isValidDesmosState } from '@edulastic/common'
import { Label } from './styled'
import {
  isHomeSchoolSelector,
  getCurrentSchoolState,
} from '../../../src/selectors/user'

const { calculatorKeys, calculators, calculatorTypes } = test

const CustomLabel = ({ disabled, text }) => {
  if (disabled) {
    return (
      <Tooltip
        placement="right"
        title="State information missing, please raise a support request at support@edulastic.com"
      >
        <Label>{text}</Label>
      </Tooltip>
    )
  }

  return <Label>{text}</Label>
}

const CalculatorSelector = ({
  disabled,
  calcType,
  onChangeHanlde,
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
    <SelectInputStyled
      data-cy="calculatorSelector"
      cache="false"
      height="30px"
      value={calcType}
      onChange={onChangeHanlde}
      disabled={disabled}
    >
      {calcKeys.map((item) => {
        const disableOption =
          item === calculatorTypes.GRAPHING_STATE &&
          !isValidDesmosState(schoolState)
        return (
          <Select.Option
            data-cy="class"
            value={item}
            key={item}
            disabled={disableOption}
          >
            <CustomLabel disabled={disableOption} text={calculators[item]} />
          </Select.Option>
        )
      })}
    </SelectInputStyled>
  )
}

export default connect((state) => ({
  isHomeSchool: isHomeSchoolSelector(state),
  schoolState: getCurrentSchoolState(state),
}))(CalculatorSelector)
