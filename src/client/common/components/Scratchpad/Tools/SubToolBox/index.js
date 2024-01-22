import React from 'react'
import styled from 'styled-components'
import { FlexContainer } from '@edulastic/common'
import { drawTools } from '@edulastic/constants'
import SubOptions from './SubOptions'
import { SubToolBoxContainer } from '../styled'

const SubToolBox = ({ activeMode, i18Translate, ...rest }) => {
  // first time activeMode will be empty string
  // in this case will use select tool's option.
  const label = i18Translate(
    `common.activeModeTexts.${activeMode || drawTools.SELECT_TOOL}.title`
  )
  const desc = i18Translate(
    `common.activeModeTexts.${activeMode || drawTools.SELECT_TOOL}.description`
  )

  return (
    <SubToolBoxContainer id="tool-properties" alignItems="center">
      <FlexContainer flex={1} alignItems="flex-start" flexDirection="column">
        <ToolTitle>
          <span>{label}</span> {i18Translate('common.test.tool')}
        </ToolTitle>
        <ToolDescription>{desc}</ToolDescription>
      </FlexContainer>
      <SubOptions activeMode={activeMode} {...rest} />
    </SubToolBoxContainer>
  )
}

export default SubToolBox

const ToolTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #06a1c6;
  text-transform: uppercase;
  cursor: default;

  span {
    color: #333;
  }
`

const ToolDescription = styled.span`
  white-space: nowrap;
  color: #666666;
`
