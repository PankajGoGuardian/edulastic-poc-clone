import React, { useEffect, useMemo, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from '@edulastic/localization'
import { FlexContainer, SpinLoader } from '@edulastic/common'
import { get, head, isEmpty } from 'lodash'
import TrendStats from '../../multipleAssessmentReport/common/components/trend/TrendStats'
import TrendTable from '../../multipleAssessmentReport/common/components/trend/TrendTable'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { NoDataContainer } from '../../../common/styled'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'

import { getCsvDownloadingState } from '../../../ducks'
import {
  getReportsStudentProgressProfile,
  getReportsStudentProgressProfileLoader,
  getReportsStudentProgressProfileError,
  getStudentProgressProfileRequestACtion,
  resetStudentProgressProfileAction,
} from './ducks'
import { getReportsSPRFilterData } from '../common/filterDataDucks'
import { useGetBandData } from '../../multipleAssessmentReport/StudentProgress/hooks'

import dropDownData from './static/json/dropDownData.json'
import { downloadCSV, getFilterOptions } from '../../../common/util'
import { getStudentName } from '../common/utils/transformers'
import MultiSelectDropdown from '../../../common/components/widgets/MultiSelectDropdown'

const compareBy = {
  key: 'standard',
  title: 'Standard',
}

const StudentProgressProfile = ({
  settings,
  pageTitle,
  sharedReport,
  loading,
  location,
  SPRFilterData,
  studentProgressProfile,
  getStudentProgressProfileRequest,
  resetStudentProgressProfile,
  error,
  isCsvDownloading,
  t,
  toggleFilter,
}) => {
  const anonymousString = t('common.anonymous')
  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData))
  const [selectedTests, setSelectedTests] = useState([])
  const [selectedTrend, setSelectedTrend] = useState('')
  const [pageFilters, setPageFilters] = useState({
    page: 0,
    pageSize: 10,
  })

  const [sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )

  const { bandInfo: bands = [], scaleInfo = [] } = useMemo(
    () => get(SPRFilterData, 'data.result', {}),
    [SPRFilterData]
  )

  const selectedScale =
    (
      scaleInfo.find(
        (s) =>
          s._id === (sharedReportFilters || settings.requestFilters).profileId
      ) || scaleInfo[0]
    )?.scale || []

  const bandInfo = (
    bands.find(
      (x) =>
        x._id ===
        (sharedReportFilters || settings.requestFilters)
          .performanceBandProfileId
    ) || bands[0]
  )?.performanceBand

  const {
    metricInfo: rawMetricInfo,
    skillInfo,
    standardsCount,
  } = studentProgressProfile?.data?.result || {
    metricInfo: [],
    skillInfo: [],
    standardsCount: 0,
  }

  useEffect(() => () => resetStudentProgressProfile(), [])

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
    setSelectedTests([])
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [
    settings.selectedStudent,
    settings.requestFilters,
    settings.standardFilters,
  ])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      ...settings.standardFilters,
      ...pageFilters,
      studentId: settings.selectedStudent.key,
    }
    if ((q.termId || q.reportId) && q.studentId && pageFilters.page) {
      getStudentProgressProfileRequest(q)
    }
  }, [pageFilters])

  const metricInfo = useMemo(
    () =>
      isEmpty(selectedTests)
        ? rawMetricInfo
        : rawMetricInfo.filter((d) => selectedTests.includes(d.assignmentId)),
    [selectedTests, rawMetricInfo]
  )

  const onTrendSelect = (trend) =>
    setSelectedTrend(trend === selectedTrend ? '' : trend)

  const onAnalyseBySelect = (_, selected) => setAnalyseBy(selected)

  const studentName = getStudentName(settings.selectedStudent, {})
  const onCsvConvert = (_data) =>
    downloadCSV(
      `Student Standards Progress-${studentName || anonymousString}.csv`,
      _data
    )

  const [data, trendCount] = useGetBandData(
    metricInfo,
    compareBy.key,
    skillInfo,
    selectedTrend,
    bandInfo
  )

  const testsFilterDropdownOptions = getFilterOptions(
    rawMetricInfo,
    'assignmentId',
    'testName'
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

  if (!settings.selectedStudent?.key) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <>
      <TrendStats
        heading={`Standards progress of ${studentName || anonymousString}`}
        trendCount={trendCount}
        selectedTrend={selectedTrend}
        onTrendSelect={onTrendSelect}
        isSharedReport={isSharedReport}
        showTrendStats={!isEmpty(metricInfo)}
        renderFilters={() => (
          <FlexContainer flex="1 1 0" style={{ gap: '5px' }}>
            <MultiSelectDropdown
              dataCy="tests"
              label="Test(s)"
              onChange={setSelectedTests}
              value={selectedTests}
              options={testsFilterDropdownOptions}
              displayLabel={false}
            />
            <ControlDropDown
              prefix="Analyze By"
              by={analyseBy}
              selectCB={onAnalyseBySelect}
              data={dropDownData.analyseByData}
            />
          </FlexContainer>
        )}
      />
      {!isEmpty(metricInfo) ? (
        <TrendTable
          filters={sharedReportFilters || settings.requestFilters}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
          data={data}
          masteryScale={selectedScale}
          compareBy={compareBy}
          analyseBy={analyseBy}
          rawMetric={metricInfo}
          isCellClickable
          location={location}
          pageTitle={pageTitle}
          isSharedReport={isSharedReport}
          backendPagination={{
            ...pageFilters,
            itemsCount: standardsCount,
          }}
          setBackendPagination={setPageFilters}
        />
      ) : (
        <NoDataContainer>No data available currently.</NoDataContainer>
      )}
    </>
  )
}

const withConnect = connect(
  (state) => ({
    studentProgressProfile: getReportsStudentProgressProfile(state),
    loading: getReportsStudentProgressProfileLoader(state),
    error: getReportsStudentProgressProfileError(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getStudentProgressProfileRequest: getStudentProgressProfileRequestACtion,
    resetStudentProgressProfile: resetStudentProgressProfileAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(StudentProgressProfile)
