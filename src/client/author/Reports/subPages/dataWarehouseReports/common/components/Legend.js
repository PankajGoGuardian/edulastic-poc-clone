import React from 'react'
import { map } from 'lodash'
import { EduIf, FlexContainer } from '@edulastic/common'
import { Tooltip } from 'antd'
import { ColorCircle } from '../../../../common/styled'
import { LegendWrapper, StyledLegendItem } from './styledComponents'

const Legend = ({ title = null, payload, legendStyles = {} }) => {
  const legend = map(payload, ({ name, color }) => (
    <Tooltip title={name} key={color}>
      <StyledLegendItem
        $fontSize={legendStyles.fontSize}
        $fontWeight={legendStyles.fontWeight}
      >
        <EduIf condition={color}>
          <ColorCircle color={color} />
        </EduIf>
        <span>{name}</span>
      </StyledLegendItem>
    </Tooltip>
  ))
  return (
    <FlexContainer
      justifyContent="left"
      style={{ gap: '20px' }}
      marginLeft="20px"
    >
      <EduIf condition={title}>{title}</EduIf>
      <LegendWrapper $gap={legendStyles.gap}>{legend}</LegendWrapper>
    </FlexContainer>
  )
}

export default Legend
