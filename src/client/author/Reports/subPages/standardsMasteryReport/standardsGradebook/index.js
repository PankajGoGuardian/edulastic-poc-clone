import { Row } from 'antd'
import { get, isEmpty, pickBy, some } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { SpinLoader } from '@edulastic/common'
import { report as reportTypes, reportUtils } from '@edulastic/constants'

import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import StudentAssignmentModal from '../../../common/components/Popups/studentAssignmentModal'
import { NoDataContainer, StyledCard } from '../../../common/styled'
import { SignedStackBarChartContainer } from './components/charts/signedStackBarChartContainer'
import { TableContainer, UpperContainer } from './components/styled'
import StandardsGradebookTable from './components/table'

import { generateCSVAction, getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getReportsStandardsGradebookError,
  getSkillInfoLoader,
  getStandardsGradebookDetails,
  getStandardsGradebookDetailsAction,
  getStandardsGradebookDetailsLoader,
  getStandardsGradebookSkillInfo,
  getStandardsGradebookSkillInfoAction,
  getStandardsGradebookSummary,
  getStandardsGradebookSummaryAction,
  getStandardsGradebookSummaryLoader,
  getStudentStandardData,
  getStudentStandardLoader,
  getStudentStandardsAction,
  resetStandardsGradebookAction,
} from './ducks'

import BackendPagination from '../../../common/components/BackendPagination'
import ChartHeader from './components/ChartHeader'
import TableFilters from './components/TableFilters'
import TableHeader from './components/TableHeader'
import useSelectedStandardBars from './hooks/useSelectedStandardBars'
import useStudentAssignmentModal from './hooks/useStudentAssignmentModal'
import useTableFilters from './hooks/useTableFilters'
import {
  getDetailsApiQuery,
  getScaleInfo,
  getSkillInfoApiQuery,
  getSummaryApiQuery,
} from './utils/transformers'

const { getStudentAssignments } = reportUtils.common
const {
  CHART_PAGE_SIZE,
  preProcessSummaryMetrics,
  getSummaryMetricInfoWithSkillInfo,
} = reportUtils.standardsGradebook

//! FIXME Have better null-value handling than using memoized empty value
const EMPTY_ARRAY = []

const StandardsGradebook = ({
  skillInfo: rawSkillInfo,
  getSkillInfoRequest,
  getSummaryRequest,
  getDetailsRequest,
  summary,
  details,
  resetStandardsGradebook,
  isCsvDownloading,
  navigationItems,
  toggleFilter,
  settings,
  loadingSkillInfo,
  loadingSummary,
  loadingDetails,
  error,
  standardsFilters,
  getStudentStandards,
  studentStandardData,
  loadingStudentStandard,
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

  // support for domain filtering from backend
  const [chartFilters, setChartFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: CHART_PAGE_SIZE,
  })

  const {
    selectedStandardBars,
    onBarClickCB,
    onBarResetClickCB,
  } = useSelectedStandardBars()

  const {
    tableFilters,
    setTableFilters,
    tableFilterDropDownCB,
    setTablePagination,
  } = useTableFilters({ userRole })

  const {
    showStudentAssignmentModal,
    clickedStandardName,
    clickedStudentName,
    handleOnClickStandard,
    closeStudentAssignmentModal,
  } = useStudentAssignmentModal({
    settings,
    sharedReportFilters,
    getStudentStandards,
  })

  const { skillInfo = EMPTY_ARRAY, standardIdsCount } = get(
    rawSkillInfo,
    'data.result',
    {}
  )
  const summaryMetricInfo = useMemo(() => {
    const { standards: _summaryMetricInfo = [] } = get(
      summary,
      'data.result',
      {}
    )
    return preProcessSummaryMetrics({ summaryMetricInfo: _summaryMetricInfo })
  }, [summary])
  const { metrics: detailsMetricInfo = EMPTY_ARRAY, totalRows } = get(
    details,
    'data.result',
    {}
  )

  const scaleInfo = useMemo(
    () =>
      getScaleInfo({
        settings,
        sharedReportFilters,
        standardsFilters,
      }),
    [standardsFilters, settings, sharedReportFilters]
  )

  const studentAssignmentsData = useMemo(
    () => getStudentAssignments(scaleInfo, studentStandardData),
    [scaleInfo, studentStandardData]
  )

  const ddRequestFilters = useMemo(
    () => pickBy(ddfilter, (f) => f !== 'all' && !isEmpty(f)),
    [ddfilter]
  )

  const summaryMetricInfoWithSkillInfo = useMemo(
    () => getSummaryMetricInfoWithSkillInfo(summaryMetricInfo, skillInfo),
    [summaryMetricInfo, skillInfo]
  )

  const filteredSummaryMetricInfoWithSkillInfo = isEmpty(selectedStandardBars)
    ? summaryMetricInfoWithSkillInfo
    : summaryMetricInfoWithSkillInfo.filter(
        (c) => selectedStandardBars[c.standardId]
      )

  const generateCSVSelectionCriteria = [
    chartFilters.pageSize < standardIdsCount,
    tableFilters.pageSize < totalRows,
    error && error.dataSizeExceeded,
  ]
  const generateCSVRequired = generateCSVSelectionCriteria.some((c) => c)

  useEffect(() => () => resetStandardsGradebook(), [])

  useEffect(() => {
    const q = getSkillInfoApiQuery({ settings })
    if (q.termId || q.reportId) {
      // reset page to trigger summary API call
      setChartFilters({ ...chartFilters, page: 1 })
      getSkillInfoRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    const q = getSummaryApiQuery({ settings, ddRequestFilters, chartFilters })
    if ((q.termId || q.reportId) && q.stdPage) {
      // reset page to trigger details API call
      setTableFilters({ ...tableFilters, page: 1 })
      getSummaryRequest(q)
    }
  }, [ddRequestFilters, chartFilters])

  useEffect(() => {
    const q = getDetailsApiQuery({
      settings,
      ddRequestFilters,
      chartFilters,
      tableFilters,
    })
    if ((q.termId || q.reportId) && q.stdPage && q.rowPage) {
      getDetailsRequest(q)
    }
  }, [tableFilters])

  const isReportLoading = [loadingSummary, loadingSkillInfo, loadingDetails]

  // show filters section if data is empty
  useEffect(() => {
    const summaryMetrics = get(summary, 'data.result.standards', [])
    const skillInfoList = get(rawSkillInfo, 'data.result.skillInfo', [])
    const detailsMetrics = get(details, 'data.result.metrics', [])
    const doesReportHasMetrics = [
      summaryMetrics.length,
      skillInfoList.length,
      detailsMetrics.length,
    ]
    const isApiResponseEmpty = [
      isEmpty(summary),
      isEmpty(rawSkillInfo),
      isEmpty(details),
    ]
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      const showFilter = [
        ...isReportLoading,
        ...isApiResponseEmpty,
        ...doesReportHasMetrics,
      ].every((e) => !e)
      toggleFilter(null, showFilter)
    }
  }, [summary, rawSkillInfo, details])

  useEffect(() => {
    if (isCsvDownloading && generateCSVRequired) {
      const {
        compareByKey: compareBy,
        analyseByKey: analyseBy,
        sortKey,
        sortOrder,
      } = tableFilters

      const params = {
        reportType: reportTypes.reportNavType.STANDARDS_GRADEBOOK,
        reportFilters: {
          ...settings.requestFilters,
          compareBy,
          analyseBy,
          sortKey,
          sortOrder,
        },
        reportExtras: {
          tableFilters,
        },
      }
      generateCSV(params)
    }
  }, [isCsvDownloading])

  if (some(isReportLoading, Boolean)) {
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

  if (isEmpty(summaryMetricInfoWithSkillInfo) || isEmpty(detailsMetricInfo)) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <div>
      <UpperContainer>
        <StyledCard>
          <Row type="flex" justify="start">
            <ChartHeader />
          </Row>
          <Row>
            <SignedStackBarChartContainer
              summaryMetricInfoWithSkillInfo={summaryMetricInfoWithSkillInfo}
              chartFilter={selectedStandardBars}
              scaleInfo={scaleInfo}
              role={userRole}
              onBarClickCB={onBarClickCB}
              onBarResetClickCB={onBarResetClickCB}
              backendPagination={{
                ...chartFilters,
                pageCount:
                  Math.ceil(standardIdsCount / chartFilters.pageSize) || 1,
              }}
              setBackendPagination={setChartFilters}
            />
          </Row>
        </StyledCard>
      </UpperContainer>
      <TableContainer>
        <StyledCard>
          <Row type="flex" justify="start">
            <TableHeader tableFilters={tableFilters} />
            <TableFilters
              userRole={userRole}
              tableFilters={tableFilters}
              tableFilterDropDownCB={tableFilterDropDownCB}
            />
          </Row>
          <Row>
            <StandardsGradebookTable
              filters={settings.requestFilters}
              scaleInfo={scaleInfo}
              summaryMetricInfo={summaryMetricInfo}
              detailsMetricInfo={detailsMetricInfo}
              isSharedReport={isSharedReport}
              isCsvDownloading={generateCSVRequired ? null : isCsvDownloading}
              navigationItems={navigationItems}
              summaryMetricInfoWithSkillInfo={
                filteredSummaryMetricInfoWithSkillInfo
              }
              tableFilters={tableFilters}
              setTableFilters={setTableFilters}
              handleOnClickStandard={handleOnClickStandard}
            />
          </Row>
          <Row>
            <BackendPagination
              itemsCount={totalRows}
              backendPagination={{
                page: tableFilters.page,
                pageSize: tableFilters.pageSize,
              }}
              setBackendPagination={setTablePagination}
            />
          </Row>
        </StyledCard>
      </TableContainer>
      {showStudentAssignmentModal && (
        <StudentAssignmentModal
          showModal={showStudentAssignmentModal}
          closeModal={closeStudentAssignmentModal}
          studentAssignmentsData={studentAssignmentsData}
          studentName={clickedStudentName}
          standardName={clickedStandardName}
          loadingStudentStandard={loadingStudentStandard}
        />
      )}
    </div>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loadingSkillInfo: getSkillInfoLoader(state),
      loadingSummary: getStandardsGradebookSummaryLoader(state),
      loadingDetails: getStandardsGradebookDetailsLoader(state),
      loadingStudentStandard: getStudentStandardLoader(state),
      skillInfo: getStandardsGradebookSkillInfo(state),
      summary: getStandardsGradebookSummary(state),
      details: getStandardsGradebookDetails(state),
      error: getReportsStandardsGradebookError(state),
      isCsvDownloading: getCsvDownloadingState(state),
      standardsFilters: getReportsStandardsFilters(state),
      studentStandardData: getStudentStandardData(state),
    }),
    {
      getSkillInfoRequest: getStandardsGradebookSkillInfoAction,
      getSummaryRequest: getStandardsGradebookSummaryAction,
      getDetailsRequest: getStandardsGradebookDetailsAction,
      resetStandardsGradebook: resetStandardsGradebookAction,
      getStudentStandards: getStudentStandardsAction,
      generateCSV: generateCSVAction,
    }
  )
)

export default enhance(StandardsGradebook)
