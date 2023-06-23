import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { EduIf, SpinLoader } from '@edulastic/common'
import { ChartWrapper } from '../styled-component'
import AttendanceSummaryGraph from './AttendanceSummaryGraph'
import AttendanceSummaryHeader from './AttendanceSummaryHeader'
import {
  fetchInterventionsByGroupsRequest,
  getInterventionsByGroup,
} from '../../../../ducks'
import { selectedFilterTagsData, settings } from '../ducks/selectors'

const AttendanceSummaryChart = ({
  attendanceData,
  loading,
  groupBy,
  setGroupBy,
  interventionData,
  fetchInterventionsByGroups,
  filterTagsData,
  settingsData,
}) => {
  const [showInterventions, setShowInterventions] = useState(false)

  const onShowInterventionClick = (e) => {
    const checked = e.target.checked
    setShowInterventions(checked)
  }

  useEffect(() => {
    const startDate = Math.min(...attendanceData.map((ele) => ele.minDate))
    const endDate = Math.max(...attendanceData.map((ele) => ele.minDate))
    let groupIds = ''
    const termId = settingsData.requestFilters?.termId
    if (settingsData.requestFilters.groupIds.length)
      groupIds += settingsData.requestFilters.groupIds
    if (settingsData.requestFilters.classIds.length)
      groupIds =
        (groupIds.length ? `${groupIds},` : groupIds) +
        settingsData.requestFilters.classIds
    if (
      groupIds.length &&
      termId &&
      Number.isInteger(startDate) &&
      Number.isInteger(endDate)
    )
      fetchInterventionsByGroups({
        type: ['attendance'],
        groupIds,
        startDate,
        endDate,
        termId,
      })
  }, [attendanceData])

  return (
    <ChartWrapper>
      <AttendanceSummaryHeader
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        filterTagsData={filterTagsData}
        interventionData={interventionData}
        onShowInterventionClick={onShowInterventionClick}
      />
      <EduIf condition={loading}>
        <SpinLoader />
      </EduIf>
      <EduIf condition={!loading}>
        <AttendanceSummaryGraph
          attendanceData={attendanceData}
          groupBy={groupBy}
          interventionList={interventionData}
          showInterventions={showInterventions}
        />
      </EduIf>
    </ChartWrapper>
  )
}

const enhance = connect(
  (state) => ({
    interventionData: getInterventionsByGroup(state),
    filterTagsData: selectedFilterTagsData(state),
    settingsData: settings(state),
  }),
  {
    fetchInterventionsByGroups: fetchInterventionsByGroupsRequest,
  }
)

export default enhance(AttendanceSummaryChart)
