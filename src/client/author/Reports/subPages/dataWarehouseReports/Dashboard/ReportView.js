import React from 'react'
import SectionLabel from '../../../common/components/SectionLabel'

import {
  masteryScales,
  academicSummaryFiltersTypes,
  availableTestTypes,
  attendanceSummaryData,
} from './utils'

import { MasonGrid } from './components/common/styledComponents'
import AcademicSummary from './components/widgets/AcademicSummary'
import AttendanceSummary from './components/widgets/AttendanceSummary'
import TableSection from './components/TableSection'

function ReportView({
  performanceBandList,
  setAcademicSummaryFilters,
  compareByOptions,
  isCsvDownloading,
  settings,
  fetchDashboardTableDataRequest,
  loadingTableData,
  tableDataRequestError,
  toggleFilter,
  tableData,
}) {
  const { academicSummaryFilters } = settings
  const selectedPerformanceBand = (
    masteryScales.filter(
      (x) =>
        x._id ===
        academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]
          ?.key
    )[0] || masteryScales[0]
  )?.performanceBand

  return (
    <>
      <SectionLabel>Overview</SectionLabel>
      <MasonGrid>
        <AcademicSummary // null on no data
          selectedPerformanceBand={selectedPerformanceBand}
          performanceBandList={performanceBandList}
          availableTestTypes={availableTestTypes}
          widgetFilters={academicSummaryFilters}
          setWidgetFilters={setAcademicSummaryFilters}
          settings={settings}
        />
        <AttendanceSummary // null on no data
          attendanceSummaryData={attendanceSummaryData}
        />
      </MasonGrid>
      <TableSection
        academicSummaryFilters={academicSummaryFilters}
        compareByOptions={compareByOptions}
        fetchDashboardTableDataRequest={fetchDashboardTableDataRequest}
        isCsvDownloading={isCsvDownloading}
        loadingTableData={loadingTableData}
        selectedPerformanceBand={selectedPerformanceBand}
        settings={settings}
        tableData={tableData}
        tableDataRequestError={tableDataRequestError}
        toggleFilter={toggleFilter}
      />
    </>
  )
}

export default ReportView
