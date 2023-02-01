import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { test as testConstants } from '@edulastic/constants'
import { isValidDesmosState } from '@edulastic/common'
import { getCalcTypesSelector } from '../../TestPage/ducks'
import {
  getCurrentSchoolState,
  isHomeSchoolSelector,
} from '../../src/selectors/user'

const { calculators } = testConstants

export const withCalcOptions = (WrappedComponent) => {
  const hocComponent = ({
    value,
    calculatorProvider,
    isHomeSchool,
    premium,
    schoolState,
    setTestData,
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
            (premium &&
              calculatorProvider !== 'DESMOS' &&
              item.id !== calculators.BASIC.id)

          return {
            disabled: disableOption,
            id: item.id,
            showPopover: hasPopover,
            text: isHomeSchool ? item.homeText : item.text,
          }
        })
    }, [calculatorProvider, isHomeSchool, premium, schoolState])

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
    calculatorProvider: state?.user?.user?.features?.calculatorProvider,
    premium: state?.user?.user?.features?.premium,
  }))(hocComponent)
}
