import React, { useEffect } from 'react'
import { EduIf } from '@edulastic/common'
import { ChartWrapper } from '../styled-component'
import AttendanceSummaryGraph from './AttendanceSummaryGraph'
import AttendanceSummaryHeader from './AttendanceSummaryHeader'

function AttendanceSummaryChart({
  attendanceData,
  loading,
  groupBy,
  setGroupBy,
}) {
  useEffect(() => {
    // dispatch the action for triggering API.
    // Currently display console
    console.log('AttendanceSummaryChart is mounted')
  }, [])

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
