import React, { useMemo } from 'react'
import { SubHeader } from '../../../common/components/Header'
import SectionLabel from '../../../common/components/SectionLabel'
import {
  MasonGrid,
  DashboardReportContainer,
} from './components/common/styledComponents'
import { DashboardTable } from './components/Table'
import { AcademicSummary } from './components/widgets/AcademicSummary'
// import { StandardMastery } from './components/widgets/StandardsMastery'
import AttendanceSummary from './components/widgets/AttendanceSummary'
import {
  bandInfo,
  attendanceSummaryData,
  academicSummaryData,
  tableData,
} from './utils'

const Dashboard = ({ breadcrumbData, isCliUser }) => {
  const filters = { profileId: '6322e2b799978a000a298469' }
  const performanceBandList = useMemo(
    () => bandInfo.map((p) => ({ key: p._id, title: p.name })),
    [bandInfo]
  )
  return (
    <DashboardReportContainer>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      />
      <SectionLabel>Overview</SectionLabel>
      <MasonGrid>
        <AcademicSummary
          academicSummary={academicSummaryData}
          profileId={filters.profileId}
          performanceBandList={performanceBandList}
          bandInfo={bandInfo}
        />
        {/* <StandardMastery /> */}
        <AttendanceSummary attendanceSummary={attendanceSummaryData} />
      </MasonGrid>
      <DashboardTable tableData={tableData} />
    </DashboardReportContainer>
  )
}
export default Dashboard
