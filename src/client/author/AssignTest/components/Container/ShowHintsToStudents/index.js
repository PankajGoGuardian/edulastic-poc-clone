import React from 'react'
import { Col, Row } from 'antd'

import { SettingContainer } from '../styled'
import { StyledRow, Label } from '../../SimpleOptions/styled'
import RadioOptions from '../../../../TestPage/components/Setting/components/Container/HintsToStudents/RadioOptions'
import ShowHintsSwitch from '../../../../TestPage/components/Setting/components/Container/HintsToStudents/ShowHintsSwitch'

export default ({
  freezeSettings,
  showHintsToStudents,
  penaltyOnUsingHints,
  overRideSettings,
  allowToUseShowHintsToStudents,
  isDocBased,
  isTestlet,
}) => {
  if (isDocBased || !allowToUseShowHintsToStudents || isTestlet) {
    return null
  }

  const handleChangePenaltyPoints = (value) => {
    const points = parseFloat(value)
    if (!Number.isNaN(points)) {
      overRideSettings('penaltyOnUsingHints', points)
    }
  }

  return (
    <SettingContainer id="show-hints-to-students">
      <StyledRow
        data-cy="show-hints-to-students-container"
        gutter={16}
        mb="15px"
        height="40"
      >
        <Col span={10}>
          <Label>
            <span>SHOW HINTS TO STUDENTS</span>
          </Label>
        </Col>
        <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <Row
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <ShowHintsSwitch
              disabled={freezeSettings}
              checked={showHintsToStudents}
              onChangeHandler={(value) =>
                overRideSettings('showHintsToStudents', value)
              }
            />
          </Row>
          {showHintsToStudents && (
            <Row>
              <Col span={12}>
                <RadioOptions
                  disabled={freezeSettings}
                  penaltyOnUsingHints={penaltyOnUsingHints}
                  updatePenaltyPoints={handleChangePenaltyPoints}
                  isAssignPage
                />
              </Col>
            </Row>
          )}
        </Col>
      </StyledRow>
    </SettingContainer>
  )
}
