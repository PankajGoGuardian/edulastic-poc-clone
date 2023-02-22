import React, { useMemo } from 'react'
import { SubHeader } from '../../../common/components/Header'
import { MasonGrid } from './components/common/styledComponents'
import { AcademicSummary } from './components/widgets/AcademicSummary'
// import { StandardMastery } from './components/widgets/StandardsMastery'
import AttendanceSummary from './components/widgets/AttendanceSummary'
import { bandInfo } from './utils'

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
  const filters = { profileId: '6322e2b799978a000a298469' }
  const performanceBandList = useMemo(
    () => bandInfo.map((p) => ({ key: p._id, title: p.name })),
    [bandInfo]
  )
  return (
    <>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      />
      <MasonGrid>
        <AcademicSummary
          academicSummary={academicSummary}
          profileId={filters.profileId}
          performanceBandList={performanceBandList}
          bandInfo={bandInfo}
        />
        {/* <StandardMastery /> */}
        <AttendanceSummary attendanceSummary={attendanceSummary} />
      </MasonGrid>
    </>
  )
}
export default Dashboard
