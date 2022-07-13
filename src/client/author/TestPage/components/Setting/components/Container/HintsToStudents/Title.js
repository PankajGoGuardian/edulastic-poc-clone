import React from 'react'
import { Tooltip } from 'antd'

import { IconInfo } from '@edulastic/icons'
import { lightGrey9 } from '@edulastic/colors'

import { Title } from '../styled'
import { titleComponentTestId } from './constants'
import ShowHintsSwitch from './ShowHintsSwitch'
import DollarPremiumSymbol from '../../../../../../AssignTest/components/Container/DollarPremiumSymbol'

export default ({ showHintsToStudents, updateTestData, disabled, premium }) => {
  const updateShowHints = (value) => {
    updateTestData('showHintsToStudents')(value)
  }

  return (
    <Title data-testid={titleComponentTestId}>
      <span>Show Hints to Students </span>
      <DollarPremiumSymbol premium={premium} />
      <Tooltip title="Students will be able to see the hint associated with an item while attempting the assignment">
        <IconInfo
          color={lightGrey9}
          style={{ marginLeft: '10px', cursor: 'pointer' }}
        />
      </Tooltip>
      <ShowHintsSwitch
        disabled={disabled || !premium}
        checked={showHintsToStudents}
        onChangeHandler={updateShowHints}
      />
    </Title>
  )
}
