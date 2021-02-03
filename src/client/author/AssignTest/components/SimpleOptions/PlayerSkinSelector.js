import { test } from '@edulastic/constants'
import { Col, Select } from 'antd'
import React from 'react'
import { SelectInputStyled } from '@edulastic/common'
import { ColLabel, Label, StyledRow } from './styled'
import DollarPremiumSymbol from '../Container/DollarPremiumSymbol'

const { playerSkinTypes } = test

const PlayerSkinSelector = ({
  playerSkinType = playerSkinTypes.edulastic,
  onAssignmentTypeChange,
  testType = [],
  isAdvanceView,
  disabled = false,
  fullwidth = false,
  selectBackgroundWhite = false,
  isFeatureAvailable = false,
}) => {
  const edulastic = `${playerSkinTypes.edulastic} ${
    testType?.includes('assessment') ? 'Test' : 'Practice'
  }`
  const types = {
    ...playerSkinTypes,
    edulastic,
  }

  const SelectOption = (
    <SelectInputStyled
      data-cy="playerSkinType"
      onChange={onAssignmentTypeChange}
      value={
        playerSkinType.toLowerCase() === playerSkinTypes.edulastic.toLowerCase()
          ? edulastic
          : playerSkinType
      }
      disabled={disabled}
      isBackgroundWhite={selectBackgroundWhite}
    >
      {Object.keys(types).map((key) => (
        <Select.Option key={key} value={key}>
          {types[key]}
        </Select.Option>
      ))}
    </SelectInputStyled>
  )

  return fullwidth ? (
    <StyledRow gutter={16}>
      <Col span={10}>
        <Label>
          STUDENT PLAYER SKIN
          <DollarPremiumSymbol premium={isFeatureAvailable} />
        </Label>
      </Col>
      <Col span={12}>{SelectOption}</Col>
    </StyledRow>
  ) : (
    <>
      <StyledRow gutter={48}>
        {!isAdvanceView && (
          <ColLabel span={24}>
            <Label>
              STUDENT PLAYER SKIN
              <DollarPremiumSymbol premium={isFeatureAvailable} />
            </Label>
          </ColLabel>
        )}
        <Col span={24}>{SelectOption}</Col>
      </StyledRow>
    </>
  )
}

export default PlayerSkinSelector
