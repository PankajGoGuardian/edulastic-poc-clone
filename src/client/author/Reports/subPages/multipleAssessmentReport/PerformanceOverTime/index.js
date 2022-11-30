import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import { filter, get, includes, isEmpty, keyBy } from 'lodash'
import React, { useState, useEffect, useMemo } from 'react'
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
  resetPerformanceOverTimeAction,
} from './ducks'
import { parseData } from './utils/transformers'

const PerformanceOverTime = ({
  getPerformanceOverTimeRequest,
  resetPerformanceOverTime,
  performanceOverTime,
  isCsvDownloading,
  settings,
  loading,
  error,
  MARFilterData,
  sharedReport,
  toggleFilter,
  ddfilter,
}) => {
  const sharedReportFilters = useMemo(
    () =>
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport._id }
        : null,
    [sharedReport]
  )

  // support for tests pagination from backend
  const [pageFilters, setPageFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: 10,
  })
  const [analyseBy, setAnalyseBy] = useState(analyseByData[0])
  const [selectedTests, setSelectedTests] = useState([])

  useEffect(() => () => resetPerformanceOverTime(), [])

  // set initial page filters
  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  // get paginated data
  useEffect(() => {
    const q = { ...settings.requestFilters, ...pageFilters, ...ddfilter }
    if ((q.termId || q.reportId) && pageFilters.page) {
      getPerformanceOverTimeRequest(q)
    }
  }, [pageFilters])

  useEffect(() => {
    const metricInfo = get(performanceOverTime, 'data.result.metricInfo', [])
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(performanceOverTime) &&
      !metricInfo.length
    ) {
      toggleFilter(null, true)
    }
  }, [performanceOverTime])

  const rawData = useMemo(() => {
    const profiles = get(MARFilterData, 'data.result.bandInfo', [])
    const bandInfo =
      profiles.find(
        (profile) =>
          profile._id ===
          (sharedReportFilters || settings.requestFilters).profileId
      )?.performanceBand ||
      profiles[0]?.performanceBand ||
      []
    const thresholdNameIndexed = keyBy(bandInfo, 'threshold')
    const _rawData = get(performanceOverTime, 'data.result', {})
    const _metricInfo = (_rawData.metricInfo || []).map((item) => ({
      ...item,
      bandName: thresholdNameIndexed[item.bandScore]?.name,
    }))
    return { ..._rawData, metricInfo: _metricInfo, bandInfo }
  }, [performanceOverTime])

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
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (isEmpty(dataWithTestInfo)) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  return (
    <>
      <StyledCard>
        <Row>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <StyledH3 fontSize="16px" margin="0">
              Performance in Assessments over time
            </StyledH3>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <AnalyseByFilter
              onFilterChange={setAnalyseBy}
              analyseBy={analyseBy}
            />
          </Col>
        </Row>
        <ProgressChart
          data-testid="progressChart"
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
        showTestIncompleteText={!!rawData.incompleteTests?.length}
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
    resetPerformanceOverTime: resetPerformanceOverTimeAction,
  }
)

export default enhance(PerformanceOverTime)

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
