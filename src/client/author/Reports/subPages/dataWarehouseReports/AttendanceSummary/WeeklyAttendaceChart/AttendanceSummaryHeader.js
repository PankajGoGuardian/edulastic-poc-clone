import React from 'react'
import { CheckboxLabel } from '@edulastic/common'
import {
  CheckboxText,
  CheckBoxWrapper,
  CustomLegend,
  FlexWrapper,
  LegendName,
  LegendSymbol,
  LegendWrap,
  SwitchStyled,
  Title,
} from '../styled-component'
import { AttendanceSummaryLegends } from './constants'

const AttendanceSummaryHeader = () => {
  return (
    <FlexWrapper flex="1">
      <Title>Weekly Attendance</Title>
      <FlexWrapper>
        <LegendWrap>
          {AttendanceSummaryLegends.map((entry) => {
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

export default AttendanceSummaryHeader
