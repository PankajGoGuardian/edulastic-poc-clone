import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, isEmpty, pickBy } from 'lodash'
import { Col, Row } from 'antd'
import next from 'immer'

import { SpinLoader } from '@edulastic/common'
import { reportUtils, roleuser } from '@edulastic/constants'

import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import StudentAssignmentModal from '../../../common/components/Popups/studentAssignmentModal'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import { SignedStackBarChartContainer } from './components/charts/signedStackBarChartContainer'
import {
  StyledDropDownContainer,
  TableContainer,
  UpperContainer,
} from './components/styled'
import StandardsGradebookTable from './components/table/standardsGradebookTable'

import { getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getStandardsGradebookSummaryLoader,
  getStandardsGradebookSummary,
  getStandardsGradebookSummaryAction,
  getStandardsGradebookDetailsLoader,
  getStandardsGradebookDetails,
  getStandardsGradebookDetailsAction,
  getSkillInfoLoader,
  getStandardsGradebookSkillInfo,
  getStandardsGradebookSkillInfoAction,
  getStudentStandardData,
  getStudentStandardLoader,
  getStudentStandardsAction,
  getReportsStandardsGradebookError,
  resetStandardsGradebookAction,
} from './ducks'

import BackendPagination from '../../../common/components/BackendPagination'

const { getStudentAssignments, curateApiFiltersQuery } = reportUtils.common
const {
  CHART_PAGE_SIZE,
  TABLE_PAGE_SIZE,
  comDataForDropDown,
  sharedDetailsFields,
  filterDetailsFields,
  sharedSummaryFields,
  filterSummaryFields,
  compareByKeys,
  compareByKeyToNameMap,
  compareByDropDownData: _compareByDropDownData,
  analyseByKeys,
  analyseByDropDownData,
  preProcessSummaryMetrics,
  getChartDataWithStandardInfo,
} = reportUtils.standardsGradebook

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

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
}) => {
  const defaultCompareByKey =
    userRole === roleuser.TEACHER ? compareByKeys.STUDENT : compareByKeys.SCHOOL
  // support for domain filtering from backend
  const [chartFilters, setChartFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: CHART_PAGE_SIZE,
  })
  const [tableFilters, setTableFilters] = useState({
    compareByKey: defaultCompareByKey,
    analyseByKey: analyseByKeys.MASTERY_SCORE,
    page: 0,
    pageSize: TABLE_PAGE_SIZE,
    sortKey: defaultCompareByKey,
    sortOrder: 'asc',
    requireTotalCount: true,
  })
  const [selectedStandardBars, setSelectedStandardBars] = useState({})
  const [showStudentAssignmentModal, setStudentAssignmentModal] = useState(
    false
  )
  const [clickedStandardName, setClickedStandardName] = useState(undefined)
  const [clickedStudentName, setClickedStudentName] = useState(undefined)

  const compareByDropDownData = useMemo(
    () =>
      next(_compareByDropDownData, (arr) => {
        if (userRole === roleuser.TEACHER) {
          arr.splice(0, 2)
        }
      }),
    [userRole]
  )
  const [sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )

  const { skillInfo = [], standardIdsCount } = get(
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
  const { metrics: detailsMetricInfo = [], totalRows } = get(
    details,
    'data.result',
    {}
  )

  const scaleInfo = useMemo(() => {
    const masteryScales = get(standardsFilters, 'data.result.scaleInfo', [])
    return (
      (
        masteryScales.find(
          (s) =>
            s._id === (sharedReportFilters || settings.requestFilters).profileId
        ) || masteryScales[0]
      )?.scale || []
    )
  }, [standardsFilters])

  const studentAssignmentsData = useMemo(
    () => getStudentAssignments(scaleInfo, studentStandardData),
    [scaleInfo, studentStandardData]
  )

  const ddRequestFilters = useMemo(
    () => pickBy(ddfilter, (f) => f !== 'all' && !isEmpty(f)),
    [ddfilter]
  )

  const chartDataWithStandardInfo = useMemo(
    () => getChartDataWithStandardInfo(summaryMetricInfo, skillInfo),
    [summaryMetricInfo, skillInfo]
  )

  const filteredChartDataWithStandardInfo = isEmpty(selectedStandardBars)
    ? chartDataWithStandardInfo
    : chartDataWithStandardInfo.filter(
        (c) => selectedStandardBars[c.standardId]
      )

  useEffect(() => () => resetStandardsGradebook(), [])

  useEffect(() => {
    const { query: skillInfoQuery } = curateApiFiltersQuery(
      {
        ...settings.requestFilters,
      },
      filterSummaryFields,
      sharedSummaryFields
    )
    if (skillInfoQuery.termId || skillInfoQuery.reportId) {
      // reset page to trigger summary API call
      setChartFilters({ ...chartFilters, page: 1 })
      getSkillInfoRequest(skillInfoQuery)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  // @todo fix multiple API calls
  useEffect(() => {
    const { page: stdPage, pageSize: stdPageSize } = chartFilters
    const { query: q } = curateApiFiltersQuery(
      {
        ...settings.requestFilters,
        stdPage,
        stdPageSize,
        ...ddRequestFilters,
      },
      filterSummaryFields,
      sharedSummaryFields
    )
    if ((q.termId || q.reportId) && q.stdPage) {
      // reset page to trigger details API call
      setTableFilters({ ...tableFilters, page: 1 })
      getSummaryRequest(q)
    }
  }, [ddRequestFilters, chartFilters])

  useEffect(() => {
    const { page: stdPage, pageSize: stdPageSize } = chartFilters
    const {
      compareByKey: compareBy,
      analyseByKey: analyzeBy,
      page: rowPage,
      pageSize: rowPageSize,
      sortKey,
      sortOrder,
    } = tableFilters
    const { query: q } = curateApiFiltersQuery(
      {
        ...settings.requestFilters,
        stdPage,
        stdPageSize,
        ...ddRequestFilters,
        rowPage,
        rowPageSize,
        compareBy,
        analyzeBy,
        sortKey,
        sortOrder,
        requireTotalCount: rowPage === 1,
      },
      filterDetailsFields,
      sharedDetailsFields
    )
    if ((q.termId || q.reportId) && q.stdPage && q.rowPage) {
      getDetailsRequest(q)
    }
  }, [tableFilters])

  // show filters section if data is empty
  useEffect(() => {
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      const showFilter = [
        loadingSummary,
        loadingSkillInfo,
        loadingDetails,
        chartDataWithStandardInfo.length && detailsMetricInfo.length,
      ].every((e) => !e)
      if (showFilter) {
        toggleFilter(null, true)
      } else {
        toggleFilter(null, false)
      }
    }
  }, [chartDataWithStandardInfo, detailsMetricInfo])

  const onBarClickCB = (key) => {
    const _selectedStandardBars = { ...selectedStandardBars }
    if (_selectedStandardBars[key]) {
      delete _selectedStandardBars[key]
    } else {
      _selectedStandardBars[key] = true
    }
    setSelectedStandardBars(_selectedStandardBars)
  }

  const onBarResetClickCB = () => setSelectedStandardBars({})

  const tableFilterDropDownCB = (event, _selected, comData) => {
    if (comData === comDataForDropDown.COMPARE_BY) {
      setTableFilters((prevState) => ({
        ...prevState,
        page: 1,
        compareByKey: _selected.key,
        sortKey:
          prevState.sortKey === prevState.compareByKey
            ? _selected.key
            : prevState.sortKey,
      }))
    }
    if (comData === comDataForDropDown.ANALYZE_BY) {
      setTableFilters((prevState) => ({
        ...prevState,
        analyseByKey: _selected.key,
      }))
    }
  }

  const setTablePagination = ({ page }) => {
    setTableFilters((prevState) => ({ ...prevState, page }))
  }

  const handleOnClickStandard = useCallback(
    ({ standardId, standardName, studentId, studentName }) => {
      const { testIds, termId, profileId, assessmentTypes } =
        sharedReportFilters || settings.requestFilters
      getStudentStandards(
        {
          termId,
          assessmentTypes,
          testIds,
          profileId,
          standardId,
          studentId,
        },
        [sharedReportFilters, settings.requestFilters]
      )
      setClickedStandardName(standardName)
      setStudentAssignmentModal(true)
      setClickedStudentName(studentName)
    },
    [sharedReportFilters, settings.requestFilters]
  )

  const closeStudentAssignmentModal = () => {
    setStudentAssignmentModal(false)
    setClickedStandardName(undefined)
    setClickedStudentName(undefined)
  }

  if (loadingSummary || loadingSkillInfo || loadingDetails) {
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

  if (isEmpty(chartDataWithStandardInfo) || isEmpty(detailsMetricInfo)) {
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
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <StyledH3 margin="0 0 10px 50px">
                Mastery Level Distribution by Standard
              </StyledH3>
            </Col>
          </Row>
          <Row>
            <SignedStackBarChartContainer
              data={chartDataWithStandardInfo}
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
            <Col xs={24} sm={24} md={10} lg={10} xl={12}>
              <StyledH3>
                Standards Mastery By{' '}
                {compareByKeyToNameMap[tableFilters.compareByKey]}
              </StyledH3>
            </Col>
            <Col xs={24} sm={24} md={14} lg={14} xl={12}>
              <Row className="control-dropdown-row" gutter={8}>
                <StyledDropDownContainer
                  data-cy={comDataForDropDown.COMPARE_BY}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={8}
                >
                  <ControlDropDown
                    data={compareByDropDownData}
                    by={tableFilters.compareByKey}
                    prefix="Compare by "
                    selectCB={tableFilterDropDownCB}
                    comData={comDataForDropDown.COMPARE_BY}
                  />
                </StyledDropDownContainer>
                <StyledDropDownContainer
                  data-cy={comDataForDropDown.ANALYZE_BY}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={8}
                >
                  <ControlDropDown
                    data={analyseByDropDownData}
                    by={tableFilters.analyseByKey}
                    prefix="Analyze by "
                    selectCB={tableFilterDropDownCB}
                    comData={comDataForDropDown.ANALYZE_BY}
                  />
                </StyledDropDownContainer>
              </Row>
            </Col>
          </Row>
          <Row>
            <StandardsGradebookTable
              filters={settings.requestFilters}
              scaleInfo={scaleInfo}
              summaryMetricInfo={summaryMetricInfo}
              detailsMetricInfo={detailsMetricInfo}
              isSharedReport={isSharedReport}
              isCsvDownloading={isCsvDownloading}
              navigationItems={navigationItems}
              chartDataWithStandardInfo={filteredChartDataWithStandardInfo}
              tableFilters={tableFilters}
              setTableFilters={setTableFilters}
              handleOnClickStandard={handleOnClickStandard}
            />
          </Row>
        </StyledCard>
        <BackendPagination
          itemsCount={totalRows}
          backendPagination={{
            page: tableFilters.page,
            pageSize: tableFilters.pageSize,
          }}
          setBackendPagination={setTablePagination}
        />
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
    }
  )
)

export default enhance(StandardsGradebook)
// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
