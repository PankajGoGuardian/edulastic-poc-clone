import React from 'react'
import { connect } from 'react-redux'
import { EduIf, SpinLoader } from '@edulastic/common'
import { ChartWrapper } from '../styled-component'
import AttendanceSummaryGraph from './AttendanceSummaryGraph'
import AttendanceSummaryHeader from './AttendanceSummaryHeader'
import { getInterventionsByGroup } from '../../../../ducks'

const AttendanceSummaryChart = ({
  attendanceData,
  loading,
  groupBy,
  setGroupBy,
  interventionData,
}) => {
  const startDate = Math.min(...attendanceData.map((ele) => ele.minDate))
  const endDate = Math.max(...attendanceData.map((ele) => ele.minDate))
  return (
    <ChartWrapper>
      <AttendanceSummaryHeader
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        startDate={startDate}
        endDate={endDate}
      />
      <EduIf condition={loading}>
        <SpinLoader />
      </EduIf>
      <EduIf condition={!loading}>
        <AttendanceSummaryGraph
          attendanceData={attendanceData}
          groupBy={groupBy}
          interventionList={interventionData}
        />
      </EduIf>
    </ChartWrapper>
  )
}
const enhance = connect(
  (state) => ({
    interventionData: getInterventionsByGroup(state),
  }),
  null
)

export default enhance(AttendanceSummaryChart)
