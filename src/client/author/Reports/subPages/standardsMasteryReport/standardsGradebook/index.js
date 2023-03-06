import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, isEmpty } from 'lodash'
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
  getReportsStandardsGradebookLoader,
  getStandardsGradebookRequestAction,
  getSkillInfo,
  getSkillInfoLoader,
  getSkillInfoAction,
  getStudentStandardData,
  getStudentStandardLoader,
  getStudentStandardsAction,
  getReportsStandardsGradebookError,
  resetStandardsGradebookAction,
} from './ducks'

import {
  getDenormalizedData,
  getFilteredDenormalizedData,
  groupedByStandard,
} from './utils/transformers'

const { getStudentAssignments } = reportUtils.common
const { getMaxMasteryScore } = reportUtils.standardsPerformanceSummary

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const StandardsGradebook = ({
  standardsGradebook,
  skillInfo,
  getStandardsGradebookRequest,
  getSkillInfoRequest,
  resetStandardsGradebook,
  isCsvDownloading,
  navigationItems,
  toggleFilter,
  settings,
  loading,
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
  const standardsCount = get(
    standardsGradebook,
    'data.result.standardsCount',
    0
  )
  const scaleInfo = get(standardsFilters, 'data.result.scaleInfo', [])
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
  const [pageFilters, setPageFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: 10,
  })
  const [chartFilter, setChartFilter] = useState({})
  const [showStudentAssignmentModal, setStudentAssignmentModal] = useState(
    false
  )
  const [clickedStandard, setClickedStandard] = useState(undefined)
  const [clickedStudentName, setClickedStudentName] = useState(undefined)

  useEffect(() => () => resetStandardsGradebook(), [])

  // set initial page filters
  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])
  // get paginated data
  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      ...pageFilters,
    }
    if ((q.termId || q.reportId) && pageFilters.page) {
      getStandardsGradebookRequest(q)
      getSkillInfoRequest(q)
    }
  }, [pageFilters])

  const filteredDenormalizedData = useMemo(() => {
    const denormalizedData = getDenormalizedData(standardsGradebook, skillInfo)
    return getFilteredDenormalizedData(denormalizedData, ddfilter)
  }, [standardsGradebook, ddfilter])

  // show filters section if data is empty
  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      (!loading || !loadingSkillInfo) &&
      !isEmpty(standardsGradebook) &&
      !filteredDenormalizedData?.length
    ) {
      toggleFilter(null, true)
    }
  }, [filteredDenormalizedData])

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
  const maxMasteryScore = getMaxMasteryScore(masteryScale)

  const standardsData = useMemo(
    () =>
      groupedByStandard(
        filteredDenormalizedData,
        maxMasteryScore,
        masteryScale
      ),
    [filteredDenormalizedData, maxMasteryScore, masteryScale]
  )

  const handleOnClickStandard = (params, standard, studentName) => {
    getStudentStandards({
      ...params,
      testIds: (sharedReportFilters || settings.requestFilters).testIds,
    })
    setClickedStandard(standard)
    setStudentAssignmentModal(true)
    setClickedStudentName(studentName)
  }

  const closeStudentAssignmentModal = () => {
    setStudentAssignmentModal(false)
    setClickedStandard(undefined)
    setClickedStudentName(undefined)
  }

  if (loading || loadingSkillInfo) {
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

  if (!filteredDenormalizedData?.length) {
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
              filteredDenormalizedData={filteredDenormalizedData}
              filters={ddfilter}
              chartFilter={chartFilter}
              masteryScale={masteryScale}
              role={userRole}
              onBarClickCB={onBarClickCB}
              onBarResetClickCB={onBarResetClickCB}
              backendPagination={{
                ...pageFilters,
                pageCount:
                  Math.ceil(standardsCount / pageFilters.pageSize) || 1,
              }}
              setBackendPagination={setPageFilters}
            />
          </Row>
        </StyledCard>
      </UpperContainer>
      <TableContainer>
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
      </TableContainer>
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
      loading: getReportsStandardsGradebookLoader(state),
      loadingSkillInfo: getSkillInfoLoader(state),
      error: getReportsStandardsGradebookError(state),
      isCsvDownloading: getCsvDownloadingState(state),
      standardsGradebook: getReportsStandardsGradebook(state),
      skillInfo: getSkillInfo(state),
      standardsFilters: getReportsStandardsFilters(state),
      studentStandardData: getStudentStandardData(state),
      loadingStudentStandard: getStudentStandardLoader(state),
    }),
    {
      getStandardsGradebookRequest: getStandardsGradebookRequestAction,
      getSkillInfoRequest: getSkillInfoAction,
      resetStandardsGradebook: resetStandardsGradebookAction,
      getStudentStandards: getStudentStandardsAction,
    }
  )
)

export default enhance(StandardsGradebook)
// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
