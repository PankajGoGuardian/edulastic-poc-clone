import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Chart from './components/chart'
import { actions, getCompletionReportChartData } from './ducks'

function CompletionReport({
  fetchCompletionReportChartDataRequest,
  settings,
  setEnableReportSharing,
  toggleFilter,
  ddfilter,
  sharedReport,
  chartData,
  setMARSettings,
  ...props
}) {
  // const [pageNo, setPageNo] = useState(1)
  useEffect(() => {
    const q = { ...settings.requestFilters }
    if (q.termId || q.reportId) {
      fetchCompletionReportChartDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])
  console.log({ chartData })
  return <Chart chartData={chartData} {...props} />
}

const enhance = connect(
  (state) => ({
    chartData: getCompletionReportChartData(state),
  }),
  { ...actions }
)

export default enhance(CompletionReport)
