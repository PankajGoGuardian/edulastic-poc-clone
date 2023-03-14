import React, { useState } from 'react'

import { SubHeader } from '../../../common/components/Header'
import SectionLabel from '../../../common/components/SectionLabel'
import {
  MasonGrid,
  DashboardReportContainer,
} from './components/common/styledComponents'
import DashboardTable from './components/Table'
import { AcademicSummary } from './components/widgets/AcademicSummary'
// import { StandardMastery } from './components/widgets/StandardsMastery'
import AttendanceSummary from './components/widgets/AttendanceSummary'
import DashboardTableFilters from './components/TableFilters'

import { getUserRole } from '../../../../src/selectors/user'

import {
  masteryScales,
  attendanceSummaryData,
  academicSummaryData,
  tableData,
  compareByOptions as compareByOptionsRaw,
  tableFilterTypes,
} from './utils'
import { connect } from 'react-redux'

const Dashboard = ({
  // location,
  userRole,
  breadcrumbData,
  isCliUser,
  isCsvDownloading,
}) => {
  const requestFilters = { profileId: '6322e2b799978a000a298469' }

  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )
  const [defaultCompareBy] = compareByOptions

  const [tableFilters, setTableFilters] = useState({
    [tableFilterTypes.COMPARE_BY]:
      // compareByOptions.find((c) => c.key === location?.search?.compareBy) ||
      defaultCompareBy,
    [tableFilterTypes.ABOVE_EQUAL_TO_AVG]: true,
    [tableFilterTypes.BELOW_AVG]: true,
  })

  const updateTableFiltersCB = (selected, tableFilterType) => {
    setTableFilters((prevState) => {
      const nextState = { ...prevState, [tableFilterType]: selected }
      if (
        !nextState[tableFilterTypes.ABOVE_EQUAL_TO_AVG] &&
        !nextState[tableFilterTypes.BELOW_AVG]
      ) {
        // if both are false, set true to both
        nextState[tableFilterTypes.ABOVE_EQUAL_TO_AVG] = true
        nextState[tableFilterTypes.BELOW_AVG] = true
      }
      return nextState
    })
  }

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
          academicSummaryData={academicSummaryData}
          masteryScales={masteryScales}
          profileId={requestFilters.profileId}
        />
        {/* <StandardMastery /> */}
        <AttendanceSummary attendanceSummaryData={attendanceSummaryData} />
      </MasonGrid>
      <DashboardTableFilters
        tableFilters={tableFilters}
        updateTableFiltersCB={updateTableFiltersCB}
        compareByOptions={compareByOptions}
      />
      <DashboardTable
        tableFilters={tableFilters}
        updateTableFiltersCB={updateTableFiltersCB}
        tableData={tableData}
        isCsvDownloading={isCsvDownloading}
      />
    </DashboardReportContainer>
  )
}

export default connect(
  (state) => ({ userRole: getUserRole(state) }),
  {}
)(Dashboard)
