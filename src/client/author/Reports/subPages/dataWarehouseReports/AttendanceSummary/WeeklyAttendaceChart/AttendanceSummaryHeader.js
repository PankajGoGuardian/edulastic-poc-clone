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
  StyledSwitch,
  StyledSpan,
  StyledDiv,
  Title,
} from '../styled-component'
import { AttendanceSummaryLegends, groupByConstants } from '../utils/constants'

const AttendanceSummaryHeader = ({ groupBy, setGroupBy }) => {
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
        <div style={{ display: 'flex', gap: '0 24px', alignItems: 'center' }}>
          <CheckBoxWrapper>
            <CheckboxLabel size="14px">
              <CheckboxText>Show Average Score</CheckboxText>
            </CheckboxLabel>
          </CheckBoxWrapper>
          <StyledDiv>
            <StyledSpan>Weekly</StyledSpan>
            <StyledSwitch
              checked={groupBy === groupByConstants.MONTH}
              onChange={setGroupBy}
            />
            <StyledSpan>Monthly</StyledSpan>
          </StyledDiv>
        </div>
      </FlexWrapper>
    </FlexWrapper>
  )
}

export default AttendanceSummaryHeader
