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

const CustomLabel = ({ showPopover, text }) => {
  if (showPopover) {
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
    if (isHomeSchool) {
      return calculatorKeys.filter(
        (k) => ![calculatorTypes.GRAPHING_STATE].includes(k)
      )
    }
    return calculatorKeys
  }, [isHomeSchool])

  const validState = isValidDesmosState(schoolState)

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
        const notAvailableStateVersion =
          item === calculatorTypes.GRAPHING_STATE && !validState

        const disableOption =
          notAvailableStateVersion ||
          // @see EV-34375
          (premium &&
            calculatorProvider !== 'DESMOS' &&
            ![calculatorTypes.NONE, calculatorTypes.BASIC].includes(item))

        return (
          <Select.Option
            data-cy="class"
            value={item}
            key={item}
            disabled={disableOption}
          >
            <CustomLabel
              text={calculators[item]}
              showPopover={notAvailableStateVersion}
            />
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
