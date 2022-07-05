import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { white, testTypeColor } from '@edulastic/colors'

const TestTypeIcon = ({
  testType,
  toolTipTitle = '',
  toolTipPlacement = 'top',
}) => {
  return (
    <Tooltip placement={toolTipPlacement} title={toolTipTitle}>
      <TypeIcon data-cy="testType" data-testid="testType" type={testType}>
        {testType.split('')[0].toUpperCase()}
      </TypeIcon>
    </Tooltip>
  )
}

const TypeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
  width: 18px;
  height: 18px;
  max-width: 18px;
  background: ${(props) => testTypeColor[props.type]};
  color: ${white};
  border-radius: 50%;
  font-weight: 600;
  font-size: ${(props) => props.theme.bodyFontSize};
  align-self: center;
  margin: 0px 10px;
`

export default TestTypeIcon
