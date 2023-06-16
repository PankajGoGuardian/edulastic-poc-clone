import React from 'react'
import Checkbox from 'antd/lib/checkbox'
import { connect } from 'react-redux'
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
import { selectedFilterTagsData } from '../ducks/selectors'
import { fetchInterventionsByGroupsRequest } from '../../../../ducks'
import { AttendanceSummaryLegends, groupByConstants } from '../utils/constants'

const AttendanceSummaryHeader = ({
  groupBy,
  setGroupBy,
  startDate,
  endDate,
  fetchInterventionsByGroups,
  filterTagsData,
}) => {
  const onShowInterventionClick = (e) => {
    const checked = e.target.checked
    if (checked) {
      fetchInterventionsByGroups({
        type: 'attendance',
        groupIds: filterTagsData.groupIds.map((i) => i.key).join(),
        startDate,
        endDate,
      })
    }
  }
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
            {filterTagsData?.groupIds?.length > 0 && (
              <Checkbox onChange={onShowInterventionClick}>
                <StyledSpan>Show Interventions</StyledSpan>
              </Checkbox>
            )}
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

const enhance = connect(
  (state) => ({
    filterTagsData: selectedFilterTagsData(state),
  }),
  {
    fetchInterventionsByGroups: fetchInterventionsByGroupsRequest,
  }
)

export default enhance(AttendanceSummaryHeader)
