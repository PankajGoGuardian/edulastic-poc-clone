import React from 'react'
import { SubHeader } from '../../../common/components/Header'
import { MasonGrid } from './components/common/styledComponents'
import { AcademicSummary } from './components/widgets/AcademicSummary'
// import { StandardMastery } from './components/widgets/StandardsMastery'
import AttendanceSummary from './components/widgets/AttendanceSummary'

const Dashboard = ({ breadcrumbData, isCliUser }) => {
  const academicSummary = {
    avgScore: 75,
    percentageIncrease: 26,
    prevMonth: '1st Dec',
    aboveStandard: 68,
  }
  const attendanceSummary = {
    avg: 67,
    percentageIncreaseAvg: 13,
    prevMonth: '1st Dec.',
    tardiesPercentage: 12,
    chronicAbsentPercentage: 12,
    percentageIncreaseTardies: 26,
    percentageIncreaseChronic: 26,
  }
  return (
    <>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      />
      <MasonGrid>
        <AcademicSummary academicSummary={academicSummary} />
        {/* <StandardMastery /> */}
        <AttendanceSummary attendanceSummary={attendanceSummary} />
      </MasonGrid>
    </>
  )
}
export default Dashboard
