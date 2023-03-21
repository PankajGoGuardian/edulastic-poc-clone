import React, { useState } from 'react'
import SectionLabel from '../../../common/components/SectionLabel'

import {
  masteryScales,
  tableFilterTypes,
  academicSummaryFiltersTypes,
  availableTestTypes,
  attendanceSummaryData,
  tableData,
} from './utils'

import { MasonGrid } from './components/common/styledComponents'
import DashboardTable from './components/Table'
import AcademicSummary from './components/widgets/AcademicSummary'
import AttendanceSummary from './components/widgets/AttendanceSummary'
import DashboardTableFilters from './components/TableFilters'

function ReportView({
  performanceBandList,
  academicSummaryFilters,
  setAcademicSummaryFilters,
  compareByOptions,
  isCsvDownloading,
  settings,
  setSettings,
}) {
  const updateFilterDropdownCB = (selected, keyName) => {
    if (keyName === 'compareBy') {
      setSettings({ ...settings, selectedCompareBy: selected })
    }
  }

  const [defaultCompareBy] = compareByOptions

  const [tableFilters, setTableFilters] = useState({
    [tableFilterTypes.COMPARE_BY]:
      // compareByOptions.find((c) => c.key === location?.search?.compareBy) ||
      defaultCompareBy,
    [tableFilterTypes.ABOVE_EQUAL_TO_AVG]: true,
    [tableFilterTypes.BELOW_AVG]: true,
  })
  const selectedPerformanceBand = (
    masteryScales.filter(
      (x) =>
        x._id ===
        academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]
          ?.key
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
    <>
      <SectionLabel>Overview</SectionLabel>
      <MasonGrid>
        <AcademicSummary
          selectedPerformanceBand={selectedPerformanceBand}
          performanceBandList={performanceBandList}
          availableTestTypes={availableTestTypes}
          widgetFilters={academicSummaryFilters}
          setWidgetFilters={setAcademicSummaryFilters}
          settings={settings}
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
        selectedPerformanceBand={selectedPerformanceBand}
        isCsvDownloading={isCsvDownloading}
      />
    </>
  )
}

export default ReportView
