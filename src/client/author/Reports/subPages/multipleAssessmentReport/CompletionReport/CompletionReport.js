import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import Chart from './components/chart'
import {
  actions,
  getCompletionChartDataLoading,
  getCompletionChartData,
  getCompletionReportTableData,
  getCompletionReportTableDataLoading,
} from './ducks'
import { getCsvDownloadingState } from '../../../ducks'
import CompletionReportTable from './components/table/CompletionReportTable'
import { Container } from './styled'

import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { getSelectedCompareBy } from '../../../common/util'
import {
  analyzeBy,
  compareByOptions,
  sortByMap,
} from '../common/utils/constants'
import { sortKeys } from './utils'
import {
  TABLE_SORT_ORDER_TYPES,
  tableToDBSortOrderMap,
} from '@edulastic/constants/reportUtils/common'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { omit } from 'lodash'

const pageSize = 2

const TABLE_PAGE_SIZE = 30
function CompletionReport({
  fetchCompletionReportChartDataRequest,
  fetchCompletionReportTableDataRequest,
  settings,
  setEnableReportSharing,
  toggleFilter,
  ddfilter,
  sharedReport,
  chartData,
  setMARSettings,
  chartDataLoading,
  isTableDataLoading,
  location,
  tableData: _tableData,
  isCsvDownloading,
  ...props
}) {
  const [analyseBy, setAnalyseBy] = useState(analyzeBy[0])

  const [statusColumnSortState, setStatusColumnSortState] = useState({
    sortKey: 'notStarted',
    sortOrder: 'desc',
  })

  const [testColumnSort, setTestColumnSort] = useState({
    sortKey: 'test',
    sortOrder: 'desc',
  })

  const [pageFilters, setPageFilters] = useState({
    page: 0,
    pageSize: TABLE_PAGE_SIZE,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize,
    pageCount: 0,
  })
  const tableData = useMemo(
    () => _tableData?.reportTableData?.data?.result?.tableMetricInfo,
    [_tableData]
  )

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      page: pagination.page,
      ...(pagination.page === 1 && { recompute: true }),
    }
    if (q.termId || q.reportId) {
      fetchCompletionReportChartDataRequest(q)

      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, pagination.page])

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [settings.requestFilters, settings.selectedCompareBy, analyseBy])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: settings.requestFilters.selectedCompareBy,
      ...pageFilters,
      requireTotalCount: pageFilters.page === 1,
      analyseBy: analyseBy.key,
      testOrder: testColumnSort.sortOrder,
      sortKey: sortByMap[statusColumnSortState.sortKey],
      sortOrder: statusColumnSortState.sortOrder,
      recompute: true,
    }
    const _q = omit(q, ['selectedCompareBy'])
    if ((q.termId || q.reportId) && pageFilters.page) {
      fetchCompletionReportTableDataRequest(_q)
      return () => toggleFilter(null, false)
    }
  }, [pageFilters, statusColumnSortState, testColumnSort])

  return (
    <Container>
      <Chart
        chartData={chartData}
        loading={chartDataLoading}
        pageSize={pageSize}
        pagination={pagination}
        setPagination={setPagination}
        {...props}
      />

      <CompletionReportTable
        // isTableDataLoading={isTableDataLoading}
        location={location}
        isCsvDownloading={isCsvDownloading}
        settings={settings}
        setMARSettings={setMARSettings}
        setAnalyseBy={setAnalyseBy}
        analyseBy={analyseBy}
        setStatusColumnSortState={setStatusColumnSortState}
        setTestColumnSort={setTestColumnSort}
        tableData={tableData}
      />
    </Container>
  )
}

const enhance = connect(
  (state) => ({
    chartData: getCompletionChartData(state),
    chartDataLoading: getCompletionChartDataLoading(state),
    tableData: getCompletionReportTableData(state),
    isTableDataLoading: getCompletionReportTableDataLoading(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  { ...actions }
)

export default enhance(CompletionReport)
