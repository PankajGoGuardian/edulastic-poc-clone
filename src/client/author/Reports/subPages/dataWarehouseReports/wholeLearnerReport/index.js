import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { get, mapValues, pick, isEmpty } from 'lodash'
import { Spin, Checkbox } from 'antd'

import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import {
  helpLinks,
  reportGroupType,
  reportNavType,
} from '@edulastic/constants/const/report'
import { SubHeader } from '../../../common/components/Header'
import { NoDataContainer, ReportContainer } from '../../../common/styled'
import StudentDetails from './components/StudentDetails'
import AssessmentsTable from './components/AssessmentsTable'
import AssessmentsChart from './components/AssessmentsChart'
import ShareReportModal from '../../../common/components/Popups/ShareReportModal'
import WholeLearnerReportFilters from './components/Filters'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { DW_WLR_REPORT_URL } from '../../../common/constants/dataWarehouseReports'
import SectionLabel from '../../../common/components/SectionLabel'
import SectionDescription from '../../../common/components/SectionDescription'
import AttendanceChart from './components/AttendanceChart'

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
import { ChartPreLabelWrapper } from '../../../common/components/charts/styled-components'
import { computeChartNavigationLinks } from '../../../common/util'

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
}) => {
  const reportId = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }).reportId,
    []
  )
  const [isAttendanceChartVisible, setIsAttendanceChartVisible] = useState(true)
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

  const testTypes = useMemo(() => {
    const _testTypes = (sharedReportFilters || settings.frontEndFilters)
      ?.testTypes
    return isEmpty(_testTypes) ? [] : _testTypes.split(',')
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
      'termId',
      'standardsProficiencyProfileId',
      'reportId',
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
    // settings.requestFilters is missing class filters
    const _requestFilters = {
      ...filters,
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
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedStudent.key, settings.requestFilters.termId])

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
    ]
  }, [
    reportData,
    settings.selectedStudentClassData,
    selectedPerformanceBand,
    testTypes,
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
    setIsAttendanceChartVisible((v) => !v)
  }

  // const onTestSelect = (item) =>
  //   setSelectedTests(toggleItem(selectedTests, item.uniqId))
  const onCsvConvert = (data) =>
    downloadCSV(`Whole Learner-${studentName}.csv`, data)

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
      <ReportContainer>
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
                    <StudentDetails
                      studentInformation={settings.selectedStudentInformation}
                      studentClassData={studentClassData}
                    />
                    <EduIf condition={!isEmpty(chartData)}>
                      <EduThen>
                        <AssessmentsChart
                          chartData={chartData}
                          selectedPerformanceBand={selectedPerformanceBand}
                          preLabelContent={
                            <ChartPreLabelWrapper>
                              <Checkbox
                                checked={isAttendanceChartVisible}
                                onChange={toggleAttendanceChart}
                              >
                                Show Attendance Chart
                              </Checkbox>
                            </ChartPreLabelWrapper>
                          }
                        />
                      </EduThen>
                      <EduElse>
                        <NoDataContainer margin="50px">
                          No academic data available.
                        </NoDataContainer>
                      </EduElse>
                    </EduIf>
                    <EduIf condition={isAttendanceChartVisible}>
                      <AttendanceChart
                        attendanceChartData={attendanceChartData}
                      />
                    </EduIf>
                    <EduIf condition={!isEmpty(tableData)}>
                      <AssessmentsTable
                        tableData={tableData}
                        isSharedReport={isSharedReport}
                        onCsvConvert={onCsvConvert}
                        isCsvDownloading={isCsvDownloading}
                      />
                    </EduIf>
                  </EduElse>
                </EduIf>
              </EduElse>
            </EduIf>
          </EduElse>
        </EduIf>
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
        type: reportGroupType.WHOLE_LEARNER_REPORT,
        ...opts,
      }),
  }
)

export default enhance(WholeLearnerReport)
