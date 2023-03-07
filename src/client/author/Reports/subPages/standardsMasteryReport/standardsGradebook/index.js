import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, isEmpty, uniqBy, pickBy } from 'lodash'
import { Col, Row } from 'antd'

import { reportUtils } from '@edulastic/constants'

import { SpinLoader } from '@edulastic/common'
import StudentAssignmentModal from '../../../common/components/Popups/studentAssignmentModal'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import { SignedStackBarChartContainer } from './components/charts/signedStackBarChartContainer'
import { TableContainer, UpperContainer } from './components/styled'
import { StandardsGradebookTable } from './components/table/standardsGradebookTable'

import { getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getReportsStandardsGradebook,
  getReportsStandardsGradebookChartLoader,
  getStandardsGradebookSkillInfo,
  getSkillInfoLoader,
  getStandardsGradebookSkillInfoAction,
  getStudentStandardData,
  getStudentStandardLoader,
  getStudentStandardsAction,
  getReportsStandardsGradebookError,
  getStandardsGradebookChartAction,
  getReportsStandardsGradebookChart,
  resetStandardsGradebookAction,
} from './ducks'

import {
  getChartDataWithStandardInfo,
  groupedByStandard,
} from './utils/transformers'

const { getStudentAssignments } = reportUtils.common
const { getMaxMasteryScore } = reportUtils.standardsPerformanceSummary

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const StandardsGradebook = ({
  skillInfo: rawSkillInfo,
  getSkillInfoRequest,
  getChartData,
  chartData: rawChartData,
  resetStandardsGradebook,
  isCsvDownloading,
  navigationItems,
  toggleFilter,
  settings,
  loadingChart,
  loadingSkillInfo,
  error,
  standardsFilters,
  getStudentStandards,
  studentStandardData,
  loadingStudentStandard,
  location,
  pageTitle,
  ddfilter,
  userRole,
  sharedReport,
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
  const chartData = get(rawChartData, 'data.result.standards', [])
  const scaleInfo = get(standardsFilters, 'data.result.scaleInfo', [])
  const skillInfo = get(rawSkillInfo, 'data.result.skillInfo')

  const selectedScale =
    (
      scaleInfo.find(
        (s) =>
          s._id === (sharedReportFilters || settings.requestFilters).profileId
      ) || scaleInfo[0]
    )?.scale || []
  const studentAssignmentsData = useMemo(
    () => getStudentAssignments(selectedScale, studentStandardData),
    [selectedScale, studentStandardData]
  )

  // support for domain filtering from backend
  const [chartPageFilters, setChartPageFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: 10,
  })
  const [chartFilter, setChartFilter] = useState({})
  const [showStudentAssignmentModal, setStudentAssignmentModal] = useState(
    false
  )
  const [clickedStandard, setClickedStandard] = useState(undefined)
  const [clickedStudentName, setClickedStudentName] = useState(undefined)
  const standardsCount = useMemo(() => uniqBy(skillInfo, 'standardId').length, [
    skillInfo,
  ])

  const ddRequestFilters = useMemo(
    () => pickBy(ddfilter, (f) => f !== 'all' && !isEmpty(f)),
    [ddfilter]
  )

  useEffect(() => () => resetStandardsGradebook(), [])

  // set initial page filters
  useEffect(() => {
    setChartPageFilters({ ...chartPageFilters, page: 1 })
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  // @TODO: should this be handled with different approach ?
  useEffect(() => {
    const q = {
      ...settings.requestFilters,
    }
    if (q.termId || q.reportId) {
      getSkillInfoRequest(q)
    }
  }, [settings.requestFilters])
  // get paginated data
  useEffect(() => {
    // @TODO: handle page filters for table
    // handle page filter, settings and dd filters properly to avoid multiple api calls
    const { page: stdPage, pageSize: stdPageSize } = chartPageFilters
    const q = {
      ...settings.requestFilters,
      stdPage,
      stdPageSize,
      ...ddRequestFilters,
    }
    if ((q.termId || q.reportId) && stdPage) {
      getChartData(q)
    }
  }, [chartPageFilters, settings.requestFilters, ddRequestFilters])

  const chartDataWithStandardInfo = useMemo(
    () => getChartDataWithStandardInfo(chartData, skillInfo),
    [chartData, skillInfo]
  )

  // show filters section if data is empty
  useEffect(() => {
    // @TODO: add a check for table and chart data here
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      (!loadingChart || !loadingSkillInfo) &&
      !isEmpty(chartDataWithStandardInfo)
    ) {
      toggleFilter(null, true)
    }
  }, [chartDataWithStandardInfo])

  const onBarClickCB = (key) => {
    const _chartFilter = { ...chartFilter }
    if (_chartFilter[key]) {
      delete _chartFilter[key]
    } else {
      _chartFilter[key] = true
    }
    setChartFilter(_chartFilter)
  }

  const onBarResetClickCB = () => {
    setChartFilter({})
  }

  const masteryScale = selectedScale || []
  // const maxMasteryScore = getMaxMasteryScore(masteryScale)

  // const standardsData = useMemo(
  //   () =>
  //     groupedByStandard(
  //       filteredDenormalizedData,
  //       maxMasteryScore,
  //       masteryScale
  //     ),
  //   [filteredDenormalizedData, maxMasteryScore, masteryScale]
  // )

  // const handleOnClickStandard = (params, standard, studentName) => {
  //   getStudentStandards({
  //     ...params,
  //     testIds: (sharedReportFilters || settings.requestFilters).testIds,
  //   })
  //   setClickedStandard(standard)
  //   setStudentAssignmentModal(true)
  //   setClickedStudentName(studentName)
  // }

  const closeStudentAssignmentModal = () => {
    setStudentAssignmentModal(false)
    setClickedStandard(undefined)
    setClickedStudentName(undefined)
  }

  // @TODO handle loading table data as well
  if (loadingChart || loadingSkillInfo) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  // @TODO: does it need to be modified ?
  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  // @TODO: add check for table and (skill info ?) data
  if (isEmpty(chartDataWithStandardInfo)) {
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
              chartFilter={chartFilter}
              masteryScale={masteryScale}
              role={userRole}
              onBarClickCB={onBarClickCB}
              onBarResetClickCB={onBarResetClickCB}
              backendPagination={{
                ...chartPageFilters,
                pageCount:
                  Math.ceil(standardsCount / chartPageFilters.pageSize) || 1,
              }}
              setBackendPagination={setChartPageFilters}
            />
          </Row>
        </StyledCard>
      </UpperContainer>
      {/* <TableContainer>
        <StandardsGradebookTable
          filteredDenormalizedData={filteredDenormalizedData}
          masteryScale={masteryScale}
          chartFilter={chartFilter}
          isCsvDownloading={isCsvDownloading}
          role={userRole}
          filters={sharedReportFilters || settings.requestFilters}
          handleOnClickStandard={handleOnClickStandard}
          standardsData={standardsData}
          location={location}
          navigationItems={navigationItems}
          pageTitle={pageTitle}
          isSharedReport={isSharedReport}
        />
      </TableContainer> */}
      {showStudentAssignmentModal && (
        <StudentAssignmentModal
          showModal={showStudentAssignmentModal}
          closeModal={closeStudentAssignmentModal}
          studentAssignmentsData={studentAssignmentsData}
          studentName={clickedStudentName}
          standardName={clickedStandard}
          loadingStudentStandard={loadingStudentStandard}
        />
      )}
    </div>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loadingChart: getReportsStandardsGradebookChartLoader(state),
      loadingSkillInfo: getSkillInfoLoader(state),
      error: getReportsStandardsGradebookError(state),
      isCsvDownloading: getCsvDownloadingState(state),
      standardsGradebook: getReportsStandardsGradebook(state),
      skillInfo: getStandardsGradebookSkillInfo(state),
      standardsFilters: getReportsStandardsFilters(state),
      studentStandardData: getStudentStandardData(state),
      loadingStudentStandard: getStudentStandardLoader(state),
      chartData: getReportsStandardsGradebookChart(state),
    }),
    {
      getSkillInfoRequest: getStandardsGradebookSkillInfoAction,
      resetStandardsGradebook: resetStandardsGradebookAction,
      getStudentStandards: getStudentStandardsAction,
      getChartData: getStandardsGradebookChartAction,
    }
  )
)

export default enhance(StandardsGradebook)
// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
