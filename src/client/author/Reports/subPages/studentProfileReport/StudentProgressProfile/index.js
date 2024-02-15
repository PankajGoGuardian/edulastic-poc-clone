import React, {
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
  useRef,
} from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import ResizeObserver from 'rc-resize-observer'
import { withNamespaces } from '@edulastic/localization'
import { FlexContainer, SpinLoader, useApiQuery } from '@edulastic/common'
import { get, head, isEmpty } from 'lodash'
import { reportsApi } from '@edulastic/api'
import TrendStats from '../../multipleAssessmentReport/common/components/trend/TrendStats'
import TrendTable from '../../multipleAssessmentReport/common/components/trend/TrendTable'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { NoDataContainer } from '../../../common/styled'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'

import { getCsvDownloadingState } from '../../../ducks'
import {
  getReportsStudentProgressProfile,
  getReportsStudentProgressProfileLoader,
  getReportsStudentProgressProfileError,
  getStudentProgressProfileRequestACtion,
  resetStudentProgressProfileAction,
} from './ducks'
import {
  getReportsSPRFilterData,
  getReportsSPRFilterLoadingState,
} from '../common/filterDataDucks'
import { useGetBandData } from '../../multipleAssessmentReport/StudentProgress/hooks'

import dropDownData from './static/json/dropDownData.json'
import {
  downloadCSV,
  getFilterOptions,
  getNoDataContainerDesc,
} from '../../../common/util'
import { getStudentName } from '../common/utils/transformers'
import MultiSelectDropdown from '../../../common/components/widgets/MultiSelectDropdown'
import { StyledSelectInput } from '../common/components/styledComponents'
import {
  getDynamicColumns,
  transformInterventions,
  updateFilterTagsCount,
} from './utils'
import { DW_GOALS_AND_INTERVENTIONS_TYPES } from '../../dataWarehouseReports/GoalsAndInterventions/constants/form'
import useErrorNotification from '../../../common/hooks/useErrorNotification'

const compareBy = {
  key: 'standard',
  title: 'Standard',
}

const StudentProgressProfile = ({
  settings,
  termsData,
  setSPRTagsData,
  pageTitle,
  sharedReport,
  loading,
  loadingFiltersData,
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
  const [maxTagsCount, setMaxTagsCount] = useState(7)
  const [selectedTrend, setSelectedTrend] = useState('')
  const [pageFilters, setPageFilters] = useState({
    page: 0,
    pageSize: 10,
  })
  const renderFiltersRef = useRef(null)
  const interventionIdRef = useRef(null)

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
    setSPRTagsData({ ...settings.tagsData, testIds: [] })
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
    setSelectedTests([])
    if ((q.termId || q.reportId) && q.studentId && pageFilters.page) {
      getStudentProgressProfileRequest(q)
    }
  }, [pageFilters])

  const search = useUrlSearchParams(location)

  // TODO fix for page reload - interventionId is not retained on page reload
  if (search.interventionId) interventionIdRef.current = search.interventionId

  const { termId } = settings.requestFilters
  const { startDate, endDate } =
    termsData.find((term) => term._id === termId) || {}

  const apiQuery = useMemo(
    () => ({
      type: [DW_GOALS_AND_INTERVENTIONS_TYPES.TUTORME],
      studentId: settings.selectedStudent.key,
      termId,
      startDate,
      endDate,
      interventionIds: [interventionIdRef.current],
    }),
    [settings.requestFilters.termId, settings.selectedStudent.key]
  )
  const {
    data: tutorMeInterventionsData,
    loading: tutorMeInterventionsLoading,
    error: tutorMeInterventionsError,
  } = useApiQuery(reportsApi.getReportInterventions, [apiQuery], {
    enabled:
      !isEmpty(settings.requestFilters.termId) &&
      !isEmpty(settings.selectedStudent.key) &&
      !isEmpty(interventionIdRef.current),
    deDuplicate: false,
  })
  useErrorNotification(
    'Error fetching Tutoring details',
    tutorMeInterventionsError
  )

  const interventionData = useMemo(
    () => transformInterventions(tutorMeInterventionsData),
    [tutorMeInterventionsData]
  )

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

  useLayoutEffect(() => {
    updateFilterTagsCount(renderFiltersRef, selectedTests, setMaxTagsCount)
  }, [selectedTests, setMaxTagsCount, renderFiltersRef])

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

  const onTestsSelect = (selected) => {
    setSelectedTests(selected)
    const selectedTestsFilterOptions = testsFilterDropdownOptions.filter(
      (option) => selected.includes(option.key)
    )
    setSPRTagsData({
      ...settings.tagsData,
      testIds: selectedTestsFilterOptions,
    })
  }

  if (loading || tutorMeInterventionsLoading) {
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
    const noDataDesc = getNoDataContainerDesc(settings, loadingFiltersData)
    return <NoDataContainer>{noDataDesc}</NoDataContainer>
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
          <FlexContainer
            flex="1 1 0"
            style={{ gap: '5px' }}
            ref={renderFiltersRef}
          >
            <ResizeObserver
              onResize={() => {
                updateFilterTagsCount(
                  renderFiltersRef,
                  selectedTests,
                  setMaxTagsCount
                )
              }}
            >
              <MultiSelectDropdown
                className="student-standards-progress-tests-filter"
                dataCy="tests"
                label="Test(s)"
                onChange={onTestsSelect}
                value={selectedTests}
                options={testsFilterDropdownOptions}
                displayLabel={false}
                maxTagCount={maxTagsCount}
                InputComponent={StyledSelectInput}
              />
            </ResizeObserver>
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
          getDynamicColumns={
            interventionIdRef.current && !tutorMeInterventionsError
              ? getDynamicColumns
              : null
          }
          interventionData={interventionData}
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
    loadingFiltersData: getReportsSPRFilterLoadingState(state),
    error: getReportsStudentProgressProfileError(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
    termsData: get(state, 'user.user.orgData.terms', []),
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
