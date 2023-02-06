import React from 'react'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { SingleCalculatorIcon, MultiCalculatorIcon } from './styled-components'

export const CalculatorIconWrapper = ({ isMultiCalculators }) => {
  return (
    <EduIf condition={isMultiCalculators}>
      <EduThen>
        <MultiCalculatorIcon className="multi-calculators" />
      </EduThen>
      <EduElse>
        <SingleCalculatorIcon />
      </EduElse>
    </EduIf>
  )
}
