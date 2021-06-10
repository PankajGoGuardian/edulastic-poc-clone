import { test } from '@edulastic/constants'
import { Col, Select } from 'antd'
import React from 'react'
import { SelectInputStyled } from '@edulastic/common'
import { ColLabel, Label, StyledRow } from './styled'

const { playerSkinTypes, playerSkinValues } = test

const PlayerSkinSelector = ({
  playerSkinType = playerSkinTypes.edulastic,
  onAssignmentTypeChange,
  testType = [],
  isAdvanceView,
  disabled = false,
  fullwidth = false,
  selectBackgroundWhite = false,
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
      showSearch
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      value={
        playerSkinType.toLowerCase() === playerSkinTypes.edulastic.toLowerCase()
          ? edulastic
          : playerSkinType
      }
      disabled={disabled || playerSkinType === playerSkinValues.testlet}
      isBackgroundWhite={selectBackgroundWhite}
    >
      {Object.keys(types)
        .sort()
        .map((key) => {
          if (
            key === playerSkinValues.testlet &&
            !(playerSkinType === playerSkinValues.testlet)
          ) {
            return null
          }
          return (
            <Select.Option key={key} value={key}>
              {types[key]}
            </Select.Option>
          )
        })}
    </SelectInputStyled>
  )

  return fullwidth ? (
    <StyledRow gutter={16}>
      <Col span={10}>
        <Label>CHOOSE TEST INTERFACE</Label>
      </Col>
      <Col span={12}>{SelectOption}</Col>
    </StyledRow>
  ) : (
    <>
      <StyledRow gutter={48}>
        {!isAdvanceView && (
          <ColLabel span={24}>
            <Label>CHOOSE TEST INTERFACE</Label>
          </ColLabel>
        )}
        <Col span={24}>{SelectOption}</Col>
      </StyledRow>
    </>
  )
}

export default PlayerSkinSelector
