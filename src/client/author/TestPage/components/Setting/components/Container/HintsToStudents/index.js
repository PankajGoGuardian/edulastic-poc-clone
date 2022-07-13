import React from 'react'

import { SettingContainer } from '../../../../../../AssignTest/components/Container/styled'
import { Block } from '../styled'
import Title from './Title'
import Body from './Body'

export default ({
  isSmallSize,
  disabled,
  isDocBased,
  showHintsToStudents,
  penaltyOnUsingHints,
  updateTestData,
  isTestlet,
  togglePenaltyOnUsingHints,
  premium,
}) => {
  if (isDocBased || isTestlet) {
    return null
  }

  const isDisabled = disabled || !premium

  return (
    <Block id="show-hints-to-students" smallSize={isSmallSize}>
      <SettingContainer>
        <Title
          showHintsToStudents={showHintsToStudents}
          disabled={isDisabled}
          updateTestData={updateTestData}
          premium={premium}
        />
        <Body
          disabled={isDisabled}
          isSmallSize={isSmallSize}
          penaltyOnUsingHints={penaltyOnUsingHints}
          showHintsToStudents={showHintsToStudents}
          updateTestData={updateTestData}
          togglePenaltyOnUsingHints={togglePenaltyOnUsingHints}
        />
      </SettingContainer>
    </Block>
  )
}
