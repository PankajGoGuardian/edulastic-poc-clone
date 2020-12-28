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
import { ResponseFrequencyTable } from './components/table/responseFrequencyTable'

import {
  getCsvDownloadingState,
  getPrintingState,
  getTestListSelector,
} from '../../../ducks'
import {
  getReportsResponseFrequency,
  getReportsResponseFrequencyLoader,
  getResponseFrequencyRequestAction,
  getReportsResponseFrequencyError,
} from './ducks'

import jsonData from './static/json/data.json'

const filterData = (data, filter) =>
  Object.keys(filter).length > 0
    ? data.filter((item) => filter[item.qType])
    : data

const ResponseFrequency = ({
  loading,
  error,
  isPrinting,
  isCsvDownloading,
  responseFrequency: res,
  getResponseFrequency,
  settings,
  testList,
  sharedReport,
  toggleFilter,
}) => {
  const isSharedReport = !!sharedReport?._id
  const [difficultItems, setDifficultItems] = useState(40)
  const [misunderstoodItems, setMisunderstoodItems] = useState(20)
  const [filter, setFilter] = useState({})

  const selectedTest = testList.find(
    (t) => t._id === settings.selectedTest.key
  ) || { _id: '', title: '' }
  const assessmentName = `${
    selectedTest.title
  } (ID:${selectedTest._id.substring(selectedTest._id.length - 5)})`

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: { ...settings.requestFilters },
        testId: settings.selectedTest.key,
      }
      getResponseFrequency(q)
    }
  }, [settings])

  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
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

  const filteredData = useMemo(() => filterData(obj.data, filter), [
    filter,
    obj.data,
  ])

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
    return <SpinLoader position="fixed" />
  }

  if (res.isRecommended) {
    return (
      <NoDataContainer fontSize="12px">
        The Questions for each student have been dynamically selected and as a
        result, question based comparision is unavailable for the assignment.
      </NoDataContainer>
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (isEmpty(res.metrics) || !settings.selectedTest.key) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }
  return (
    <div>
      <StyledContainer type="flex">
        <StyledCard>
          <StyledH3>
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
              <p>Set threshold to warn if % correct falls below:</p>
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
                Set threshold to warn if % frequency of an incorrect choice is
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
          data={filteredData}
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
    testList: getTestListSelector(state),
  }),
  {
    getResponseFrequency: getResponseFrequencyRequestAction,
  }
)

export default enhance(ResponseFrequency)
