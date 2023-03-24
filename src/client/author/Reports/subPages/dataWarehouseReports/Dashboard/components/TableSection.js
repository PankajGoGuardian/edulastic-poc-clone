import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { Spin } from 'antd'
import { EduIf, EduThen, EduElse } from '@edulastic/common'
import DashboardTableFilters from './TableFilters'
import DashboardTable from './Table'
import useTableFilters from '../hooks/useTableFilters'
import { academicSummaryFiltersTypes, getTableApiQuery } from '../utils'
import BackendPagination from '../../../../common/components/BackendPagination'
import {
  DataSizeExceededContainer,
  StyledEmptyContainer,
  TableContainer,
} from './common/styledComponents'

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
  const {
    tableFilters,
    setTableFilters,
    updateTableFiltersCB,
    onTableHeaderCellClick,
    getTableDrillDownUrl,
    setTablePagination,
  } = useTableFilters({
    location,
    defaultCompareBy: selectedCompareBy,
    settings,
    setSettings,
  })

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
      <TableContainer>
        <Spin spinning={loadingTableData}>
          <EduIf condition={!loadingTableData}>
            <EduIf
              condition={
                !tableDataRequestError && !isEmpty(tableData?.metricInfo)
              }
            >
              <EduThen>
                <DashboardTable
                  tableFilters={tableFilters}
                  setTableFilters={setTableFilters}
                  onTableHeaderCellClick={onTableHeaderCellClick}
                  getTableDrillDownUrl={getTableDrillDownUrl}
                  tableData={tableData}
                  selectedPerformanceBand={selectedPerformanceBand}
                  loadingTableData={loadingTableData}
                  isCsvDownloading={isCsvDownloading}
                />
                <BackendPagination
                  itemsCount={100}
                  backendPagination={{
                    page: tableFilters.page,
                    pageSize: tableFilters.pageSize,
                  }}
                  setBackendPagination={setTablePagination}
                />
              </EduThen>
              <EduElse>
                <EduIf condition={tableDataRequestError?.dataSizeExceeded}>
                  <EduThen>
                    <DataSizeExceededContainer>
                      {tableDataRequestError?.message}
                    </DataSizeExceededContainer>
                  </EduThen>
                  <EduElse>
                    <StyledEmptyContainer />
                  </EduElse>
                </EduIf>
              </EduElse>
            </EduIf>
          </EduIf>
        </Spin>
      </TableContainer>
    </>
  )
}

export default TableSection
