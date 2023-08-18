import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, pickBy, isEmpty } from 'lodash'

import { Row } from 'antd'
import { SpinLoader, useApiQuery } from '@edulastic/common'
import { standardsProgressApi } from '@edulastic/api'
import { report as reportTypes, reportUtils } from '@edulastic/constants'
import { getErrorMessage } from '../../../common/util'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import { TableContainer } from './components/styled'
import SignedStackedBarChartContainer from './components/charts/SignedStackedBarChartContainer'
import Table from './components/table'

import { generateCSVAction, getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getStandardsGradebookSkillInfoAction,
  getStandardsGradebookSkillInfo,
  getSkillInfoLoader,
  getReportsStandardsGradebookError,
} from '../standardsGradebook/ducks'

import {
  getSkillInfoApiQuery,
  getSummaryApiQuery,
  getDetailsApiQuery,
  getTestInfoApiQuery,
  getIsReportDataEmpty,
  getGenerateCsvParams,
  getPaginatedTestInfoMetrics,
} from './utils/transformers'
import useErrorNotification from '../../../common/hooks/useErrorNotification'

const {
  CHART_PAGE_SIZE,
  TABLE_PAGE_SIZE,
  SortKeys,
  SortOrders,
  AnalyseByKeys,
  CompareByDropDownData,
  AnalyseByDropDownData,
  getChartMetrics,
  getTableMetrics,
} = reportUtils.standardsProgress

const StandardsProgress = ({
  errorFetchingSkillInfo,
  isCsvDownloading,
  location,
  toggleFilter,
  settings,
  standardsFilters,
  skillInfo,
  getSkillInfoRequest,
  loadingSkillInfo,
  ddfilter,
  userRole,
  sharedReport,
  generateCSV,
}) => {
  const [sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
      !!sharedReport?._id,
    ],
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
  const compareByDropDownDataFiltered = CompareByDropDownData.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  const [tableFilters, setTableFilters] = useState({
    compareBy:
      compareByDropDownDataFiltered.find(
        (o) => o.key === location?.state?.compareByKey
      ) || compareByDropDownDataFiltered[0],
    analyseBy: AnalyseByDropDownData.find(
      (o) => o.key === AnalyseByKeys.MASTERY_SCORE
    ),
    rowPage: 1,
    rowPageSize: TABLE_PAGE_SIZE,
    sortKey: SortKeys.DIMENSION,
    sortOrder: SortOrders.ASCEND,
  })

  const [chartFilters, setChartFilters] = useState({
    barPage: 1,
    barPageSize: CHART_PAGE_SIZE,
  })

  const ddRequestFilters = useMemo(
    () => pickBy(ddfilter, (f) => f !== 'all' && !isEmpty(f)),
    [ddfilter]
  )

  useEffect(() => {
    const q = getSkillInfoApiQuery(settings.requestFilters)
    if (q.termId || q.reportId) {
      getSkillInfoRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  const testInfoQuery = useMemo(
    () =>
      getTestInfoApiQuery(settings.requestFilters, ddRequestFilters, skillInfo),
    [skillInfo]
  )

  const {
    data: testInfo,
    loading: loadingTestInfo,
    error: errorFetchingTestInfo,
  } = useApiQuery(
    standardsProgressApi.fetchStandardsProgressTestInfo,
    [testInfoQuery],
    {
      enabled:
        (testInfoQuery.termId && testInfoQuery.standardId) ||
        testInfoQuery.reportId,
      deDuplicate: false,
    }
  )

  const testInfoErrorMsg = getErrorMessage(
    errorFetchingTestInfo,
    400,
    'Error fetching Test Info.'
  )
  useErrorNotification(testInfoErrorMsg, errorFetchingTestInfo)

  // reset table page number to 1 when chart filters are changed
  useEffect(() => {
    setTableFilters({
      ...tableFilters,
      rowPage: 1,
    })
  }, [chartFilters])

  const { testInfo: testInfoMetrics = [], totalTestCount = 0 } = testInfo || {}

  const paginatedTestInfoMetrics = useMemo(
    () => getPaginatedTestInfoMetrics(testInfoMetrics, chartFilters),
    [testInfoMetrics, chartFilters]
  )

  const summaryQuery = useMemo(
    () =>
      getSummaryApiQuery(
        settings.requestFilters,
        ddRequestFilters,
        skillInfo,
        paginatedTestInfoMetrics
      ),
    [paginatedTestInfoMetrics]
  )

  const {
    data: summary,
    loading: loadingSummary,
    error: errorFetchingSummary,
  } = useApiQuery(
    standardsProgressApi.fetchStandardsProgressSummary,
    [summaryQuery],
    {
      enabled:
        (!!paginatedTestInfoMetrics.length &&
          summaryQuery.termId &&
          summaryQuery.standardId) ||
        summaryQuery.reportId,
      deDuplicate: false,
    }
  )

  const summaryErrorMsg = getErrorMessage(
    errorFetchingSummary,
    400,
    'Error fetching Summary data.'
  )
  useErrorNotification(summaryErrorMsg, errorFetchingSummary)

  // Reset table page number when compare by, sort key or sort order is changed
  useEffect(() => {
    setTableFilters({
      ...tableFilters,
      rowPage: 1,
    })
  }, [tableFilters.compareBy.key, tableFilters.sortKey, tableFilters.sortOrder])

  const detailsQuery = useMemo(
    () =>
      getDetailsApiQuery(
        settings.requestFilters,
        ddRequestFilters,
        tableFilters,
        skillInfo,
        paginatedTestInfoMetrics
      ),
    [
      paginatedTestInfoMetrics,
      tableFilters.rowPage,
      tableFilters.compareBy.key,
      tableFilters.sortKey,
      tableFilters.sortOrder,
    ]
  )

  const {
    data: details,
    loading: loadingDetails,
    error: errorFetchingDetails,
  } = useApiQuery(
    standardsProgressApi.fetchStandardsProgressDetails,
    [detailsQuery],
    {
      enabled:
        (!!paginatedTestInfoMetrics.length &&
          detailsQuery.termId &&
          detailsQuery.rowPage &&
          detailsQuery.standardId) ||
        detailsQuery.reportId,

      deDuplicate: false,
    }
  )

  const detailsErrorMsg = getErrorMessage(
    errorFetchingDetails,
    400,
    'Error fetching Details data.'
  )
  useErrorNotification(detailsErrorMsg, errorFetchingDetails)

  const { metrics: chartMetrics } = useMemo(
    () => getChartMetrics(summary, paginatedTestInfoMetrics),
    [summary, paginatedTestInfoMetrics]
  )

  const { metrics: tableMetrics, totalRowCount } = useMemo(
    () => getTableMetrics(details),
    [details]
  )

  const error =
    errorFetchingSkillInfo ||
    errorFetchingTestInfo ||
    errorFetchingDetails ||
    errorFetchingSummary ||
    null

  const loading = [
    loadingSkillInfo,
    loadingTestInfo,
    loadingDetails,
    loadingSummary,
  ].some(Boolean)

  const generateCSVRequired = [
    chartFilters.barPageSize < totalTestCount,
    tableFilters.rowPageSize < totalRowCount,
    error && error.dataSizeExceeded,
  ].some(Boolean)

  const isReportDataEmpty = useMemo(
    () => getIsReportDataEmpty(skillInfo, testInfoMetrics, summary, details),
    [skillInfo, testInfoMetrics, summary, details]
  )

  // show filters section if data is empty
  useEffect(() => {
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      const showFilter = !loading && isReportDataEmpty
      toggleFilter(null, showFilter)
    }
  }, [loading, isReportDataEmpty])

  useEffect(() => {
    if (isCsvDownloading && generateCSVRequired) {
      const params = getGenerateCsvParams(
        skillInfo,
        settings,
        ddRequestFilters,
        tableFilters,
        reportTypes
      )
      generateCSV(params)
    }
  }, [isCsvDownloading])

  if (loading) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (isReportDataEmpty) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <div>
      <StyledCard>
        <Row type="flex" justify="start">
          <StyledH3 margin="0 0 10px 50px">
            Mastery Level Distribution by Test
          </StyledH3>
        </Row>
        <Row>
          <SignedStackedBarChartContainer
            data={chartMetrics}
            masteryScale={selectedScale}
            backendPagination={{
              page: chartFilters.barPage,
              pageSize: chartFilters.barPageSize,
              pageCount:
                Math.ceil(totalTestCount / chartFilters.barPageSize) || 1,
            }}
            setBackendPagination={({ page }) =>
              setChartFilters({
                ...chartFilters,
                barPage: page,
              })
            }
          />
        </Row>
      </StyledCard>
      <TableContainer>
        <Table
          tableMetrics={tableMetrics}
          chartMetrics={chartMetrics}
          masteryScale={selectedScale}
          tableFilters={tableFilters}
          setTableFilters={setTableFilters}
          tableFiltersDropDownData={{
            compareByDropDownData: compareByDropDownDataFiltered,
            analyseByDropDownData: AnalyseByDropDownData,
          }}
          isCsvDownloading={generateCSVRequired ? null : isCsvDownloading}
          backendPagination={{
            page: tableFilters.rowPage,
            pageSize: tableFilters.rowPageSize,
            itemsCount: totalRowCount || 0,
          }}
          setBackendPagination={({ page }) =>
            setTableFilters({
              ...tableFilters,
              rowPage: page,
            })
          }
          filters={settings.requestFilters}
          isSharedReport={isSharedReport}
        />
      </TableContainer>
    </div>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loadingSkillInfo: getSkillInfoLoader(state),
      errorFetchingSkillInfo: getReportsStandardsGradebookError(state),
      skillInfo: getStandardsGradebookSkillInfo(state),
      isCsvDownloading: getCsvDownloadingState(state),
      standardsFilters: getReportsStandardsFilters(state),
    }),
    {
      getSkillInfoRequest: getStandardsGradebookSkillInfoAction,
      generateCSV: generateCSVAction,
    }
  )
)

export default enhance(StandardsProgress)
