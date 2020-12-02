import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import { filter, get, includes } from 'lodash'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { StyledCard, StyledH3 } from '../../../common/styled'
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
}) => {
  useEffect(() => {
    const { requestFilters = {} } = settings
    const { termId, reportId } = requestFilters
    if (termId || reportId) {
      getPerformanceOverTimeRequest({ ...requestFilters })
    }
  }, [settings])

  const [analyseBy, setAnalyseBy] = useState(analyseByData[0])
  const [selectedTests, setSelectedTests] = useState([])

  const rawData = get(performanceOverTime, 'data.result', {})
  const dataWithTestInfo = filter(
    parseData(rawData),
    (test) => test.testName && test.testName !== 'N/A' // filter out tests without testName
  )
  const filteredTableData = filter(dataWithTestInfo, (test) =>
    selectedTests.length ? includes(selectedTests, test.uniqId) : true
  )

  if (loading) {
    return <SpinLoader position="fixed" />
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
          data={dataWithTestInfo}
          analyseBy={analyseBy.key}
          selectedItems={selectedTests}
          setSelectedItems={setSelectedTests}
          bandInfo={rawData.bandInfo}
        />
      </StyledCard>
      <PerformanceOverTimeTable
        isCsvDownloading={isCsvDownloading}
        dataSource={filteredTableData}
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
