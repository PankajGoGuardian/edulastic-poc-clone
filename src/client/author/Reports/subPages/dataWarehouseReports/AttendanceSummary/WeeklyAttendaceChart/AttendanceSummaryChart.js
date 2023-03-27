import React, { useEffect } from 'react'
import { EduIf, SpinLoader } from '@edulastic/common'
import { ChartWrapper } from '../styled-component'
import AttendanceSummaryGraph from './AttendanceSummaryGraph'
import AttendanceSummaryHeader from './AttendanceSummaryHeader'

function AttendanceSummaryChart({ attendanceData, loading }) {
  useEffect(() => {
    // dispatch the action for triggering API.
    // Currently display console
    console.log('AttendanceSummaryChart is mounted')
  }, [])

  return (
    <ChartWrapper>
      <AttendanceSummaryHeader />
      <EduIf condition={loading}>
        <SpinLoader tip="Loading report data" />
      </EduIf>
      <EduIf condition={!loading}>
        <AttendanceSummaryGraph attendanceData={attendanceData} />
      </EduIf>
    </ChartWrapper>
  )
}

export default AttendanceSummaryChart
