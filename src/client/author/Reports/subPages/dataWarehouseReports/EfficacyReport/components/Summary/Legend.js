import React from 'react'
import { map } from 'lodash'
import { FlexContainer } from '@edulastic/common'
import { Tooltip } from 'antd'
import { ColorCircle } from '../../../../../common/styled'
import {
  LegendWrapper,
  StyledLegendItem,
  TestTypeTag,
} from '../../common/styledComponents'

const Legend = ({ band, testType }) => {
  const legend = map(band, ({ name, color }) => (
    <Tooltip title={name} key={color}>
      <StyledLegendItem>
        <ColorCircle color={color} />
        <span>{name}</span>
      </StyledLegendItem>
    </Tooltip>
  ))
  return (
    <FlexContainer justifyContent="left" marginLeft="20px">
      <TestTypeTag>{testType}</TestTypeTag>
      <LegendWrapper>{legend}</LegendWrapper>
    </FlexContainer>
  )
}

export default Legend
