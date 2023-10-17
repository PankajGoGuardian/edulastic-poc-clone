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
import useTableFilters from './hooks/useTableFilters'

function ReportView({
  history,
  location,
  search,
  performanceBandList,
  bandInfo,
  setAcademicSummaryFilters,
  compareByOptions,
  isCsvDownloading,
  settings,
  setSettings,
  selectedCompareBy,
  fetchDashboardTableDataRequest,
  loadingTableData,
  loadingTableDataWithFilters,
  tableDataRequestError,
  districtAveragesData,
  tableData,
  loc,
  availableTestTypes,
  attendanceBandInfo,
}) {
  const { academicSummaryFilters } = settings
  const internalPerformanceBandsList = bandInfo.map(
    ({ _id, name, performanceBand }) => ({
      key: _id,
      title: name,
      performanceBand,
    })
  )

  const {
    tableFilters,
    setTableFilters,
    pageFilters,
    setPageFilters,
    updateTableFiltersCB,
    onTableHeaderCellClick,
    getTableDrillDownUrl,
  } = useTableFilters({
    history,
    location,
    search,
    defaultCompareBy: selectedCompareBy,
    settings,
    setSettings,
  })

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
          performanceBandList={performanceBandList}
          availableTestTypes={availableTestTypes}
          widgetFilters={academicSummaryFilters}
          setWidgetFilters={setAcademicSummaryFilters}
          tableFilters={tableFilters}
          setTableFilters={setTableFilters}
          settings={settings}
        />
        <WidgetColumn>
          <RiskSummary loc={loc} settings={settings} />
          <AttendanceSummary
            location={location}
            history={history}
            settings={settings}
            setSettings={setSettings}
            attendanceBandInfo={attendanceBandInfo}
          />
        </WidgetColumn>
      </WidgetsContainer>
      <TableSection
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pageFilters={pageFilters}
        setPageFilters={setPageFilters}
        updateTableFiltersCB={updateTableFiltersCB}
        onTableHeaderCellClick={onTableHeaderCellClick}
        getTableDrillDownUrl={getTableDrillDownUrl}
        academicSummaryFilters={academicSummaryFilters}
        setAcademicSummaryFilters={setAcademicSummaryFilters}
        compareByOptions={compareByOptions}
        fetchDashboardTableDataRequest={fetchDashboardTableDataRequest}
        isCsvDownloading={isCsvDownloading}
        loadingTableData={loadingTableData}
        performanceBandsList={internalPerformanceBandsList}
        loadingTableDataWithFilters={loadingTableDataWithFilters}
        settings={settings}
        districtAveragesData={districtAveragesData}
        tableData={tableData}
        tableDataRequestError={tableDataRequestError}
        availableTestTypes={availableTestTypes}
      />
    </>
  )
}

export default ReportView
