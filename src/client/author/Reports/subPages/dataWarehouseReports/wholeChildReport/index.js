import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { get, mapValues, pick, isEmpty } from 'lodash'
import { Spin } from 'antd'

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

import { getChartData, getTableData, getStudentName } from './utils'

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
  orgData,
  defaultTermId,
  showApply,
  breadcrumbData,
  isCliUser,
  isPrinting,
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
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedStudent, settings.requestFilters])

  const { studentClassData = [], bandInfo = [], demographics = {} } = get(
    filtersData,
    'data.result',
    {}
  )
  const {
    assignmentMetrics = [],
    districtMetrics = [],
    schoolMetrics = [],
    groupMetrics = [],
  } = get(reportData, 'data.result', {})

  const selectedPerformanceBand = (
    bandInfo.find(
      (x) =>
        x._id ===
        (sharedReportFilters || settings.requestFilters)
          .performanceBandProfileId
    ) || bandInfo[0]
  )?.performanceBand

  const [chartData, tableData] = useMemo(() => {
    const _chartData = getChartData({
      assignmentMetrics,
      studentClassData,
      selectedPerformanceBand,
    })
    const _tableData = getTableData({
      districtMetrics,
      schoolMetrics,
      groupMetrics,
      chartData: _chartData,
    })
    return [_chartData, _tableData]
  }, [
    assignmentMetrics,
    districtMetrics,
    schoolMetrics,
    groupMetrics,
    studentClassData,
    selectedPerformanceBand,
  ])

  const studentInformation = { ...(studentClassData[0] || {}), ...demographics }
  const studentName = getStudentName(
    settings.selectedStudent,
    studentInformation
  )

  // const onTestSelect = (item) =>
  //   setSelectedTests(toggleItem(selectedTests, item.uniqId))
  const onCsvConvert = (data) =>
    downloadCSV(`Whole Child Report-${studentName}.csv`, data)

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
        {loadingReportData ? (
          <SpinLoader
            tip="Please wait while we gather the required information..."
            position="fixed"
          />
        ) : error && error.dataSizeExceeded ? (
          <DataSizeExceeded />
        ) : isEmpty(assignmentMetrics) ||
          isEmpty(districtMetrics) ||
          isEmpty(schoolMetrics) ||
          isEmpty(groupMetrics) ||
          !settings.selectedStudent?.key ? (
          <NoDataContainer>
            {settings.requestFilters?.termId
              ? 'No data available currently.'
              : ''}
          </NoDataContainer>
        ) : (
          <>
            <StudentDetails studentInformation={studentInformation} />
            <AssessmentsChart
              chartData={chartData}
              selectedPerformanceBand={selectedPerformanceBand}
            />
            <AssessmentsTable
              // pageTitle={pageTitle}
              // location={location}
              tableData={tableData}
              // studentName={studentName}
              isSharedReport={isSharedReport}
              onCsvConvert={onCsvConvert}
              isCsvDownloading={isCsvDownloading}
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
