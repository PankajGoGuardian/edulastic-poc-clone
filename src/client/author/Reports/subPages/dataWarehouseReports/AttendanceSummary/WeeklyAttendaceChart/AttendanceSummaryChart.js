import React, { useEffect } from 'react'
import { ChartWrapper } from '../styled-component'
import AttendanceSummaryGraph from './AttendanceSummaryGraph'
import AttendanceSummaryHeader from './AttendanceSummaryHeader'

function AttendanceSummaryChart() {
  useEffect(() => {
    // dispatch the action for triggering API.
    // Currently display console
    console.log('AttendanceSummaryChart is mounted')
  }, [])

  return (
    <ChartWrapper>
      <AttendanceSummaryHeader />
      <AttendanceSummaryGraph />
    </ChartWrapper>
  )
}

export default AttendanceSummaryChart
