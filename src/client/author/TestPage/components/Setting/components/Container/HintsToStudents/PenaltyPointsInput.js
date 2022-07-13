import React from 'react'
import clamp from 'lodash/clamp'
import { notification, TextInputStyled } from '@edulastic/common'
import { penaltyPointsInputTestId } from './constants'

export default ({ penaltyOnUsingHints, updatePenaltyPoints, disabled }) => {
  const inputValue = penaltyOnUsingHints === 0 ? undefined : penaltyOnUsingHints

  const handleChangePenaltyPoints = (event) => {
    const points = parseFloat(event.target.value)
    if (Number.isNaN(points)) {
      return
    }
    updatePenaltyPoints(points)
  }

  const handleOnBlur = (event) => {
    const points = parseFloat(event.target.value)
    if (Number.isNaN(points)) {
      notification({
        msg: 'only numbers in the range 1 to 100 are accepted',
      })
    }
    updatePenaltyPoints(clamp(points, 1, 100))
  }

  return (
    <TextInputStyled
      data-testid={penaltyPointsInputTestId}
      value={inputValue}
      placeholder="Insert a value"
      type="number"
      width="135px"
      data-cy="penaltyOnUsingHints"
      onChange={handleChangePenaltyPoints}
      onBlur={handleOnBlur}
      disabled={disabled}
      min={1}
      max={100}
    />
  )
}
