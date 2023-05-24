import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { test as testConstants } from '@edulastic/constants'
import { isValidDesmosState } from '@edulastic/common'
import { getCalcTypesSelector } from '../../TestPage/ducks'
import {
  getCurrentSchoolState,
  isHomeSchoolSelector,
  isDesmosCalculatorEnabledSelector,
} from '../../src/selectors/user'

const { calculators } = testConstants

export const withCalcOptions = (WrappedComponent) => {
  const hocComponent = ({
    value,
    isHomeSchool,
    schoolState,
    setTestData,
    isDesmosCalculatorEnabled,
    ...hocProps
  }) => {
    const calcOptions = useMemo(() => {
      return Object.keys(calculators)
        .filter((x) =>
          isHomeSchool ? !calculators[x].stateVersionOnly : calculators[x]
        )
        .map((calculatorId) => {
          const item = calculators[calculatorId]
          const hasPopover =
            item.id == calculators.GRAPHING_STATE.id &&
            !isValidDesmosState(schoolState)

          // @see EV-34375
          const disableOption =
            hasPopover ||
            (item.id !== calculators.BASIC.id && !isDesmosCalculatorEnabled)

          return {
            disabled: disableOption,
            id: item.id,
            showPopover: hasPopover,
            text: isHomeSchool ? item.homeText ?? item.text : item.text,
          }
        })
    }, [isHomeSchool, schoolState])

    return (
      <WrappedComponent
        {...hocProps}
        calcOptions={calcOptions}
        calcTypes={value || []}
      />
    )
  }

  return connect((state) => ({
    calcTypes: getCalcTypesSelector(state),
    schoolState: getCurrentSchoolState(state),
    isHomeSchool: isHomeSchoolSelector(state),
    isDesmosCalculatorEnabled: isDesmosCalculatorEnabledSelector(state),
  }))(hocComponent)
}
