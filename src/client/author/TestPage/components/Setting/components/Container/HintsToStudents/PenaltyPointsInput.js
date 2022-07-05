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
        msg: 'Only numbers in the range 1 to 100 are accepted',
      })
      return
    }
    updatePenaltyPoints(clamp(points, 1, 100))
  }

  return (
    <TextInputStyled
      data-testid={penaltyPointsInputTestId}
      value={inputValue}
      placeholder="value"
      type="number"
      width="85px"
      data-cy="penaltyOnUsingHints"
      onChange={handleChangePenaltyPoints}
      onBlur={handleOnBlur}
      disabled={disabled}
      min={1}
      max={100}
      margin="0 5px"
    />
  )
}
