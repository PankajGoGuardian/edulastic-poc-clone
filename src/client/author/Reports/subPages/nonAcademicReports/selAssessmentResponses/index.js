import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { SpinLoader } from '@edulastic/common'
import { NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { StyledContainer } from './components/styled'
import { SELAssessmentTable } from './components/table/SELAssessmentTable'

import { getCsvDownloadingState, getPrintingState } from '../../../ducks'
import {
  getReportsSELAssessmentResponses,
  getReportsSELAssessmentResponsesLoader,
  getSELAssessmentResponsesRequestAction,
  getReportsSELAssessmentResponsesError,
  resetSELAssessmentResponsesAction,
} from './ducks'

import jsonData from './static/json/data.json'

const filterData = (data, filter) =>
  Object.keys(filter).length > 0
    ? data.filter((item) => filter[item.qType])
    : data

const SELAssessmentResponses = ({
  loading,
  error,
  isPrinting,
  isCsvDownloading,
  SELResponses: res,
  getSELAssessmentResponses,
  resetSELAssessmentResponses,
  settings,
  sharedReport,
  toggleFilter,
  demographicFilters,
}) => {
  const isSharedReport = !!sharedReport?._id
  const difficultItems = 40
  const misunderstoodItems = 20
  const filter = {}

  useEffect(() => () => resetSELAssessmentResponses(), [])

  useEffect(() => {
    if (settings.requestFilters && settings.selectedTest?.key) {
      const q = {
        requestFilters: { ...settings.requestFilters, ...demographicFilters },
        testId: settings.selectedTest?.key,
      }
      getSELAssessmentResponses(q)
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
      }
    }
    return _obj
  }, [res])

  const filteredData = useMemo(() => filterData(obj.data, filter), [
    filter,
    obj.data,
  ])

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

  if (isEmpty(res.metrics) || !settings.selectedTest?.key) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }
  return (
    <div>
      <StyledContainer type="flex">
        <SELAssessmentTable
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

SELAssessmentResponses.propTypes = {
  loading: PropTypes.bool.isRequired,
  isPrinting: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  SELAssessmentResponses: reportPropType.isRequired,
  getSELAssessmentResponses: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
}

const enhance = connect(
  (state) => ({
    loading: getReportsSELAssessmentResponsesLoader(state),
    error: getReportsSELAssessmentResponsesError(state),
    isPrinting: getPrintingState(state),
    isCsvDownloading: getCsvDownloadingState(state),
    SELResponses: getReportsSELAssessmentResponses(state),
  }),
  {
    getSELAssessmentResponses: getSELAssessmentResponsesRequestAction,
    resetSELAssessmentResponses: resetSELAssessmentResponsesAction,
  }
)

export default enhance(SELAssessmentResponses)
