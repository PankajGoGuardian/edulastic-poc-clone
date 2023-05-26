import React from 'react'
import { helpLinks, reportNavType } from '@edulastic/constants/const/report'
import SectionLabel from '../../../common/components/SectionLabel'
import AcademicSummary from './components/widgets/AcademicSummary'
import AttendanceSummary from './components/widgets/AttendanceSummary/AttendanceSummary'
import TableSection from './components/TableSection'
import RiskSummary from '../common/components/RiskSummaryWidget'
import {
  WidgetsContainer,
  WidgetColumn,
} from '../common/components/styledComponents'
import SectionDescription from '../../../common/components/SectionDescription'

function ReportView({
  history,
  location,
  search,
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
  districtAveragesData,
  tableData,
  loc,
  availableTestTypes,
}) {
  const { academicSummaryFilters } = settings

  return (
    <>
      <SectionLabel
        style={{ fontSize: '20px' }}
        $margin="30px 0px 10px 0px"
        showHelp
        url={helpLinks[reportNavType.DW_DASHBOARD_REPORT]}
      >
        Overview
      </SectionLabel>
      <SectionDescription $margin="0px 0px 30px 0px">
        View key health checks for students performance. Drill down to analyze
        and intervene.
      </SectionDescription>

      <WidgetsContainer>
        <AcademicSummary
          selectedPerformanceBand={selectedPerformanceBand}
          performanceBandList={performanceBandList}
          availableTestTypes={availableTestTypes}
          widgetFilters={academicSummaryFilters}
          setWidgetFilters={setAcademicSummaryFilters}
          settings={settings}
        />
        <WidgetColumn>
          <RiskSummary loc={loc} settings={settings} />
          <AttendanceSummary settings={settings} />
        </WidgetColumn>
      </WidgetsContainer>
      <TableSection
        history={history}
        location={location}
        search={search}
        academicSummaryFilters={academicSummaryFilters}
        setAcademicSummaryFilters={setAcademicSummaryFilters}
        compareByOptions={compareByOptions}
        fetchDashboardTableDataRequest={fetchDashboardTableDataRequest}
        isCsvDownloading={isCsvDownloading}
        loadingTableData={loadingTableData}
        selectedPerformanceBand={selectedPerformanceBand}
        settings={settings}
        setSettings={setSettings}
        selectedCompareBy={selectedCompareBy}
        districtAveragesData={districtAveragesData}
        tableData={tableData}
        tableDataRequestError={tableDataRequestError}
        availableTestTypes={availableTestTypes}
      />
    </>
  )
}

export default ReportView
