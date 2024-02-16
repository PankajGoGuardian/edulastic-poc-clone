import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { get, isEmpty } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import {
  downloadCSV,
  getNoDataContainerDesc,
  toggleItem,
} from '../../../common/util'
import { getCsvDownloadingState } from '../../../ducks'
import AssessmentChart from '../common/components/charts/AssessmentChart'
import {
  getReportsSPRFilterData,
  getReportsSPRFilterLoadingState,
} from '../common/filterDataDucks'
import {
  augementAssessmentChartData,
  getStudentName,
} from '../common/utils/transformers'
import AssessmentTable from './common/components/table/AssessmentTable'
import { getData } from './common/utils/transformers'
import {
  getReportsStudentAssessmentProfile,
  getReportsStudentAssessmentProfileLoader,
  getStudentAssessmentProfileRequestAction,
  getReportsStudentAssessmentProfileError,
  resetStudentAssessmentProfileAction,
} from './ducks'
import { getIsPreviewModalVisibleSelector } from '../../../../../assessment/selectors/test'
import { setIsTestPreviewVisibleAction } from '../../../../../assessment/actions/test'
import TestActivityModal from './common/components/TestActivityModal'

const StudentAssessmentProfile = ({
  loading,
  loadingFiltersData,
  error,
  settings,
  SPRFilterData,
  studentAssessmentProfile,
  getStudentAssessmentProfile,
  resetStudentAssessmentProfile,
  isCsvDownloading,
  location,
  pageTitle,
  sharedReport,
  t,
  toggleFilter,
  isPreviewModalVisible,
  setIsTestPreviewVisible,
}) => {
  const anonymousString = t('common.anonymous')
  const [currRecord, setCurrentRecord] = useState(null)

  const [sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )

  const { studentClassData = [], bandInfo: bands = [] } = get(
    SPRFilterData,
    'data.result',
    {}
  )

  const bandInfo = (
    bands.find(
      (x) =>
        x._id ===
        (sharedReportFilters || settings.requestFilters)
          .performanceBandProfileId
    ) || bands[0]
  )?.performanceBand

  const [selectedTests, setSelectedTests] = useState([])

  const rawData = get(studentAssessmentProfile, 'data.result', {})

  const [chartData, tableData] = useMemo(() => {
    const _chartData = augementAssessmentChartData(
      rawData.metricInfo,
      bandInfo,
      studentClassData
    )
    const _tableData = getData(rawData, _chartData, bandInfo)
    return [_chartData, _tableData]
  }, [rawData, bandInfo])

  useEffect(() => () => resetStudentAssessmentProfile(), [])

  useEffect(() => {
    if (settings.selectedStudent.key && settings.requestFilters.termId) {
      getStudentAssessmentProfile({
        ...settings.requestFilters,
        studentId: settings.selectedStudent.key,
      })
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedStudent, settings.requestFilters])

  useEffect(() => {
    const metrics = get(studentAssessmentProfile, 'data.result.metricInfo', [])
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(studentAssessmentProfile) &&
      !metrics.length
    ) {
      toggleFilter(null, true)
    }
  }, [studentAssessmentProfile])

  const {
    districtAvg = [],
    groupAvg = [],
    metricInfo = [],
    schoolAvg = [],
  } = rawData
  const studentInformation = studentClassData[0] || {}
  const studentName = getStudentName(
    settings.selectedStudent,
    studentInformation
  )

  const onTestSelect = (item) =>
    setSelectedTests(toggleItem(selectedTests, item.uniqId))
  const onCsvConvert = (data) =>
    downloadCSV(
      `Assessment Performance Report-${studentName || anonymousString}.csv`,
      data
    )

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

  const hasContent = [
    isEmpty(rawData),
    isEmpty(districtAvg),
    isEmpty(groupAvg),
    isEmpty(metricInfo),
    isEmpty(schoolAvg),
    !settings.selectedStudent?.key,
  ].every((e) => !e)

  const noDataDesc = getNoDataContainerDesc(settings, loadingFiltersData)

  return (
    <EduIf condition={hasContent}>
      <EduThen>
        <StyledCard>
          <StyledH3>
            Assessment Performance Details of {studentName || anonymousString}
          </StyledH3>
          <AssessmentChart
            data={chartData}
            selectedTests={selectedTests}
            onBarClickCB={onTestSelect}
            onResetClickCB={() => setSelectedTests([])}
            studentInformation={studentInformation}
          />
        </StyledCard>
        <StyledCard>
          <AssessmentTable
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            data={tableData}
            studentName={studentName || anonymousString}
            selectedTests={selectedTests}
            location={location}
            pageTitle={pageTitle}
            isSharedReport={isSharedReport}
            setIsTestPreviewVisible={(_record) => {
              setCurrentRecord(_record)
              setIsTestPreviewVisible(true)
            }}
          />
        </StyledCard>
        {isPreviewModalVisible && (
          <TestActivityModal
            isModalVisible={isPreviewModalVisible}
            skipPlayer
            groupId={currRecord.groupId}
            testActivityId={currRecord.testActivityId}
            assignmentId={currRecord.assignmentId}
            testId={currRecord.testId}
            studentId={settings?.selectedStudent?.key}
            studentName={settings?.selectedStudent?.title}
            closeTestPreviewModal={() => setIsTestPreviewVisible(false)}
          />
        )}
      </EduThen>
      <EduElse>
        <NoDataContainer>{noDataDesc}</NoDataContainer>
      </EduElse>
    </EduIf>
  )
}

const withConnect = connect(
  (state) => ({
    studentAssessmentProfile: getReportsStudentAssessmentProfile(state),
    loading: getReportsStudentAssessmentProfileLoader(state),
    loadingFiltersData: getReportsSPRFilterLoadingState(state),
    error: getReportsStudentAssessmentProfileError(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
    isPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
  }),
  {
    getStudentAssessmentProfile: getStudentAssessmentProfileRequestAction,
    resetStudentAssessmentProfile: resetStudentAssessmentProfileAction,
    setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(StudentAssessmentProfile)
