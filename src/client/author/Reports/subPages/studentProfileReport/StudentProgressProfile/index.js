import React, { useEffect, useMemo, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from '@edulastic/localization'
import { SpinLoader } from '@edulastic/common'
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
} from './ducks'
import {
  getReportsSPRFilterData,
  getReportsSPRFilterLoadingState,
} from '../common/filterDataDucks'
import { useGetBandData } from '../../multipleAssessmentReport/StudentProgress/hooks'

import dropDownData from './static/json/dropDownData.json'
import {
  filterMetricInfo,
  getDomainOptions,
  getStandardsOptions,
} from './common/utils/transformers'
import { downloadCSV } from '../../../common/util'

const compareBy = {
  key: 'standard',
  title: 'Standard',
}

const StudentProgressProfile = ({
  settings,
  pageTitle,
  sharedReport,
  loading,
  reportsSPRFilterLoadingState,
  location,
  SPRFilterData,
  studentProgressProfile,
  getStudentProgressProfileRequest,
  error,
  isCsvDownloading,
}) => {
  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData))
  const [selectedDomain, setSelectedDomain] = useState({
    key: 'All',
    title: 'All Domains',
  })
  const [selectedStandard, setSelectedStandard] = useState({
    key: 'All',
    title: 'All Standards',
  })
  const [selectedTrend, setSelectedTrend] = useState('')
  const [pageFilters, setPageFilters] = useState({
    page: 0,
    pageSize: 25,
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

  const { bandInfo: bands = [], scaleInfo = [] } = get(
    SPRFilterData,
    'data.result',
    {}
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

  const { metricInfo = [], skillInfo = [], standardsCount = 0 } = get(
    studentProgressProfile,
    'data.result',
    {}
  )

  const domainOptions = getDomainOptions(skillInfo)

  const standardsOptions = getStandardsOptions(skillInfo, selectedDomain)

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [settings])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      ...pageFilters,
      studentId: settings.selectedStudent.key,
      domainIds: selectedDomain.key === 'All' ? '' : selectedDomain.key,
      standardIds: selectedStandard.key === 'All' ? '' : selectedStandard.key,
    }
    if ((q.termId || q.reportId) && q.studentId && pageFilters.page) {
      getStudentProgressProfileRequest(q)
    }
  }, [pageFilters, selectedDomain, selectedStandard])

  const onTrendSelect = (trend) =>
    setSelectedTrend(trend === selectedTrend ? '' : trend)

  const onDomainSelect = (_, selected) => setSelectedDomain(selected)
  const onStandardSelect = (_, selected) => setSelectedStandard(selected)
  const onAnalyseBySelect = (_, selected) => setAnalyseBy(selected)
  const onCsvConvert = (_data) =>
    downloadCSV(`Student Progress Profile.csv`, _data)

  const filteredMetricInfo = useMemo(
    () => filterMetricInfo(metricInfo, selectedDomain, selectedStandard),
    [metricInfo, selectedDomain, selectedStandard]
  )

  const [data, trendCount] = useGetBandData(
    filteredMetricInfo,
    compareBy.key,
    skillInfo,
    selectedTrend,
    bandInfo
  )

  if (loading || reportsSPRFilterLoadingState) {
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (
    isEmpty(studentProgressProfile) ||
    !studentProgressProfile ||
    isEmpty(metricInfo) ||
    !settings.selectedStudent?.key
  ) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }

  return (
    <>
      <TrendStats
        heading="How well is the student progressing ?"
        trendCount={trendCount}
        selectedTrend={selectedTrend}
        onTrendSelect={onTrendSelect}
        isSharedReport={isSharedReport}
        renderFilters={() => (
          <>
            <ControlDropDown
              showPrefixOnSelected={false}
              by={selectedDomain}
              selectCB={onDomainSelect}
              data={domainOptions}
              prefix="Domain(s)"
            />
            <ControlDropDown
              showPrefixOnSelected={false}
              by={selectedStandard}
              selectCB={onStandardSelect}
              data={standardsOptions}
              prefix="Standard(s)"
            />
            <ControlDropDown
              prefix="Analyze By"
              by={analyseBy}
              selectCB={onAnalyseBySelect}
              data={dropDownData.analyseByData}
            />
          </>
        )}
      />
      <TrendTable
        filters={sharedReportFilters || settings.requestFilters}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        data={data}
        masteryScale={selectedScale}
        compareBy={compareBy}
        analyseBy={analyseBy}
        rawMetric={filteredMetricInfo}
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
    </>
  )
}

const withConnect = connect(
  (state) => ({
    studentProgressProfile: getReportsStudentProgressProfile(state),
    reportsSPRFilterLoadingState: getReportsSPRFilterLoadingState(state),
    loading: getReportsStudentProgressProfileLoader(state),
    error: getReportsStudentProgressProfileError(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getStudentProgressProfileRequest: getStudentProgressProfileRequestACtion,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(StudentProgressProfile)
