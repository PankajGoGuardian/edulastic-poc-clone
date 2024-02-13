import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Empty } from 'antd'
import Chart from './components/chart'
import {
  actions,
  getCompletionChartDataLoading,
  getCompletionChartData,
} from './ducks'

const pageSize = 2

function CompletionReport({
  fetchCompletionReportChartDataRequest,
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
  const [pageNo, setPageNo] = useState(1)
  useEffect(() => {
    const q = { ...settings.requestFilters, page: pageNo }
    if (q.termId || q.reportId) {
      fetchCompletionReportChartDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, pageNo])
  console.log({ chartData })
  return (
    <>
      {chartData.length ? (
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
      ) : (
        <Empty
          className="ant-empty-small"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ textAlign: 'center', margin: '10px 0' }}
          description="No matching results"
        />
      )}
    </>
  )
}

const enhance = connect(
  (state) => ({
    chartData: getCompletionChartData(state),
    chartDataLoading: getCompletionChartDataLoading(state),
  }),
  { ...actions }
)

export default enhance(CompletionReport)
