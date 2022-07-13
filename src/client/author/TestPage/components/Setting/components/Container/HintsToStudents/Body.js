import React from 'react'

import { Col, Row } from 'antd'
import { Body, Description } from '../styled'
import RadioOptions from './RadioOptions'

export default ({
  isSmallSize,
  disabled,
  showHintsToStudents,
  penaltyOnUsingHints,
  updateTestData,
}) => {
  if (!showHintsToStudents) {
    return null
  }

  const updatePenaltyPoints = (value) => {
    updateTestData('penaltyOnUsingHints')(value)
  }

  return (
    <Body smallSize={isSmallSize} padding="0">
      <Description marginTop="10px" marginBottom="20px">
        Students will be able to see the hint associated with an item while
        attempting the assignment
      </Description>
      <Row>
        <Col span={12}>
          <RadioOptions
            disabled={disabled}
            penaltyOnUsingHints={penaltyOnUsingHints}
            updatePenaltyPoints={updatePenaltyPoints}
          />
        </Col>
      </Row>
    </Body>
  )
}
