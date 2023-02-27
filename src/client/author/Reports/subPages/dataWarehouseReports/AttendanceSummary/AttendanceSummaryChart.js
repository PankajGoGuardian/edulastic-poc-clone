import { CheckboxLabel } from '@edulastic/common'
import React, { useEffect, useState } from 'react'
import AttendanceSummaryGraph from './AttendanceSummaryGraph'
import {
  ChartWrapper,
  CheckboxText,
  CheckBoxWrapper,
  CustomLegend,
  FlexWrapper,
  LegendName,
  LegendSymbol,
  LegendWrap,
  SwitchStyled,
  Title,
} from './styled-component'

const data = [
  { name: 'Average', color: '#9FC6D2' },
  { name: 'Edulastic Avg Score', color: '#B5B5B5' },
]

const AttendanceSummaryTitleJSX = ({ response }) => {
  return (
    <FlexWrapper flex="1">
      <Title>Weekly Attendance</Title>
      <FlexWrapper>
        <LegendWrap>
          {response.map((entry) => {
            return (
              <CustomLegend>
                <LegendSymbol color={entry.color} />
                <LegendName>{entry.name}</LegendName>
              </CustomLegend>
            )
          })}
        </LegendWrap>
        <div style={{ display: 'flex', gap: '0 24px' }}>
          <CheckBoxWrapper>
            <CheckboxLabel size="14px">
              <CheckboxText>Show Average Score</CheckboxText>
            </CheckboxLabel>
          </CheckBoxWrapper>
          <SwitchStyled checkedChildren="Monthly" unCheckedChildren="Weekly" />
        </div>
      </FlexWrapper>
    </FlexWrapper>
  )
}

function AttendanceSummaryChart() {
  const [response, setResponse] = useState([])
  useEffect(() => {
    // dispatch the action for triggering API.
    setResponse(data)
  }, [])

  return (
    <ChartWrapper>
      <AttendanceSummaryTitleJSX response={response} />
      <AttendanceSummaryGraph />
    </ChartWrapper>
  )
}

export default AttendanceSummaryChart
