import { SpinLoader } from '@edulastic/common'
import { get, isEmpty } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { downloadCSV, toggleItem } from '../../../common/util'
import { getCsvDownloadingState } from '../../../ducks'
import AssessmentChart from '../common/components/charts/AssessmentChart'
import { getReportsSPRFilterData } from '../common/filterDataDucks'
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
} from './ducks'

const StudentAssessmentProfile = ({
  loading,
  error,
  settings,
  SPRFilterData,
  studentAssessmentProfile,
  getStudentAssessmentProfile,
  isCsvDownloading,
  location,
  pageTitle,
  sharedReport,
  t,
  toggleFilter,
}) => {
  const anonymousString = t('common.anonymous')

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

  useEffect(() => {
    if (settings.selectedStudent.key && settings.requestFilters.termId) {
      getStudentAssessmentProfile({
        ...settings.requestFilters,
        studentId: settings.selectedStudent.key,
      })
    }
  }, [settings])

  useEffect(() => {
    const metrics = get(studentAssessmentProfile, 'data.result.metricInfo', [])
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
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
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (
    isEmpty(rawData) ||
    !rawData ||
    isEmpty(districtAvg) ||
    isEmpty(groupAvg) ||
    isEmpty(metricInfo) ||
    isEmpty(schoolAvg) ||
    !settings.selectedStudent?.key
  ) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }

  return (
    <>
      <StyledCard>
        <StyledH3>
          Assessment Performance Details of {studentName || anonymousString}
        </StyledH3>
        <p>
          <b>Subject : {studentInformation.standardSet || 'N/A'}</b>
        </p>
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
        />
      </StyledCard>
    </>
  )
}

const withConnect = connect(
  (state) => ({
    studentAssessmentProfile: getReportsStudentAssessmentProfile(state),
    loading: getReportsStudentAssessmentProfileLoader(state),
    error: getReportsStudentAssessmentProfileError(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getStudentAssessmentProfile: getStudentAssessmentProfileRequestAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(StudentAssessmentProfile)
