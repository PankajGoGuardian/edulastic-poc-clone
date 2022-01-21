import React from 'react'
import { Select, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { test } from '@edulastic/constants'
import { SelectInputStyled, isValidDesmosState } from '@edulastic/common'
import { Label } from './styled'
import { getCurrentSchoolState } from '../../../src/selectors/user'

const { calculators, calculatorTypes } = test

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
  calculatorKeysAvailable,
}) => {
  return (
    <SelectInputStyled
      data-cy="calculatorSelector"
      cache="false"
      height="30px"
      value={calcType}
      onChange={onChangeHanlde}
      disabled={disabled}
    >
      {calculatorKeysAvailable.map((item) => {
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
  schoolState: getCurrentSchoolState(state),
}))(CalculatorSelector)
