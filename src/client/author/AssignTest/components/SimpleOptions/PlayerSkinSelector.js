import { test } from '@edulastic/constants'
import Col from "antd/es/col";
import Select from "antd/es/select";
import React from 'react'
import {
  ColLabel,
  Label,
  StyledRow,
  StyledRowSelect,
  StyledSelect,
} from './styled'

const { playerSkinTypes } = test

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
    <StyledSelect
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
    </StyledSelect>
  )

  return fullwidth ? (
    <StyledRowSelect gutter={16}>
      <Col span={12}>
        <Label>STUDENT PLAYER SKIN</Label>
      </Col>
      <Col span={12}>{SelectOption}</Col>
    </StyledRowSelect>
  ) : (
    <>
      <StyledRow gutter={48}>
        {!isAdvanceView && (
          <ColLabel span={24}>
            <Label>STUDENT PLAYER SKIN</Label>
          </ColLabel>
        )}
        <Col span={24}>{SelectOption}</Col>
      </StyledRow>
    </>
  )
}

export default PlayerSkinSelector
