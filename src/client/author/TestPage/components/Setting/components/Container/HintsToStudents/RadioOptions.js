import React, { useEffect, useState } from 'react'

import { RadioBtn } from '@edulastic/common'

import PenaltyPointsInput from './PenaltyPointsInput'
import { radioOptionTestId } from './constants'
import { RadioWrapper } from './styled'
import { Tooltip } from '../../../../../../../common/utils/helpers'

export default ({
  disabled,
  penaltyOnUsingHints,
  updatePenaltyPoints,
  isAssignPage,
}) => {
  const [radioValue, updateRadioValue] = useState('noPenalty')

  useEffect(() => {
    updateRadioValue(penaltyOnUsingHints > 0 ? 'withPenalty' : 'noPenalty')
  }, [penaltyOnUsingHints])

  const handleChangeRadio = (event) => {
    const choice = event.target.value
    updateRadioValue(choice)
    if (choice === 'noPenalty' && penaltyOnUsingHints > 0) {
      updatePenaltyPoints(0)
    }
  }

  return (
    <RadioWrapper flexDirection="column" isAssignPage={isAssignPage}>
      <Tooltip
        placement="left"
        title="Students will not be penalized for using hints while attempting the assignment"
      >
        <RadioBtn
          data-testid={radioOptionTestId}
          value="noPenalty"
          data-cy="noPenalty"
          key="noPenalty"
          name="penaltyOptions"
          onChange={handleChangeRadio}
          checked={radioValue === 'noPenalty'}
          disabled={disabled}
        >
          No Penalty
        </RadioBtn>
      </Tooltip>

      <Tooltip
        placement="left"
        title="Students will be penalized for using hints while attempting the assignment"
      >
        <RadioBtn
          data-testid={radioOptionTestId}
          value="withPenalty"
          data-cy="withPenalty"
          key="withPenalty"
          name="penaltyOptions"
          onChange={handleChangeRadio}
          checked={radioValue === 'withPenalty'}
          disabled={disabled}
        >
          Penalize{' '}
          <PenaltyPointsInput
            penaltyOnUsingHints={penaltyOnUsingHints}
            updatePenaltyPoints={updatePenaltyPoints}
            disabled={radioValue !== 'withPenalty' || disabled}
          />{' '}
          % on using Hint
        </RadioBtn>
      </Tooltip>
    </RadioWrapper>
  )
}
