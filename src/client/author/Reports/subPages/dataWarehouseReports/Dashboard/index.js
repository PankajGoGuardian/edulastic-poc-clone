import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'

import { SubHeader } from '../../../common/components/Header'
import SectionLabel from '../../../common/components/SectionLabel'

import {
  MasonGrid,
  DashboardReportContainer,
} from './components/common/styledComponents'
import DashboardTable from './components/Table'
import AcademicSummary from './components/widgets/AcademicSummary'
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
  academicSummaryFiltersTypes,
  availableTestTypes,
} from './utils'

const Dashboard = ({
  // location,
  userRole,
  breadcrumbData,
  isCliUser,
  isCsvDownloading,
}) => {
  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )
  const [defaultCompareBy] = compareByOptions

  const performanceBandList = useMemo(
    () => masteryScales.map((p) => ({ key: p._id, title: p.name })),
    [masteryScales]
  )

  const [filters, setFilters] = useState({})
  const [tableFilters, setTableFilters] = useState({
    [tableFilterTypes.COMPARE_BY]:
      // compareByOptions.find((c) => c.key === location?.search?.compareBy) ||
      defaultCompareBy,
    [tableFilterTypes.ABOVE_EQUAL_TO_AVG]: true,
    [tableFilterTypes.BELOW_AVG]: true,
  })

  const [academicSummaryFilters, setAcademicSummaryFilters] = useState({
    [academicSummaryFiltersTypes.PERFORMANCE_BAND]:
      performanceBandList.find((p) => p.key === filters.profileId) ||
      performanceBandList[0],
    [academicSummaryFiltersTypes.TEST_TYPE]: availableTestTypes[0],
  })

  const selectedPerformanceBand = (
    masteryScales.filter(
      (x) => x._id === academicSummaryFilters.performanceBand.key
    )[0] || masteryScales[0]
  )?.performanceBand

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
          selectedPerformanceBand={selectedPerformanceBand}
          performanceBandList={performanceBandList}
          availableTestTypes={availableTestTypes}
          filters={academicSummaryFilters}
          setFilters={setAcademicSummaryFilters}
        />
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
