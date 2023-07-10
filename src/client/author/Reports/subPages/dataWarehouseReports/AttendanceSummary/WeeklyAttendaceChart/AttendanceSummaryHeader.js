import React from 'react'
import Checkbox from 'antd/lib/checkbox'
import { EduIf } from '@edulastic/common'
import {
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

const AttendanceSummaryHeader = ({
  groupBy,
  setGroupBy,
  interventionData,
  onShowInterventionClick,
  showInterventions,
}) => {
  return (
    <FlexWrapper flex="1">
      <Title>Attendance Trends</Title>
      <FlexWrapper>
        <LegendWrap>
          {AttendanceSummaryLegends.map((entry) => {
            return (
              <CustomLegend key={`legend-${entry.name}`}>
                <LegendSymbol color={entry.color} />
                <LegendName>{entry.name}</LegendName>
              </CustomLegend>
            )
          })}
        </LegendWrap>
        <div style={{ display: 'flex', gap: '0 24px', alignItems: 'center' }}>
          <StyledDiv>
            <EduIf condition={interventionData.length}>
              <Checkbox
                checked={showInterventions}
                onChange={onShowInterventionClick}
                style={{
                  margin: '0 30px 0 0',
                  fontSize: '12px',
                }}
              >
                Show Interventions
              </Checkbox>
            </EduIf>
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
