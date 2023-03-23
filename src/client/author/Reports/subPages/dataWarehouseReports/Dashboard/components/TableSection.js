import React, { useEffect } from 'react'
import DashboardTableFilters from './TableFilters'
import DashboardTable from './Table'
import useTableFilters from '../hooks/useTableFilters'
import { academicSummaryFiltersTypes, getTableApiQuery } from '../utils'

function TableSection({
  location,
  compareByOptions,
  selectedPerformanceBand,
  isCsvDownloading,
  settings,
  setSettings,
  selectedCompareBy,
  academicSummaryFilters,
  fetchDashboardTableDataRequest,
  toggleFilter,
  tableData,
  loadingTableData,
  tableDataRequestError,
}) {
  const defaultCompareBy = selectedCompareBy
    ? compareByOptions.find((o) => o.key === selectedCompareBy)
    : compareByOptions[0]

  const {
    tableFilters,
    setTableFilters,
    updateTableFiltersCB,
    onTableHeaderCellClick,
    getTableDrillDownUrl,
  } = useTableFilters({ location, defaultCompareBy, settings, setSettings })

  useEffect(() => {
    const q = getTableApiQuery(
      settings,
      tableFilters,
      academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND].key
    )
    if (q.termId || q.reportId) {
      fetchDashboardTableDataRequest(q)
      // TODO Why toogle Filter in cleanup function ?
      return () => toggleFilter(null, false)
    }
  }, [
    settings.requestFilters,
    tableFilters,
    academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND],
  ])
  return (
    <>
      <DashboardTableFilters
        tableFilters={tableFilters}
        updateTableFiltersCB={updateTableFiltersCB}
        compareByOptions={compareByOptions}
      />
      <DashboardTable
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        onTableHeaderCellClick={onTableHeaderCellClick}
        getTableDrillDownUrl={getTableDrillDownUrl}
        tableData={tableData}
        selectedPerformanceBand={selectedPerformanceBand}
        loadingTableData={loadingTableData}
        tableDataRequestError={tableDataRequestError}
        isCsvDownloading={isCsvDownloading}
      />
    </>
  )
}

export default TableSection
