import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { get, mapValues, pick, isEmpty } from 'lodash'
import { Spin } from 'antd'
import next from 'immer'

import { SpinLoader } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import { reportGroupType } from '@edulastic/constants/const/report'
import { SubHeader } from '../../../common/components/Header'
import { NoDataContainer, ReportContainer } from '../../../common/styled'
import StudentDetails from './components/StudentDetails'
import AssessmentsTable from './components/AssessmentsTable'
import AssessmentsChart from './components/AssessmentsChart'
import ShareReportModal from '../../../common/components/Popups/ShareReportModal'
import WholeChildReportFilters from './components/Filters'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'

import { resetAllReportsAction } from '../../../common/reportsRedux'
import {
  fetchUpdateTagsDataAction,
  getCsvDownloadingState,
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
import navigation from '../../../common/static/json/navigation.json'
import { AttendanceChart } from './components/AttendanceChart'
import FeedbacksTable from './components/FeedbacksTable'

const { downloadCSV } = reportUtils.common

const WholeChildReport = ({
  // value props
  loc,
  location,
  history,
  sharingState,
  sharedReportList,
  isCsvDownloading,
  userRole,
  userDistrictId,
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
  // selectedPerformanceBandProfileId,
  // selectedPerformanceBand,
  loadingReportData,
  loadingAttendanceData,
  settings,
  reportData,
  attendanceData,
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
  fetchAttendanceDataRequest,
  fetchUpdateTagsData,
}) => {
  const reportId = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }).reportId,
    []
  )
  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
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
      'termId',
      'standardsProficiencyProfileId',
      'reportId',
      'performanceBandProfileId',
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
    })
    setShowApply(false)
  }

  useEffect(
    () => () => {
      console.log('Whole Child Report Component Unmount')
      resetAllReports()
    },
    []
  )

  const computeChartNavigationLinks = () => {
    const { selectedStudent, requestFilters } = settings
    if (navigation.locToData[loc]) {
      const arr = Object.keys(requestFilters)
      const obj = {}
      arr.forEach((item) => {
        const val = requestFilters[item] === '' ? 'All' : requestFilters[item]
        obj[item] = val
      })
      obj.reportId = reportId || ''
      const _navigationItems = navigation.navigation[
        navigation.locToData[loc].group
      ].filter((item) => {
        // if data warehouse report is shared, only that report tab should be shown
        return !reportId || item.key === loc
      })
      return next(_navigationItems, (draft) => {
        const _currentItem = draft.find((t) => t.key === loc)
        _currentItem.location += `${selectedStudent.key}?${qs.stringify(obj)}`
      })
    }
    return []
  }

  useEffect(() => {
    if (settings.selectedStudent.key) {
      const path = `${settings.selectedStudent.key}?${qs.stringify(
        settings.requestFilters
      )}`
      history.push(path)
    }
    const computedChartNavigatorLinks = computeChartNavigationLinks()
    updateNavigation(computedChartNavigatorLinks)
  }, [settings])

  useEffect(() => {
    if (settings.selectedStudent.key) {
      const path = `/author/reports/whole-child-report/student/${
        settings.selectedStudent.key
      }?${qs.stringify(settings.requestFilters)}`
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
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedStudent, settings.requestFilters])

  const selectedPerformanceBand = (
    bandInfo.find(
      (x) =>
        x._id ===
        (sharedReportFilters || settings.requestFilters)
          .performanceBandProfileId
    ) || bandInfo[0]
  )?.performanceBand

  const [
    chartData,
    tableData,
    isDataEmpty,
    selPerformanceDetails,
  ] = useMemo(() => {
    const {
      assignmentMetrics: internalAssignmentMetrics = [],
      districtMetrics: internalDistrictMetrics = [],
      schoolMetrics: internalSchoolMetrics = [],
      groupMetrics = [],
      externalTestMetrics = [],
      externalSchoolMetrics = [],
      externalDistrictMetrics = [],
      selPerformance,
    } = get(reportData, 'data.result', {})
    const assignmentMetrics = mergeTestMetrics(
      internalAssignmentMetrics,
      externalTestMetrics
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
    })
    const _tableData = getTableData({
      districtMetrics,
      schoolMetrics,
      groupMetrics,
      chartData: _chartData,
    })
    return [
      _chartData,
      _tableData,
      isEmpty(assignmentMetrics) ||
        isEmpty(districtMetrics) ||
        isEmpty(schoolMetrics),
      selPerformance,
    ]
  }, [reportData, settings.selectedStudentClassData, selectedPerformanceBand])

  const [attendancePieChartData, attendanceChartData] = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(attendanceData)
    return _attendanceChartData
  }, [attendanceData])

  const studentName = getStudentName(
    settings.selectedStudentInformation,
    settings.selectedStudent
  )

  // const onTestSelect = (item) =>
  //   setSelectedTests(toggleItem(selectedTests, item.uniqId))
  const onCsvConvert = (data) =>
    downloadCSV(`Whole Child Report-${studentName}.csv`, data)

  const selReportURL = `/author/reports/social-emotional-learning?termId=${
    settings.requestFilters?.termId || ''
  }&schoolIds=All&teacherIds=All&grades=All&subjects=All&courseId=All&classIds=All&groupIds=All&testGrades=All&testSubjects=All&tagIds=All&assessmentTypes=All&testIds=All&curriculumId=&&standardGrade=All&profileId=&domainIds=All&standardId=All&assignedBy=anyone&reportId=`

  return (
    <>
      {sharingState && (
        <ShareReportModal
          reportType={loc}
          reportFilters={{
            ...settings.requestFilters,
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
        <WholeChildReportFilters
          reportId={reportId}
          isPrinting={isPrinting}
          onGoClick={onGoClick}
          history={history}
          location={location}
          showApply={showApply}
          firstLoad={firstLoad}
          userRole={userRole}
          userDistrictId={userDistrictId}
          orgData={orgData}
          defaultTermId={defaultTermId}
          // value props (from report selectors)
          loadingFiltersData={loadingFiltersData}
          prevFiltersData={prevFiltersData}
          filtersData={filtersData}
          student={student}
          filters={filters}
          filterTagsData={filterTagsData}
          selectedFilterTagsData={settings.selectedFilterTagsData}
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
      <ReportContainer>
        {firstLoad && <Spin size="large" />}
        {loadingReportData || loadingAttendanceData ? (
          <SpinLoader
            tip="Please wait while we gather the required information..."
            position="fixed"
          />
        ) : error && error.dataSizeExceeded ? (
          <DataSizeExceeded />
        ) : isDataEmpty || !settings.selectedStudent?.key ? (
          <NoDataContainer>
            {settings.requestFilters?.termId
              ? 'No data available currently.'
              : ''}
          </NoDataContainer>
        ) : (
          <>
            <StudentDetails
              studentInformation={settings.selectedStudentInformation}
              chartData={chartData}
              selectedPerformanceBand={selectedPerformanceBand}
              attendancePieChartData={attendancePieChartData}
              selPerformanceDetails={selPerformanceDetails}
              selReportURL={selReportURL}
            />
            <AssessmentsChart
              chartData={chartData}
              selectedPerformanceBand={selectedPerformanceBand}
            />
            <AttendanceChart attendanceChartData={attendanceChartData} />
            <AssessmentsTable
              // pageTitle={pageTitle}
              // location={location}
              tableData={tableData}
              // studentName={studentName}
              isSharedReport={isSharedReport}
              onCsvConvert={onCsvConvert}
              isCsvDownloading={isCsvDownloading}
            />
            <FeedbacksTable
              studentId={settings.selectedStudent.key}
              termId={settings.requestFilters.termId}
            />
          </>
        )}
      </ReportContainer>
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
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
    fetchUpdateTagsData: (opts) =>
      fetchUpdateTagsDataAction({
        type: reportGroupType.WHOLE_CHILD_REPORT,
        ...opts,
      }),
  }
)

export default enhance(WholeChildReport)
