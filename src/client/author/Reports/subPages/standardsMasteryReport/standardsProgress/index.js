import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import { Row } from 'antd'
import { SpinLoader } from '@edulastic/common'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import SignedStackedBarChartContainer from './components/charts/SignedStackedBarChartContainer'
import StandardsProgressTable from './components/table/StandardsProgressTable'

import { getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getReportsStandardsProgress,
  getReportsStandardsProgressLoader,
  getStandardsProgressRequestAction,
  getReportsStandardsProgressError,
} from './ducks'

import {
  getDenormalizedData,
  getFilteredDenormalizedData,
} from './utils/transformers'
import dropDownData from './static/dropDownData.json'

const { compareByData, analyseByData } = dropDownData

const StandardsProgress = ({
  loading,
  error,
  isCsvDownloading,
  location,
  toggleFilter,
  settings,
  standardsFilters,
  standardsProgress,
  getStandardsProgressRequest,
  ddfilter,
  userRole,
  sharedReport,
}) => {
  const sharedReportFilters = useMemo(
    () =>
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
    [sharedReport]
  )
  const scaleInfo = get(standardsFilters, 'data.result.scaleInfo', [])
  const selectedScale =
    (
      scaleInfo.find(
        (s) =>
          s._id === (sharedReportFilters || settings.requestFilters).profileId
      ) || scaleInfo[0]
    )?.scale || []
  // filter compareBy options according to role
  const compareByDataFiltered = compareByData.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  const [tableFilters, setTableFilters] = useState({
    compareBy:
      compareByDataFiltered.find(
        (o) => o.key === location?.state?.compareByKey
      ) || compareByDataFiltered[0],
    analyseBy: analyseByData[3],
  })
  // support for backend pagination of tests
  const [pageFilters, setPageFilters] = useState({
    barsPageNumber: 0, // set to 0 initially to prevent multiple api request on tab change
    barsPageSize: 10,
    tablePageNumber: 0,
    tablePageSize: 50,
  })

  // set initial page filters
  useEffect(() => {
    setPageFilters({ ...pageFilters, barsPageNumber: 1, tablePageNumber: 1 })
  }, [settings])
  useEffect(() => {
    if (pageFilters.barsPageNumber) {
      setPageFilters({ ...pageFilters, tablePageNumber: 1 })
    }
  }, [tableFilters.compareBy.key])
  // get paginated data
  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: tableFilters.compareBy.key,
      ...pageFilters,
    }
    if (
      (q.termId || q.reportId) &&
      pageFilters.barsPageNumber &&
      pageFilters.tablePageNumber
    ) {
      getStandardsProgressRequest(q)
    }
  }, [pageFilters])

  const testInfo = get(standardsProgress, 'data.result.testInfo', [])
  const totalTestCount = get(standardsProgress, 'data.result.totalTestCount', 0)
  const totalRowCount = get(standardsProgress, 'data.result.totalRowCount', 0)

  const [
    filteredDenormalizedData,
    filteredDenormalizedTableData,
  ] = useMemo(() => {
    const [denormalizedData, denormalizedTableData] = getDenormalizedData(
      standardsProgress,
      tableFilters.compareBy.key
    )
    return getFilteredDenormalizedData(
      denormalizedData,
      denormalizedTableData,
      ddfilter
    )
  }, [standardsProgress, ddfilter, tableFilters.compareBy])

  // show filters section if data is empty
  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !filteredDenormalizedData?.length
    ) {
      toggleFilter(null, true)
    }
  }, [filteredDenormalizedData])

  if (loading) {
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!filteredDenormalizedData?.length) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }

  return (
    <div>
      <StyledCard>
        <Row type="flex" justify="start">
          <StyledH3>Mastery Level Distribution by Test</StyledH3>
        </Row>
        <Row>
          <SignedStackedBarChartContainer
            data={filteredDenormalizedData}
            masteryScale={selectedScale}
            backendPagination={{
              page: pageFilters.barsPageNumber,
              pageSize: pageFilters.barsPageSize,
              pageCount:
                Math.ceil(totalTestCount / pageFilters.barsPageSize) || 1,
            }}
            setBackendPagination={({ page }) =>
              setPageFilters({
                ...pageFilters,
                barsPageNumber: page,
                tablePageNumber: 1,
              })
            }
          />
        </Row>
      </StyledCard>
      <StyledCard>
        <StandardsProgressTable
          data={filteredDenormalizedTableData}
          testInfo={testInfo}
          masteryScale={selectedScale}
          tableFilters={tableFilters}
          setTableFilters={setTableFilters}
          tableFilterOptions={{
            compareByData: compareByDataFiltered,
            analyseByData,
          }}
          isCsvDownloading={isCsvDownloading}
          backendPagination={{
            page: pageFilters.tablePageNumber,
            pageSize: pageFilters.tablePageSize,
            pageCount:
              Math.ceil(totalRowCount / pageFilters.tablePageSize) || 1,
          }}
          setBackendPagination={({ page }) =>
            setPageFilters({
              ...pageFilters,
              tablePageNumber: page,
            })
          }
        />
      </StyledCard>
    </div>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsStandardsProgressLoader(state),
      error: getReportsStandardsProgressError(state),
      isCsvDownloading: getCsvDownloadingState(state),
      standardsFilters: getReportsStandardsFilters(state),
      standardsProgress: getReportsStandardsProgress(state),
    }),
    {
      getStandardsProgressRequest: getStandardsProgressRequestAction,
    }
  )
)

export default enhance(StandardsProgress)
