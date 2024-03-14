import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { white, testTypeColor } from '@edulastic/colors'
import { TEST_TYPE_SURVEY } from '@edulastic/constants/const/testTypes'

const testTypesWithModifiedIcon = [TEST_TYPE_SURVEY]

const testTypeToIconMap = {
  survey: 'SU',
}

const testTypeToFontSizeMap = {
  survey: '10px',
}

const TestTypeIcon = ({
  testType,
  toolTipTitle = '',
  toolTipPlacement = 'top',
}) => {
  const testTypePrefix = testTypesWithModifiedIcon.includes(testType)
    ? testTypeToIconMap[testType]
    : testType.split('')[0].toUpperCase()

  return (
    <Tooltip placement={toolTipPlacement} title={toolTipTitle}>
      <TypeIcon data-cy="testType" data-testid="testType" type={testType}>
        {testTypePrefix}
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
  font-size: ${(props) =>
    testTypeToFontSizeMap[props.type] || props.theme.bodyFontSize};
  align-self: center;
  margin: 0px 10px;
`

export default TestTypeIcon
