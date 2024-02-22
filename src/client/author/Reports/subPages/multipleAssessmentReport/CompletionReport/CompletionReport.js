import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { omit, head, isEmpty } from 'lodash'
import {
  completionReportChartPageSize as barChartPageSize,
  analyzeBy,
  statusMap,
} from '../common/utils/constants'
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
import { getUserOrgId, getUserRole } from '../../../../src/selectors/user'
import { NoDataContainer } from '../../../common/styled'
import { getCompareByOptions } from '../../dataWarehouseReports/MultipleAssessmentReport/utils'

const TABLE_PAGE_SIZE = 50
function CompletionReport({
  fetchCompletionReportChartDataRequest,
  fetchCompletionReportTableDataRequest,
  resetCompletionReportData,
  settings,
  setEnableReportSharing,
  toggleFilter,
  ddfilter,
  sharedReport,
  chartData = [],
  setMARSettings,
  isChartDataLoading,
  isTableDataLoading,
  location,
  tableData,
  isCsvDownloading,
  getCsvData,
  role,
  districtId,
  ...props
}) {
  const compareByBasedOnRole = getCompareByOptions(role)
  const compareBy = head(compareByBasedOnRole)
  if (!settings.requestFilters?.termId) {
    settings.selectedCompareBy = compareBy
  }
  // have initital state when user navigate to completion report for the first time
  useEffect(() => {
    resetCompletionReportData()
  }, [])
  // chart
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: barChartPageSize,
    pageCount: 0,
  })

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

  // table
  const updateFilterDropdownCB = (selected) => {
    setMARSettings({ ...settings, selectedCompareBy: selected })
  }

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
    page: 1,
    pageSize: TABLE_PAGE_SIZE,
  })

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [settings.requestFilters, settings.selectedCompareBy])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: settings.selectedCompareBy.key,
      ...pageFilters,
      requireTotalCount: pageFilters.page === 1,
      testOrder: testColumnSort.sortOrder,
      sortKey: statusMap[statusColumnSortState.sortKey],
      sortOrder: statusColumnSortState.sortOrder,
      recompute: true,
    }
    const _q = omit(q, ['selectedCompareBy'])
    if ((q.termId || q.reportId) && pageFilters.page) {
      fetchCompletionReportTableDataRequest(_q)
      return () => toggleFilter(null, false)
    }
  }, [pageFilters, statusColumnSortState, testColumnSort])

  if (isEmpty(chartData) && !(isChartDataLoading && isTableDataLoading)) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }
  return (
    <EduIf condition={!(isChartDataLoading && isTableDataLoading)}>
      <EduThen>
        <Container>
          <Chart
            chartData={chartData}
            loading={isChartDataLoading}
            pageSize={barChartPageSize}
            pagination={pagination}
            setPagination={setPagination}
            {...props}
          />

          <CompletionReportTable
            isTableDataLoading={isTableDataLoading}
            location={location}
            isCsvDownloading={isCsvDownloading}
            settings={settings}
            setMARSettings={setMARSettings}
            setAnalyseBy={setAnalyseBy}
            analyseBy={analyseBy}
            setStatusColumnSortState={setStatusColumnSortState}
            setTestColumnSort={setTestColumnSort}
            tableData={tableData}
            compareBy={settings.selectedCompareBy}
            setCompareBy={updateFilterDropdownCB}
            getCsvData={getCsvData}
            pageFilters={pageFilters}
            setPageFilters={setPageFilters}
            sharedReport={sharedReport}
            role={role}
            districtId={districtId}
            compareByBasedOnRole={compareByBasedOnRole}
          />
        </Container>
      </EduThen>
      <EduElse>
        <SpinLoader
          tip="Please wait while we gather the required information..."
          position="fixed"
        />
      </EduElse>
    </EduIf>
  )
}

const enhance = connect(
  (state) => ({
    chartData: getCompletionChartData(state),
    isChartDataLoading: getCompletionChartDataLoading(state),
    tableData: getCompletionReportTableData(state),
    isTableDataLoading: getCompletionReportTableDataLoading(state),
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    districtId: getUserOrgId(state),
  }),
  { ...actions }
)

export default enhance(CompletionReport)
