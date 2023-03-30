import React from 'react'
import SectionLabel from '../../../common/components/SectionLabel'

import { availableTestTypes } from './utils'

import { MasonGrid } from './components/common/styledComponents'
import AcademicSummary from './components/widgets/AcademicSummary'
import AttendanceSummary from './components/widgets/AttendanceSummary/AttendanceSummary'
import TableSection from './components/TableSection'

function ReportView({
  location,
  performanceBandList,
  selectedPerformanceBand,
  setAcademicSummaryFilters,
  compareByOptions,
  isCsvDownloading,
  settings,
  setSettings,
  selectedCompareBy,
  fetchDashboardTableDataRequest,
  loadingTableData,
  tableDataRequestError,
  tableData,
}) {
  const { academicSummaryFilters } = settings

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
        <AttendanceSummary settings={settings} />
      </MasonGrid>
      <TableSection
        location={location}
        academicSummaryFilters={academicSummaryFilters}
        compareByOptions={compareByOptions}
        fetchDashboardTableDataRequest={fetchDashboardTableDataRequest}
        isCsvDownloading={isCsvDownloading}
        loadingTableData={loadingTableData}
        selectedPerformanceBand={selectedPerformanceBand}
        settings={settings}
        setSettings={setSettings}
        selectedCompareBy={selectedCompareBy}
        tableData={tableData}
        tableDataRequestError={tableDataRequestError}
      />
    </>
  )
}

export default ReportView
