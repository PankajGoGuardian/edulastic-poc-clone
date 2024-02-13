import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Empty } from 'antd'
import Chart from './components/chart'
import {
  actions,
  getCompletionChartDataLoading,
  getCompletionChartData,
  getCompletionReportTableData,
} from './ducks'
import CompletionReportTable from './components/table/CompletionReportTable'
import { Container } from './styled'

import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { getSelectedCompareBy } from '../../../common/util'
import { analyzeBy, compareByOptions } from '../common/utils/constants'

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
  ...props
}) {
  const [navBtnVisible, setNavBtnVisible] = useState({
    leftNavVisible: false,
    rightNavVisible: false,
  })
  const [compareBy, setCompareBy] = useState(compareByOptions[0])
  const [analyseBy, setAnalyseBy] = useState(analyzeBy[0])
  const [pageNo, setPageNo] = useState(1)

  const [pageFilters, setPageFilters] = useState({
    page: 0,
    pageSize: TABLE_PAGE_SIZE,
  })
  // const [pageNo, setPageNo] = useState(1)

  // const search = useUrlSearchParams(location)
  // const selectedCompareBy = getSelectedCompareBy({
  //   search,
  //   settings,
  //   compareByOptions,
  // })
  useEffect(() => {
    const q = { ...settings.requestFilters, page: pageNo || 1 }
    if (q.termId || q.reportId) {
      fetchCompletionReportChartDataRequest(q)

      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, pageNo])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: 'school',
      // sortKey: sortFilters.sortKey,
      // sortOrder: tableToDBSortOrderMap[sortFilters.sortOrder],
      // ...pageFilters,
      // requireTotalCount: pageFilters.page === 1,
    }
    if ((q.termId || q.reportId) && pageFilters.page) {
      fetchCompletionReportTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [pageFilters])

  return (
    <Container>
      <Chart
        chartData={chartData}
        setNavBtnVisible={setNavBtnVisible}
        navBtnVisible={navBtnVisible}
        loading={chartDataLoading}
        pageSize={pageSize}
        setPageNo={setPageNo}
        pageNo={pageNo}
        {...props}
      />
      <CompletionReportTable
        settings={settings}
        setMARSettings={setMARSettings}
      />
    </Container>
  )
}

const enhance = connect(
  (state) => ({
    chartData: getCompletionChartData(state),
    chartDataLoading: getCompletionChartDataLoading(state),
    tableData: getCompletionReportTableData(state),
  }),
  { ...actions }
)

export default enhance(CompletionReport)
