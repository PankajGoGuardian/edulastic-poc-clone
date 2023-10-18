import React from 'react'
import { Select } from 'antd'
import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

const { Option } = Select

export const CoordinatesSelector = ({
  availableOptions,
  selectedXCoords,
  selectedYCoords,
  setSelectedXCoords,
  setSelectedYCoords,
}) => {
  const children = availableOptions
    .filter((val) => {
      const foundX = selectedXCoords.includes(val)
      const foundY = selectedYCoords.includes(val)
      return !(foundX || foundY)
    })
    .map((val) => <Option key={val}>{val}</Option>)

  const handleXChange = (value) => {
    setSelectedXCoords(value)
  }
  const handleYChange = (value) => {
    setSelectedYCoords(value)
  }

  return (
    <FlexContainer>
      <FlexContainer flexDirection="column" style={{ marginRight: '15px' }}>
        <Title>Y-Axis Field(s)</Title>
        <Select
          mode="multiple"
          style={{ width: '350px' }}
          placeholder="Please select"
          value={selectedXCoords}
          onChange={handleXChange}
        >
          {children}
        </Select>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <Title>X-Axis Field(s)</Title>
        <Select
          mode="multiple"
          style={{ width: '350px' }}
          placeholder="Please select"
          value={selectedYCoords}
          onChange={handleYChange}
        >
          {children}
        </Select>
      </FlexContainer>
    </FlexContainer>
  )
}

const Title = styled.p`
  margin-bottom: 10px;
  color: ${themeColor};
`
