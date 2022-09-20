import { SpinLoader } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import { isEmpty, get } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import DataSizeExceeded from '../../../../common/components/DataSizeExceeded'
import { resetAllReportsAction } from '../../../../common/reportsRedux'
import { NoDataContainer, ReportContainer } from '../../../../common/styled'
import { getCsvDownloadingState } from '../../../../ducks'
import { actions, selectors } from '../ducks'
import { getChartData, getStudentName, getTableData } from '../utils'
import AssessmentsChart from './AssessmentsChart'
import AssessmentsTable from './AssessmentsTable'
import StudentDetails from './StudentDetails'

const { downloadCSV } = reportUtils.common

const ReportData = ({
  error,
  reportData,
  settings,
  filtersData,
  isCsvDownloading,
  resetAllReports,
  loadingReportData,
  fetchReportDataRequest,
  fetchFiltersDataRequest,
  toggleFilter,
}) => {
  useEffect(
    () => () => {
      console.log('Whole Child Report Component Unmount')
      resetAllReports()
    },
    []
  )
  useEffect(() => {
    if (settings.selectedStudent.key && settings.requestFilters.termId) {
      fetchFiltersDataRequest({
        ...settings.requestFilters,
        studentId: settings.selectedStudent.key,
      })
      fetchReportDataRequest({
        ...settings.requestFilters,
        studentId: settings.selectedStudent.key,
      })
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedStudent, settings.requestFilters])

  const {
    assignmentMetrics = [],
    districtMetrics = [],
    schoolMetrics = [],
    groupMetrics = [],
  } = get(reportData, 'data.result', {})
  const { studentClassData = [], bandInfo = [], demographics = {} } = get(
    filtersData,
    'data.result',
    {}
  )

  const selectedPerformanceBand = (
    bandInfo.find(
      (x) => x._id === settings.requestFilters.performanceBandProfileId
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

  const onCsvConvert = (data) =>
    downloadCSV(`Whole Child Report-${studentName}.csv`, data)
  return (
    <ReportContainer>
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
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
          />
        </>
      )}
    </ReportContainer>
  )
}

const enhance = connect(
  (state) => ({
    error: selectors.error(state),
    reportData: selectors.reportData(state),
    filtersData: selectors.filtersData(state),
    loadingReportData: selectors.loadingReportData(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
  }
)

export default enhance(ReportData)
