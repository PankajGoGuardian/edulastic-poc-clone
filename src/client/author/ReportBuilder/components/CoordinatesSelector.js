import React from 'react'
import { Select } from 'antd'
import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

const { Option } = Select

function CoordinatesSelector({
  availableOptions,
  selectedXCoords,
  selectedYCoords,
  setSelectedXCoords,
  setSelectedYCoords,
}) {
  const children = availableOptions
    .filter((o) => {
      const foundX = selectedXCoords.includes(o.name)
      const foundY = selectedYCoords.includes(o.name)
      return !(foundX || foundY)
    })
    .map((o) => <Option key={o.name}>{o.title}</Option>)

  const handleXChange = (value) => {
    setSelectedXCoords(value)
  }
  const handleYChange = (value) => {
    setSelectedYCoords(value)
  }

  return (
    <FlexContainer>
      <FlexContainer flexDirection="column" style={{ marginRight: '15px' }}>
        <Title>X-Axis Field(s)</Title>
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
        <Title>Y-Axis Field(s)</Title>
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

export default CoordinatesSelector

const Title = styled.p`
  margin-bottom: 10px;
  color: ${themeColor};
`
