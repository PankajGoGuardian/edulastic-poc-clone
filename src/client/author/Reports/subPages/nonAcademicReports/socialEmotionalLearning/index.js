import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { filter, get, isEmpty } from 'lodash'

import { Col, Row } from 'antd'
import { report as reportTypes, reportUtils } from '@edulastic/constants'
import { SpinLoader } from '@edulastic/common'
import {
  DropDownContainer,
  StyledCard,
  NoDataContainer,
} from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import StandardsPerformanceChart from './components/charts/StandardsPerformanceChart'
import { StyledInnerRow, StyledRow } from './components/styled'
import StandardsPerformanceTable from './components/table/StandardsPerformanceTable'

import { generateCSVAction, getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getReportsStandardsPerformanceSummary,
  getReportsStandardsPerformanceSummaryLoader,
  getStandardsPerformanceSummaryRequestAction,
  getReportsStandardsPerformanceSummaryError,
  resetStandardsPerformanceSummaryAction,
} from './ducks'

import dropDownData from './static/json/dropDownData.json'

const {
  getMasteryLevel,
  getMasteryLevelOptions,
  getMaxMasteryScore,
  getOverallMasteryScore,
  getParsedData,
} = reportUtils.standardsPerformanceSummary

const { compareByData, analyseByData } = dropDownData

const SocialEmotionalLearning = ({
  standardsPerformanceSummary,
  standardsFilters,
  getStandardsPerformanceSummaryRequest,
  resetStandardsPerformanceSummary,
  isCsvDownloading,
  toggleFilter,
  settings,
  loading,
  error,
  userRole,
  sharedReport,
  generateCSV,
}) => {
  const sharedReportFilters = useMemo(
    () =>
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
    [sharedReport]
  )
  const res = useMemo(
    () => get(standardsPerformanceSummary, 'data.result', {}),
    [standardsPerformanceSummary]
  )
  const scales = get(standardsFilters, 'data.result.scaleInfo', [])
  const selectedScale =
    (
      res.scaleInfo ||
      scales.find(
        (s) =>
          s._id === (sharedReportFilters || settings.requestFilters).profileId
      ) ||
      scales[0]
    )?.scale || []
  const maxMasteryScore = getMaxMasteryScore(selectedScale)
  const masteryLevelData = getMasteryLevelOptions(selectedScale)

  // filter compareBy options according to role
  const compareByDataFiltered = filter(
    compareByData,
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  const [tableFilters, setTableFilters] = useState({
    masteryLevel: masteryLevelData[0],
    compareBy: compareByDataFiltered[0],
    analyseBy: analyseByData[3],
  })
  // support for domain filtering from backend
  const [pageFilters, setPageFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: 10,
  })
  const [selectedDomains, setSelectedDomains] = useState([])

  const generateCSVRequired =
    res.domainsCount > pageFilters.pageSize || (error && error.dataSizeExceeded)

  useEffect(() => () => resetStandardsPerformanceSummary(), [])

  // set initial page filters
  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, tableFilters.compareBy.key])

  // get paginated data
  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: tableFilters.compareBy.key,
      ...pageFilters,
    }
    if ((q.termId || q.reportId) && pageFilters.page) {
      getStandardsPerformanceSummaryRequest(q)
    }
  }, [pageFilters])

  // show filters section if metricInfo is empty
  useEffect(() => {
    const metricInfo = get(
      standardsPerformanceSummary,
      'data.result.metricInfo',
      []
    )
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(standardsPerformanceSummary) &&
      !metricInfo.length
    ) {
      toggleFilter(null, true)
    }
  }, [standardsPerformanceSummary])

  useEffect(() => {
    if (isCsvDownloading && generateCSVRequired) {
      const q = {
        reportType: reportTypes.reportNavType.STANDARDS_PERFORMANCE_SUMMARY,
        reportFilters: {
          ...settings.requestFilters,
          compareBy: tableFilters.compareBy.key,
          ...pageFilters,
        },
        reportExtras: {
          tableFilters,
        },
      }
      generateCSV(q)
    }
  }, [isCsvDownloading])

  const overallMetricMasteryScore = getOverallMasteryScore(res.metricInfo || [])
  const overallMetricMasteryLevel = getMasteryLevel(
    overallMetricMasteryScore,
    selectedScale
  )

  const { domainsData, tableData } = useMemo(
    () =>
      getParsedData(
        res.metricInfo,
        res.studInfo,
        maxMasteryScore,
        tableFilters,
        selectedDomains,
        res.skillInfo,
        res.groupInfo,
        selectedScale
      ),
    [res, maxMasteryScore, selectedDomains, tableFilters, selectedScale]
  )

  const tableFiltersOptions = {
    compareByData: compareByDataFiltered,
    analyseByData,
    masteryLevelData,
  }

  if (loading) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded isDownloadable />
  }

  if (!res.metricInfo?.length) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <DropDownContainer>
      <StyledCard>
        <StandardsPerformanceChart
          data={domainsData}
          selectedDomains={selectedDomains}
          setSelectedDomains={setSelectedDomains}
          skillInfo={res.skillInfo}
          maxMasteryScore={maxMasteryScore}
          scaleInfo={selectedScale}
          backendPagination={{
            ...pageFilters,
            pageCount: Math.ceil(res.domainsCount / pageFilters.pageSize) || 1,
          }}
          setBackendPagination={setPageFilters}
        />
      </StyledCard>
      <StyledCard>
        <StandardsPerformanceTable
          tableData={tableData}
          onFilterChange={setTableFilters}
          tableFilters={tableFilters}
          tableFiltersOptions={tableFiltersOptions}
          domainsData={domainsData}
          scaleInfo={selectedScale}
          selectedDomains={selectedDomains}
          isCsvDownloading={generateCSVRequired ? null : isCsvDownloading}
          selectedTermId={
            (sharedReportFilters || settings?.requestFilters)?.termId || ''
          }
          isSharedReport={!!sharedReport?._id}
        />
      </StyledCard>
    </DropDownContainer>
  )
}

const enhance = connect(
  (state) => ({
    standardsPerformanceSummary: getReportsStandardsPerformanceSummary(state),
    loading: getReportsStandardsPerformanceSummaryLoader(state),
    error: getReportsStandardsPerformanceSummaryError(state),
    standardsFilters: getReportsStandardsFilters(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getStandardsPerformanceSummaryRequest: getStandardsPerformanceSummaryRequestAction,
    resetStandardsPerformanceSummary: resetStandardsPerformanceSummaryAction,
    generateCSV: generateCSVAction,
  }
)

export default enhance(SocialEmotionalLearning)
