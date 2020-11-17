import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import next from 'immer'
import { filter, get } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { roleuser } from '@edulastic/constants'
import { getUser } from '../../../../src/selectors/user'
import { DropDownContainer, StyledCard } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { getCsvDownloadingState } from '../../../ducks'
import {
  getFiltersSelector,
  getReportsStandardsFilters,
} from '../common/filterDataDucks'
import StandardsPerformanceChart from './components/charts/StandardsPerformanceChart'
import { StyledInnerRow, StyledRow } from './components/styled'
import StandardsPerformanceTable from './components/table/StandardsPerformanceTable'
import {
  getReportsStandardsPerformanceSummary,
  getReportsStandardsPerformanceSummaryLoader,
  getStandardsPerformanceSummaryRequestAction,
  getReportsStandardsPerformanceSummaryError,
} from './ducks'
import dropDownData from './static/json/dropDownData.json'
import {
  getMasteryLevel,
  getMasteryLevelOptions,
  getMaxMasteryScore,
  getOverallMasteryScore,
  getParsedData,
} from './utils/transformers'

const { compareByData, analyseByData } = dropDownData

const StandardsPerformance = ({
  standardsPerformanceSummary,
  standardsFilters,
  getStandardsPerformanceSummaryRequest,
  isCsvDownloading,
  settings,
  loading,
  error,
  filters,
  ddfilter,
  user,
}) => {
  const userRole = get(user, 'role', '')
  const scaleInfo = get(standardsFilters, 'scaleInfo', [])
  const selectedScale =
    (
      scaleInfo.find((s) => s._id === settings.requestFilters.profileId) ||
      scaleInfo[0]
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
    page: 1,
    pageSize: 10,
  })
  const [selectedDomains, setSelectedDomains] = useState([])

  // function to generate query for standards performance
  const getPerformanceSummaryQuery = () => {
    const { requestFilters = {}, selectedTest } = settings
    const { domainIds, schoolId } = requestFilters
    const modifiedFilters = next(ddfilter, (draft) => {
      Object.keys(draft).forEach((key) => {
        const _keyData =
          typeof draft[key] === 'object' ? draft[key].key : draft[key]
        draft[key] = _keyData?.toLowerCase() === 'all' ? '' : _keyData
      })
    })
    const q = {
      ...requestFilters,
      domainIds: (domainIds || []).join(),
      testIds: selectedTest.map((test) => test.key).join(),
      compareBy: tableFilters.compareBy.key,
      ...modifiedFilters,
      schoolIds: schoolId || modifiedFilters.schoolId,
      page: 1,
      pageSize: pageFilters.pageSize,
    }
    if (userRole === roleuser.SCHOOL_ADMIN) {
      q.schoolIds = q.schoolIds || get(user, 'institutionIds', []).join(',')
    }
    return q
  }

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [settings, tableFilters.compareBy.key, ddfilter])

  useEffect(() => {
    const q = { ...getPerformanceSummaryQuery(), ...pageFilters }
    if (q.termId) {
      getStandardsPerformanceSummaryRequest(q)
    }
  }, [pageFilters])

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
        maxMasteryScore,
        tableFilters,
        selectedDomains,
        res.skillInfo,
        standardsFilters,
        selectedScale
      ),
    [
      res,
      maxMasteryScore,
      standardsFilters,
      selectedDomains,
      tableFilters,
      selectedScale,
    ]
  )

  const tableFiltersOptions = {
    compareByData: compareByDataFiltered,
    analyseByData,
    masteryLevelData,
  }

  if (loading) {
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
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
          filterValues={ddfilter}
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
          filters={filters}
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
    filters: getFiltersSelector(state),
    isCsvDownloading: getCsvDownloadingState(state),
    user: getUser(state),
  }),
  {
    getStandardsPerformanceSummaryRequest: getStandardsPerformanceSummaryRequestAction,
  }
)

export default enhance(StandardsPerformance)
