import React, { useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { get, mapValues, pick, isEmpty } from 'lodash'
import { Spin } from 'antd'

import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import {
  helpLinks,
  reportGroupType,
  reportNavType,
} from '@edulastic/constants/const/report'
import { SubHeader } from '../../../common/components/Header'
import { NoDataContainer } from '../../../common/styled'
import Summary from './components/Summary'
import ShareReportModal from '../../../common/components/Popups/ShareReportModal'
import WholeLearnerReportFilters from './components/Filters/Filters'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { DW_WLR_REPORT_URL } from '../../../common/constants/dataWarehouseReports'
import SectionLabel from '../../../common/components/SectionLabel'
import SectionDescription from '../../../common/components/SectionDescription'

import { resetAllReportsAction } from '../../../common/reportsRedux'
import {
  fetchInterventionsByGroupsRequest,
  fetchUpdateTagsDataAction,
  getAcademicInterventions,
  getAttendanceInterventions,
  getCsvDownloadingState,
  getInterventionsByGroup,
  getSharingState,
  setSharingStateAction,
} from '../../../ducks'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import {
  getUserRole,
  getOrgDataSelector,
  getCurrentTerm,
} from '../../../../src/selectors/user'
import { actions, selectors } from './ducks'

import {
  getChartData,
  getTableData,
  getStudentName,
  mergeSchoolMetrics,
  mergeDistrictMetrics,
  mergeTestMetrics,
  getAttendanceChartData,
} from './utils'
import { ACADEMIC, ATTENDANCE } from '../GoalsAndInterventions/constants/form'
import { computeChartNavigationLinks } from '../../../common/util'
import { EXTERNAL_SCORE_TYPES } from '../common/utils'
import WLRDetails from './components/WLRDetails'

const { downloadCSV } = reportUtils.common

const WholeLearnerReport = ({
  // value props
  loc,
  location,
  history,
  sharingState,
  sharedReportList,
  isCsvDownloading,
  userRole,
  orgData,
  defaultTermId,
  showApply,
  breadcrumbData,
  isCliUser,
  isPrinting,
  updateNavigation,
  // value props (from report selectors)
  firstLoad,
  showFilter,
  loadingFiltersData,
  prevFiltersData,
  student,
  filtersData,
  filters,
  filterTagsData,
  selectedFilterTagsData,
  // selectedPerformanceBandProfileId,
  // selectedPerformanceBand,
  loadingReportData,
  settings,
  reportData,
  error,
  // action props
  onRefineResultsCB,
  resetAllReports,
  setSharingState,
  // action props (from report actions)
  setFirstLoad,
  fetchFiltersDataRequest,
  fetchStudentsDataRequest,
  setFilters,
  setStudent,
  setFilterTagsData,
  setPrevFiltersData,
  resetFiltersData,
  setSettings,
  fetchReportDataRequest,
  fetchUpdateTagsData,
  loadingAttendanceData,
  attendanceData,
  fetchAttendanceDataRequest,
  fetchInterventionsByGroups,
  interventionsData,
  fetchStudentsMasteryDataRequest,
  loadingMasteryData,
  studentMasteryProfile,
  fetchSPRFFilterDataRequest,
  SPRFFilterData,
  termsData,
  attendanceInterventions,
  academicInterventions,
}) => {
  const reportId = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }).reportId,
    []
  )
  const [isAttendanceChartVisible, setIsAttendanceChartVisible] = useState(true)
  const isAttendanceChartToggled = useRef(false)
  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )
  const [showInterventions, setShowInterventions] = useState(false)
  const { scaleInfo: masterScales } = get(SPRFFilterData, 'data.result', {})
  const [selectedMasteryScale, setSelectedMasteryScale] = useState(
    masterScales?.[0] || {}
  )
  useEffect(() => {
    setSelectedMasteryScale(masterScales?.[0] || {})
  }, [masterScales])

  const [sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )

  const { testTypes, externalScoreType } = useMemo(() => {
    let _testTypes = (sharedReportFilters || settings.frontEndFilters)
      ?.testTypes
    _testTypes = isEmpty(_testTypes) ? [] : _testTypes.split(',')

    const _externalScoreType =
      (sharedReportFilters || settings.frontEndFilters)?.externalScoreType ||
      EXTERNAL_SCORE_TYPES.SCALED_SCORE

    return { testTypes: _testTypes, externalScoreType: _externalScoreType }
  }, [settings.frontEndFilters, sharedReportFilters])

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }
  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const {
    studentClassData = [],
    bandInfo = [],
    demographics = {},
    thumbnail,
  } = get(filtersData, 'data.result', {})

  const onGoClick = (_settings) => {
    const requestFilterKeys = [
      'reportId',
      'termId',
      'standardsProficiencyProfileId',
      'assignedBy',
    ]
    const _requestFilters = {}
    Object.keys(_settings.filters).forEach((filterType) => {
      _requestFilters[filterType] =
        _settings.filters[filterType] === 'All'
          ? ''
          : _settings.filters[filterType]
    })

    setSettings({
      requestFilters: {
        ...pick(_requestFilters, requestFilterKeys),
        standardsProficiencyProfileId:
          _requestFilters.standardsProficiencyProfileId,
      },
      standardFilters: {
        domainIds: _requestFilters.domainId,
        standardIds: _requestFilters.standardId,
      },
      selectedStudent: _settings.selectedStudent,
      selectedFilterTagsData: _settings.selectedFilterTagsData,
      selectedStudentInformation: {
        ...(studentClassData[0] || {}),
        ...demographics,
        thumbnail,
      },
      selectedStudentClassData: studentClassData,
      frontEndFilters: {
        testTypes: _requestFilters.testTypes,
        performanceBandProfileId: _requestFilters.performanceBandProfileId,
        externalScoreType: _requestFilters.externalScoreType,
      },
    })
    setShowApply(false)
  }

  useEffect(
    () => () => {
      resetAllReports()
    },
    []
  )

  useEffect(() => {
    // if user did not toggle attendance checkbox and attendance data is empty - hide attendance chart
    if (!isAttendanceChartToggled.current) {
      setIsAttendanceChartVisible(!isEmpty(attendanceData))
    }
  }, [attendanceData, isAttendanceChartToggled])

  useEffect(() => {
    // settings.requestFilters is missing class filters
    const _requestFilters = {
      ...filters,
      courseId: filters.courseIds.split(',')[0],
      assessmentTypes: filters.testTypes,
      profileId: filters.performanceBandProfileId,
      reportId: reportId || '',
    }
    if (settings.selectedStudent.key) {
      const path = `${settings.selectedStudent.key}?${qs.stringify(
        _requestFilters
      )}`
      history.push(path)
    }
    const navigationItems = computeChartNavigationLinks({
      requestFilters: _requestFilters,
      loc,
      hideOtherTabs: !!reportId,
    })
    updateNavigation(navigationItems)
  }, [settings])

  useEffect(() => {
    if (settings.selectedStudent.key) {
      const path = `${DW_WLR_REPORT_URL}${
        settings.selectedStudent.key
      }?${qs.stringify({
        ...settings.requestFilters,
        ...settings.frontEndFilters,
      })}`
      history.push(path)
    }
    if (settings.selectedStudent.key && settings.requestFilters.termId) {
      fetchReportDataRequest({
        ...settings.requestFilters,
        studentId: settings.selectedStudent.key,
      })
      fetchAttendanceDataRequest({
        ...settings.requestFilters,
        studentId: settings.selectedStudent.key,
      })
      const { termId } = settings.requestFilters
      const { startDate, endDate } =
        termsData.find((term) => term._id === termId) || {}
      fetchInterventionsByGroups({
        type: [ACADEMIC, ATTENDANCE],
        studentId: settings.selectedStudent.key,
        termId,
        startDate,
        endDate,
      })
      fetchSPRFFilterDataRequest({
        termId,
        studentId: settings.selectedStudent.key,
      })
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedStudent.key, settings.requestFilters.termId])

  useEffect(() => {
    if (
      !selectedMasteryScale._id ||
      !settings.selectedStudent.key ||
      !settings.requestFilters.termId
    ) {
      return
    }
    fetchStudentsMasteryDataRequest({
      ...settings.requestFilters,
      standardsProficiencyProfileId: selectedMasteryScale._id,
      profileId: selectedMasteryScale._id,
      studentId: settings.selectedStudent.key,
    })
  }, [
    settings.selectedStudent.key,
    settings.requestFilters.termId,
    selectedMasteryScale._id,
  ])

  const selectedPerformanceBand = (
    bandInfo.find(
      (x) =>
        x._id ===
        (sharedReportFilters || settings.frontEndFilters)
          .performanceBandProfileId
    ) || bandInfo[0]
  )?.performanceBand

  const [chartData, tableData, isDataEmpty] = useMemo(() => {
    const {
      assignmentMetrics: internalAssignmentMetrics = [],
      districtMetrics: internalDistrictMetrics = [],
      schoolMetrics: internalSchoolMetrics = [],
      groupMetrics = [],
      externalTestMetrics = [],
      externalSchoolMetrics = [],
      externalDistrictMetrics = [],
      externalBands = [],
    } = get(reportData, 'data.result', {})
    const assignmentMetrics = mergeTestMetrics(
      internalAssignmentMetrics,
      externalTestMetrics,
      externalBands
    )
    const districtMetrics = mergeDistrictMetrics(
      internalDistrictMetrics,
      externalDistrictMetrics
    )
    const schoolMetrics = mergeSchoolMetrics(
      internalSchoolMetrics,
      externalSchoolMetrics
    )
    const _chartData = getChartData({
      assignmentMetrics,
      studentClassData: settings.selectedStudentClassData,
      selectedPerformanceBand,
      testTypes,
      externalScoreType,
    })
    const _tableData = getTableData({
      districtMetrics,
      schoolMetrics,
      groupMetrics,
      chartData: _chartData,
      externalScoreType,
    })
    return [
      _chartData,
      _tableData,
      isEmpty(assignmentMetrics) ||
        isEmpty(districtMetrics) ||
        isEmpty(schoolMetrics),
    ]
  }, [
    reportData,
    settings.selectedStudentClassData,
    selectedPerformanceBand,
    testTypes,
    externalScoreType,
  ])

  const attendanceChartData = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(attendanceData)
    return _attendanceChartData
  }, [attendanceData])

  const studentName = getStudentName(
    settings.selectedStudentInformation,
    settings.selectedStudent
  )
  const toggleAttendanceChart = () => {
    isAttendanceChartToggled.current = true
    setIsAttendanceChartVisible((v) => !v)
  }

  const toggleInterventionInfo = () => {
    setShowInterventions((v) => !v)
  }

  const onCsvConvert = (data) =>
    downloadCSV(`Whole Learner-${studentName}.csv`, data)

  // TODO cleanup+fix loading states and error/empty handling
  const isReportLoading = loadingReportData || loadingAttendanceData

  return (
    <>
      {sharingState && (
        <ShareReportModal
          reportType={loc}
          reportFilters={{
            ...settings.requestFilters,
            ...settings.frontEndFilters,
            ...settings.standardFilters,
            studentId: settings?.selectedStudent?.key,
          }}
          showModal={sharingState}
          setShowModal={setSharingState}
        />
      )}
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      >
        <WholeLearnerReportFilters
          reportId={reportId}
          isPrinting={isPrinting}
          onGoClick={onGoClick}
          history={history}
          location={location}
          showApply={showApply}
          firstLoad={firstLoad}
          userRole={userRole}
          orgData={orgData}
          defaultTermId={defaultTermId}
          // value props (from report selectors)
          loadingFiltersData={loadingFiltersData}
          prevFiltersData={prevFiltersData}
          filtersData={filtersData}
          student={student}
          filters={filters}
          filterTagsData={filterTagsData}
          selectedFilterTagsData={selectedFilterTagsData}
          // action props (others)
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          setFirstLoad={setFirstLoad}
          // action props (from report actions)
          fetchFiltersDataRequest={fetchFiltersDataRequest}
          fetchStudentsDataRequest={fetchStudentsDataRequest}
          setFilters={setFilters}
          setStudent={setStudent}
          setFilterTagsData={setFilterTagsData}
          setPrevFiltersData={setPrevFiltersData}
          resetFiltersData={resetFiltersData}
          fetchUpdateTagsData={fetchUpdateTagsData}
        />
      </SubHeader>
      <div>
        <EduIf condition={firstLoad}>
          <Spin size="large" />
        </EduIf>
        <EduIf condition={isReportLoading}>
          <EduThen>
            <SpinLoader
              tip="Please wait while we gather the required information..."
              position="fixed"
            />
          </EduThen>
          <EduElse>
            <EduIf condition={error && error.dataSizeExceeded}>
              <EduThen>
                <DataSizeExceeded />
              </EduThen>
              <EduElse>
                <EduIf
                  condition={isDataEmpty || !settings.selectedStudent?.key}
                >
                  <EduThen>
                    <NoDataContainer>
                      {settings.requestFilters?.termId
                        ? 'No data available currently.'
                        : ''}
                    </NoDataContainer>
                  </EduThen>
                  <EduElse>
                    <SectionLabel
                      $margin="30px 0px 10px 0px"
                      showHelp
                      url={helpLinks[reportNavType.WHOLE_LEARNER_REPORT]}
                      style={{ fontSize: '20px' }}
                    >
                      Whole Learner
                    </SectionLabel>
                    <SectionDescription $margin="0px 0px 30px 0px">
                      Get a complete understanding of a learner&apos;s academic
                      and behavioral profiles and take necessary actions for the
                      learner&apos;s growth.
                    </SectionDescription>
                    <Summary
                      studentInformation={settings.selectedStudentInformation}
                      studentClassData={studentClassData}
                      settings={settings}
                    />
                    <WLRDetails
                      isPrinting={isPrinting}
                      isAttendanceChartVisible={isAttendanceChartVisible}
                      attendanceChartData={attendanceChartData}
                      showInterventions={showInterventions}
                      attendanceInterventions={attendanceInterventions}
                      tableData={tableData}
                      isSharedReport={isSharedReport}
                      onCsvConvert={onCsvConvert}
                      isCsvDownloading={isCsvDownloading}
                      studentMasteryProfile={studentMasteryProfile}
                      SPRFFilterData={SPRFFilterData}
                      settings={settings}
                      chartData={chartData}
                      selectedPerformanceBand={selectedPerformanceBand}
                      academicInterventions={academicInterventions}
                      history={history}
                      location={location}
                      filtersData={filtersData}
                      testTypes={testTypes}
                      externalScoreType={externalScoreType}
                      filters={filters}
                      setFilters={setFilters}
                      filterTagsData={filterTagsData}
                      setFilterTagsData={setFilterTagsData}
                      setSettings={setSettings}
                      toggleAttendanceChart={toggleAttendanceChart}
                      interventionsData={interventionsData}
                      toggleInterventionInfo={toggleInterventionInfo}
                      fetchStudentsMasteryDataRequest={
                        fetchStudentsMasteryDataRequest
                      }
                      selectedMasteryScale={selectedMasteryScale}
                      setSelectedMasteryScale={setSelectedMasteryScale}
                      loadingMasteryData={loadingMasteryData}
                    />
                  </EduElse>
                </EduIf>
              </EduElse>
            </EduIf>
          </EduElse>
        </EduIf>
      </div>
    </>
  )
}

const enhance = connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    isCsvDownloading: getCsvDownloadingState(state),
    userRole: getUserRole(state),
    orgData: getOrgDataSelector(state),
    defaultTermId: getCurrentTerm(state),
    interventionsData: getInterventionsByGroup(state),
    academicInterventions: getAcademicInterventions(state),
    attendanceInterventions: getAttendanceInterventions(state),
    termsData: get(state, 'user.user.orgData.terms', []),
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
    fetchInterventionsByGroups: fetchInterventionsByGroupsRequest,

    fetchUpdateTagsData: (opts) =>
      fetchUpdateTagsDataAction({
        type: reportGroupType.WHOLE_LEARNER_REPORT,
        ...opts,
      }),
  }
)

export default enhance(WholeLearnerReport)
