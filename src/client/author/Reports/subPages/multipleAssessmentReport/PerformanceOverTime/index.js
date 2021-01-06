import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import { filter, get, includes, isEmpty } from 'lodash'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { getCsvDownloadingState } from '../../../ducks'
import AnalyseByFilter from '../common/components/filters/AnalyseByFilter'
import analyseByData from '../common/static/json/analyseByDropDown.json'
import ProgressChart from './components/charts/ProgressChart'
import PerformanceOverTimeTable from './components/table/PerformanceOvetTimeTable'
import {
  getPerformanceOverTimeRequestAction,
  getReportsPerformanceOverTime,
  getReportsPerformanceOverTimeLoader,
  getReportsPerformanceOverError,
} from './ducks'
import { parseData } from './utils/transformers'

const PerformanceOverTime = ({
  getPerformanceOverTimeRequest,
  performanceOverTime,
  isCsvDownloading,
  settings,
  loading,
  error,
  toggleFilter,
}) => {
  // support for tests pagination from backend
  const [pageFilters, setPageFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: 10,
  })
  const [analyseBy, setAnalyseBy] = useState(analyseByData[0])
  const [selectedTests, setSelectedTests] = useState([])

  // set initial page filters
  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [settings])

  // get paginated data
  useEffect(() => {
    const q = { ...settings.requestFilters, ...pageFilters }
    if ((q.termId || q.reportId) && pageFilters.page) {
      getPerformanceOverTimeRequest(q)
    }
  }, [pageFilters])

  useEffect(() => {
    const metricInfo = get(performanceOverTime, 'data.result.metricInfo', [])
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !metricInfo.length
    ) {
      toggleFilter(null, true)
    }
  }, [performanceOverTime])

  const rawData = get(performanceOverTime, 'data.result', {})
  const testsCount = rawData.testsCount || 0
  const dataWithTestInfo = filter(
    parseData(rawData),
    (test) => test.testName && test.testName !== 'N/A' // filter out tests without testName
  )
  // show tests from oldest to latest in the chart
  const chartData = [...dataWithTestInfo].reverse()
  const filteredTableData = filter(dataWithTestInfo, (test) =>
    selectedTests.length ? includes(selectedTests, test.uniqId) : true
  )

  if (loading) {
    return <SpinLoader position="fixed" />
  }

  if (isEmpty(dataWithTestInfo)) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  return (
    <>
      <StyledCard>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <StyledH3>How is assessment performance over time?</StyledH3>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <AnalyseByFilter
              onFilterChange={setAnalyseBy}
              analyseBy={analyseBy}
            />
          </Col>
        </Row>
        <ProgressChart
          data={chartData}
          analyseBy={analyseBy.key}
          selectedItems={selectedTests}
          setSelectedItems={setSelectedTests}
          bandInfo={rawData.bandInfo}
          backendPagination={{
            ...pageFilters,
            pageCount: Math.ceil(testsCount / pageFilters.pageSize) || 1,
          }}
          setBackendPagination={setPageFilters}
        />
      </StyledCard>
      <PerformanceOverTimeTable
        isCsvDownloading={isCsvDownloading}
        dataSource={filteredTableData}
        backendPagination={{
          ...pageFilters,
          itemsCount: testsCount,
        }}
        setBackendPagination={setPageFilters}
      />
    </>
  )
}

const enhance = connect(
  (state) => ({
    performanceOverTime: getReportsPerformanceOverTime(state),
    loading: getReportsPerformanceOverTimeLoader(state),
    error: getReportsPerformanceOverError(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getPerformanceOverTimeRequest: getPerformanceOverTimeRequestAction,
  }
)

export default enhance(PerformanceOverTime)

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
