import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { Col, Row } from 'antd'
import { SpinLoader } from '@edulastic/common'
import { StyledH3, StyledSlider, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { StackedBarChartContainer } from './components/charts/stackedBarChartContainer'
import { StyledCard, StyledContainer } from './components/styled'
import ResponseFrequencyTable from './components/table/responseFrequencyTable'

import { getCsvDownloadingState, getPrintingState } from '../../../ducks'
import {
  getReportsResponseFrequency,
  getReportsResponseFrequencyLoader,
  getResponseFrequencyRequestAction,
  getReportsResponseFrequencyError,
  resetResponseFrequencyAction,
} from './ducks'

import jsonData from './static/json/data.json'
import { getAssessmentName } from '../../../common/util'
import { filterData, getTableData } from './utils'

const ResponseFrequency = ({
  loading,
  error,
  isPrinting,
  isCsvDownloading,
  responseFrequency: res,
  getResponseFrequency,
  resetResponseFrequency,
  settings,
  sharedReport,
  toggleFilter,
  demographicFilters,
}) => {
  const isSharedReport = !!sharedReport?._id
  const [difficultItems, setDifficultItems] = useState(40)
  const [misunderstoodItems, setMisunderstoodItems] = useState(20)
  const [filter, setFilter] = useState({})

  const assessmentName = getAssessmentName(
    res?.meta?.test || settings.selectedTest
  )

  useEffect(() => () => resetResponseFrequency(), [])

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: { ...settings.requestFilters, ...demographicFilters },
        testId: settings.selectedTest.key,
      }
      getResponseFrequency(q)
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedTest?.key, settings.requestFilters])

  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(res) &&
      isEmpty(res?.metrics)
    ) {
      toggleFilter(null, true)
    }
  }, [res])

  const obj = useMemo(() => {
    let _obj = {
      metaData: {},
      data: [],
      filteredData: [],
    }
    if (res && res.metrics && !isEmpty(res.metrics)) {
      const arr = Object.keys(res.metrics).map((key) => {
        res.metrics[key].uid = key
        res.metrics[key].maxScore = res.metrics[key].maxScore || '-'
        return res.metrics[key]
      })

      _obj = {
        data: [...arr],
        filteredData: [...arr],
        metaData: { testName: assessmentName },
      }
    }
    return _obj
  }, [res])

  const tableData = useMemo(() => {
    const filteredData = filterData(obj.data, filter)
    return getTableData(filteredData, isCsvDownloading)
  }, [filter, obj.data, isCsvDownloading])

  const onChangeDifficultSlider = (value) => {
    setDifficultItems(value)
  }

  const onChangeMisunderstoodSlider = (value) => {
    setMisunderstoodItems(value)
  }

  const onBarClickCB = (key) => {
    const _filter = { ...filter }
    if (_filter[key]) {
      delete _filter[key]
    } else {
      _filter[key] = true
    }
    setFilter(_filter)
  }

  const onResetClickCB = () => {
    setFilter({})
  }

  if (loading) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (res.isRecommended) {
    return (
      <NoDataContainer fontSize="12px">
        The Questions for each student have been dynamically selected and as a
        result, question based comparison is unavailable for the assignment.
      </NoDataContainer>
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (isEmpty(res.metrics) || !settings.selectedTest.key) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }
  return (
    <div>
      <StyledContainer type="flex">
        <StyledCard>
          <StyledH3 data-testid="title">
            Question Type performance for Assessment: {assessmentName}
          </StyledH3>
          <StackedBarChartContainer
            data={obj.data}
            assessment={obj.metaData}
            filter={filter}
            onBarClickCB={onBarClickCB}
            onResetClickCB={onResetClickCB}
          />
        </StyledCard>
        <StyledCard>
          <Row type="flex" justify="center" className="question-area">
            <Col className="question-container">
              <p>What are the most difficult items?</p>
              <p>Highlight performance% in red if it falls below:</p>
              <Row type="flex" justify="start" align="middle">
                <Col className="answer-slider-percentage">
                  <span>{difficultItems}%</span>
                </Col>
                <Col className="answer-slider">
                  <StyledSlider
                    data-slider-id="difficult"
                    defaultValue={difficultItems}
                    onChange={onChangeDifficultSlider}
                  />
                </Col>
              </Row>
            </Col>
            <Col className="question-container">
              <p>What items are misunderstood?</p>
              <p>
                Highlight incorrect answer choices with gray if response% is
                above:
              </p>
              <Row type="flex" justify="start" align="middle">
                <Col className="answer-slider-percentage">
                  <span>{misunderstoodItems}%</span>
                </Col>
                <Col className="answer-slider">
                  <StyledSlider
                    data-slider-id="misunderstood"
                    defaultValue={misunderstoodItems}
                    onChange={onChangeMisunderstoodSlider}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </StyledCard>
        <ResponseFrequencyTable
          data={tableData}
          columns={jsonData.columns}
          assessment={obj.metaData}
          correctThreshold={difficultItems}
          incorrectFrequencyThreshold={misunderstoodItems}
          isPrinting={isPrinting}
          isCsvDownloading={isCsvDownloading}
          isSharedReport={isSharedReport}
        />
      </StyledContainer>
    </div>
  )
}
const reportPropType = PropTypes.shape({
  metricInfo: PropTypes.array,
})

ResponseFrequency.propTypes = {
  loading: PropTypes.bool.isRequired,
  isPrinting: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  responseFrequency: reportPropType.isRequired,
  getResponseFrequency: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
}

const enhance = connect(
  (state) => ({
    loading: getReportsResponseFrequencyLoader(state),
    error: getReportsResponseFrequencyError(state),
    isPrinting: getPrintingState(state),
    isCsvDownloading: getCsvDownloadingState(state),
    responseFrequency: getReportsResponseFrequency(state),
  }),
  {
    getResponseFrequency: getResponseFrequencyRequestAction,
    resetResponseFrequency: resetResponseFrequencyAction,
  }
)

export default enhance(ResponseFrequency)
