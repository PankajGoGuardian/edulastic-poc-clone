import React from 'react'
import { EduIf, SpinLoader } from '@edulastic/common'
import { ChartWrapper } from '../styled-component'
import AttendanceSummaryGraph from './AttendanceSummaryGraph'
import AttendanceSummaryHeader from './AttendanceSummaryHeader'

const AttendanceSummaryChart = ({ attendanceData, loading }) => {
  return (
    <ChartWrapper>
      <AttendanceSummaryHeader groupBy={groupBy} setGroupBy={setGroupBy} />
      <EduIf condition={!loading}>
        <AttendanceSummaryGraph attendanceData={attendanceData} />
      </EduIf>
    </ChartWrapper>
  )
}

export default AttendanceSummaryChart
