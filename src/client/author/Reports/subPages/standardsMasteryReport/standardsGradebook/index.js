import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import { Col, Row } from 'antd'
import { SpinLoader } from '@edulastic/common'
import StudentAssignmentModal from '../../../common/components/Popups/studentAssignmentModal'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { StyledCard, StyledH3 } from '../../../common/styled'
import { SignedStackBarChartContainer } from './components/charts/signedStackBarChartContainer'
import { TableContainer, UpperContainer } from './components/styled'
import { StandardsGradebookTable } from './components/table/standardsGradebookTable'

import { getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getReportsStandardsGradebookLoader,
  getStandardsGradebookRequestAction,
  getStudentStandardData,
  getStudentStandardLoader,
  getStudentStandardsAction,
  getReportsStandardsGradebookError,
} from './ducks'

import { getStudentAssignments } from '../../../common/util'
import { getMaxMasteryScore } from '../standardsPerformance/utils/transformers'
import {
  getDenormalizedData,
  getFilteredDenormalizedData,
  groupedByStandard,
} from './utils/transformers'

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const StandardsGradebook = ({
  standardsGradebook,
  getStandardsGradebookRequest,
  isCsvDownloading,
  settings,
  loading,
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
  const scaleInfo = get(standardsFilters, 'scaleInfo', [])

  const selectedMasteryProfile =
    scaleInfo.find(
      (s) =>
        s._id === (sharedReportFilters || settings.requestFilters).profileId ||
        s.default
    ) || scaleInfo[0]

  const selectedScale = selectedMasteryProfile?.scale || []
  const studentAssignmentsData = useMemo(
    () => getStudentAssignments(selectedScale, studentStandardData),
    [selectedScale, studentStandardData]
  )
  const [pageFilters, setPageFilters] = useState({ page: 1, pageSize: 10 })
  const [chartFilter, setChartFilter] = useState({})
  const [showStudentAssignmentModal, setStudentAssignmentModal] = useState(
    false
  )
  const [clickedStandard, setClickedStandard] = useState(undefined)
  const [clickedStudentName, setClickedStudentName] = useState(undefined)

  const getGradebookQuery = () => {
    const q = {
      ...settings.requestFilters,
      profileId:
        settings?.requestFilters?.profileId || selectedMasteryProfile?._id,
      page: 1,
      pageSize: pageFilters.pageSize,
    }
    return q
  }

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [settings])

  useEffect(() => {
    const q = { ...getGradebookQuery(), ...pageFilters }
    if (q.termId || q.reportId) {
      getStandardsGradebookRequest(q)
    }
  }, [pageFilters])

  const denormalizedData = useMemo(
    () => getDenormalizedData(standardsGradebook),
    [standardsGradebook]
  )

  const filteredDenormalizedData = useMemo(
    () => getFilteredDenormalizedData(denormalizedData, ddfilter, userRole),
    [denormalizedData, ddfilter, userRole]
  )

  const onBarClickCB = (key) => {
    const _chartFilter = { ...chartFilter }
    if (_chartFilter[key]) {
      delete _chartFilter[key]
    } else {
      _chartFilter[key] = true
    }
    setChartFilter(_chartFilter)
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
  if (loading) {
    return <SpinLoader position="fixed" />
  }
  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  return (
    <div>
      <UpperContainer>
        <StyledCard>
          <Row type="flex" justify="start">
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <StyledH3>Mastery Level Distribution Standards</StyledH3>
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
      error: getReportsStandardsGradebookError(state),
      isCsvDownloading: getCsvDownloadingState(state),
      standardsFilters: getReportsStandardsFilters(state),
      studentStandardData: getStudentStandardData(state),
      loadingStudentStandard: getStudentStandardLoader(state),
    }),
    {
      getStandardsGradebookRequest: getStandardsGradebookRequestAction,
      getStudentStandards: getStudentStandardsAction,
    }
  )
)

export default enhance(StandardsGradebook)

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
