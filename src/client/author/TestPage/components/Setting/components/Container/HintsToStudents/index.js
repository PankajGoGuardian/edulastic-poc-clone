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
  showHintsFeatureAllowed,
  isTestlet,
}) => {
  if (isDocBased || isTestlet || !showHintsFeatureAllowed) {
    return null
  }

  return (
    <Block id="show-hints-to-students" smallSize={isSmallSize}>
      <SettingContainer>
        <Title
          showHintsToStudents={showHintsToStudents}
          disabled={disabled}
          updateTestData={updateTestData}
        />
        <Body
          disabled={disabled}
          isSmallSize={isSmallSize}
          penaltyOnUsingHints={penaltyOnUsingHints}
          showHintsToStudents={showHintsToStudents}
          updateTestData={updateTestData}
        />
      </SettingContainer>
    </Block>
  )
}
