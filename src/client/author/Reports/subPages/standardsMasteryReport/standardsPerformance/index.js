import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { filter, get, isEmpty } from 'lodash'

import { Col, Row } from 'antd'
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

import { getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getReportsStandardsPerformanceSummary,
  getReportsStandardsPerformanceSummaryLoader,
  getStandardsPerformanceSummaryRequestAction,
  getReportsStandardsPerformanceSummaryError,
  resetStandardsPerformanceSummaryAction,
} from './ducks'

import {
  getMasteryLevel,
  getMasteryLevelOptions,
  getMaxMasteryScore,
  getOverallMasteryScore,
  getParsedData,
} from './utils/transformers'
import dropDownData from './static/json/dropDownData.json'

const { compareByData, analyseByData } = dropDownData

const StandardsPerformance = ({
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
}) => {
  const sharedReportFilters = useMemo(
    () =>
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
    [sharedReport]
  )
  const scaleInfo = get(standardsFilters, 'data.result.scaleInfo', [])
  const selectedScale =
    (
      scaleInfo.find(
        (s) =>
          s._id === (sharedReportFilters || settings.requestFilters).profileId
      ) || scaleInfo[0]
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

  useEffect(() => () => resetStandardsPerformanceSummary(), [])

  // set initial page filters
  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
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

  const res = get(standardsPerformanceSummary, 'data.result', {})

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
    return <DataSizeExceeded />
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
        <Row>
          <Col>
            <StyledRow>
              <StyledInnerRow
                type="flex"
                justify="center"
                className="students-stats"
              >
                <Col>
                  <p className="students-title">Overall Mastery Score</p>
                  <p className="students-value">{overallMetricMasteryScore}</p>
                </Col>
                <Col>
                  <p className="students-title">Overall Mastery Level</p>
                  <p className="students-value">
                    {overallMetricMasteryLevel.masteryName}
                  </p>
                </Col>
              </StyledInnerRow>
            </StyledRow>
          </Col>
        </Row>
      </StyledCard>
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
          dataSource={tableData}
          onFilterChange={setTableFilters}
          tableFilters={tableFilters}
          tableFiltersOptions={tableFiltersOptions}
          domainsData={domainsData}
          scaleInfo={selectedScale}
          selectedDomains={selectedDomains}
          isCsvDownloading={isCsvDownloading}
          selectedTermId={
            (sharedReportFilters || settings?.requestFilters)?.termId || ''
          }
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
  }
)

export default enhance(StandardsPerformance)
