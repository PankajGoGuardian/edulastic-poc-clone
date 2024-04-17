import { SpinLoader, EduIf, EduThen, EduElse } from '@edulastic/common'
import { Col, Row } from 'antd'
import next from 'immer'
import qs from 'qs'
import { capitalize, find, indexOf, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'

import { report as reportTypes, reportUtils } from '@edulastic/constants'

import { tableToDBSortOrderMap } from '@edulastic/constants/reportUtils/common'
import { Link } from 'react-router-dom'
import { getUserRole } from '../../../../src/selectors/user'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import {
  StyledCard,
  StyledDropDownContainer,
  StyledH3,
  StyledSignedBarContainer,
  NoDataContainer,
} from '../../../common/styled'
import { getCsvDownloadingState, generateCSVAction } from '../../../ducks'
import { setStandardMasteryProfileAction } from '../common/filterDataDucks'
import CardHeader, {
  CardDropdownWrapper,
  CardTitle,
} from './common/CardHeader/CardHeader'
import SignedStackedBarChartContainer from './components/charts/SignedStackedBarChartContainer'
import SimpleStackedBarChartContainer from './components/charts/SimpleStackedBarChartContainer'
import PerformanceAnalysisTable from './components/table/performanceAnalysisTable'
import dropDownFormat from './static/json/dropDownFormat.json'
import { getAssessmentName } from '../../../common/util'

import {
  usePerformanceByStandardDetailsFetch,
  usePerformanceByStandardSummaryFetch,
} from './hooks/useFetch'
import NoDataNotification from '../../../../../common/components/NoDataNotification'
import BackendPagination from '../../../common/components/BackendPagination'

const {
  viewByMode,
  sortKeysMap,
  analyzeByMode,
  compareByMode,
  compareByModeToName,
  getReportWithFilteredSkills,
} = reportUtils.performanceByStandards

const PAGE_SIZE = 200

const findCompareByTitle = (key = '') => {
  if (!key) return ''

  const { title = '' } =
    find(dropDownFormat.compareByDropDownData, (item) => item.key === key) || {}

  return title
}

const PerformanceByStandards = ({
  settings,
  demographicFilters,
  role,
  isCsvDownloading,
  location,
  pageTitle,
  sharedReport,
  setStandardMasteryProfile,
  toggleFilter,
  generateCSV,
  setAdditionalUrlParams,
}) => {
  const urlSearch = qs.parse(location.search, {
    ignoreQueryPrefix: true,
    indices: true,
  })
  const userRole = useMemo(() => sharedReport?.sharedBy?.role || role, [
    sharedReport,
  ])

  const { selectedTest, requestFilters } = settings
  const [viewOrAnalzeByState, setViewOrAnalzeByState] = useState({
    viewBy: urlSearch.viewBy || viewByMode.STANDARDS,
    analyzeBy: urlSearch.analyzeBy || analyzeByMode.SCORE,
    isViewOrAnalyzeByChanged: false,
  })
  const [compareBy, setCompareBy] = useState(
    urlSearch.compareBy
      ? urlSearch?.compareBy
      : userRole === 'teacher'
      ? compareByMode.STUDENT
      : compareByMode.SCHOOL
  )
  const [curriculumId, setCurriculumId] = useState('')
  const [selectedStandards, setSelectedStandards] = useState([])
  const [selectedDomains, setSelectedDomains] = useState([])
  const [pageFilters, setPageFilters] = useState({
    page: Number(urlSearch.page) || 1,
    pageSize: PAGE_SIZE,
  })
  const [sortOrder, setSortOrder] = useState(urlSearch.sortOrder || undefined)
  const [sortKey, setSortKey] = useState(
    urlSearch.sortKey || sortKeysMap.overall
  )

  const { viewBy, analyzeBy, isViewOrAnalyzeByChanged } = viewOrAnalzeByState

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      page: 1,
    }))
  }, [demographicFilters, settings])
  const [
    details,
    detailsLoading,
    detailsError,
  ] = usePerformanceByStandardDetailsFetch({
    ...pageFilters,
    demographicFilters,
    settings,
    compareBy,
    sortKey,
    sortOrder,
    viewBy,
    analyzeBy,
    setViewOrAnalzeByState,
  })

  const [
    summary,
    summaryLoading,
    summaryError,
  ] = usePerformanceByStandardSummaryFetch({
    demographicFilters,
    settings,
    toggleFilter,
  })
  const { totalRows, hasMultiplePages } = details
  const report = useMemo(() => {
    return { ...summary, ...details }
  }, [details, summary])

  const isViewByStandards = viewBy === viewByMode.STANDARDS

  const assessmentName = getAssessmentName(details?.meta?.test || selectedTest)

  const reportWithFilteredSkills = useMemo(
    () => getReportWithFilteredSkills(report, curriculumId),
    [summary, details, curriculumId]
  )

  const standardsDropdownData = useMemo(() => {
    const { standardsMap = {} } = reportWithFilteredSkills
    const standardsMapArr = Object.keys(standardsMap).map((item) => ({
      key: +item,
      title: standardsMap[item],
    }))
    return standardsMapArr || []
  }, [reportWithFilteredSkills])

  const filteredDropDownData = dropDownFormat.compareByDropDownData.filter(
    (o) => {
      if (o.allowedRoles) {
        return o.allowedRoles.includes(userRole)
      }
      return true
    }
  )

  const generateCSVRequired = useMemo(
    () => [(totalRows || 0) > PAGE_SIZE].some(Boolean),
    [totalRows]
  )

  const setSelectedData = ({ defaultCurriculumId }) => {
    const _defaultCurriculumId =
      standardsDropdownData.find((s) => `${s.key}` === `${defaultCurriculumId}`)
        ?.key ||
      standardsDropdownData?.[0]?.key ||
      ''
    setCurriculumId(_defaultCurriculumId)
    setSelectedStandards([])
    setSelectedDomains([])
  }

  useEffect(() => {
    setStandardMasteryProfile(summary?.scaleInfo || {})
    setSelectedData(reportWithFilteredSkills)
    if (
      [
        [requestFilters.termId, requestFilters.reportId].some(Boolean),
        ![summaryLoading, detailsLoading].every(Boolean),
        !isEmpty(report),
        !report?.performanceSummaryStats?.length,
        !report?.metricInfo?.length,
      ].every(Boolean)
    ) {
      toggleFilter(null, true)
    }
  }, [report])

  const handleResetSelection = () => {
    setSelectedData(report)
  }

  const handleToggleSelectedData = (item) => {
    const dataField = isViewByStandards ? 'standardId' : 'domainId'
    const stateHandler = isViewByStandards
      ? setSelectedStandards
      : setSelectedDomains

    stateHandler((prevState) => {
      const newState = next(prevState, (draftState) => {
        const index = indexOf(prevState, item[dataField])
        if (index > -1) {
          draftState.splice(index, 1)
        } else {
          draftState.push(item[dataField])
        }
      })

      return newState
    })
  }

  useEffect(() => {
    if (
      [
        [isCsvDownloading, generateCSVRequired].every(Boolean),
        [selectedTest, selectedTest.key].every(Boolean),
      ].every(Boolean)
    ) {
      const params = {
        reportType: reportTypes.reportNavType.PERFORMANCE_BY_STANDARDS,
        reportFilters: {
          ...requestFilters,
          compareBy,
          analyzeBy,
          sortKey,
          sortOrder: tableToDBSortOrderMap[sortOrder],
          ...demographicFilters,
          testId: selectedTest.key,
          viewBy,
          curriculumId,
          selectedStandards,
          selectedDomains,
        },
      }
      generateCSV(params)
    }
  }, [isCsvDownloading])

  const handleViewByChange = (event, selected) => {
    setPageFilters({ ...pageFilters, page: 1 })
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      viewBy: selected.key,
      page: 1,
    }))
    setViewOrAnalzeByState((prevState) => {
      const isViewByChanged = selected.key !== prevState.viewBy
      return {
        ...prevState,
        viewBy: selected.key,
        isViewOrAnalyzeByChanged: isViewByChanged,
      }
    })
  }

  const handleAnalyzeByChange = (event, selected) => {
    setPageFilters({ ...pageFilters, page: 1 })
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      analyzeBy: selected.key,
      page: 1,
    }))
    setViewOrAnalzeByState((prevState) => {
      const isAnalyzeByChanged = selected.key !== prevState.analyzeBy
      return {
        ...prevState,
        analyzeBy: selected.key,
        isViewOrAnalyzeByChanged: isAnalyzeByChanged,
      }
    })
  }

  const handleCompareByChange = (event, selected) => {
    setPageFilters({ ...pageFilters, page: 1 })
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      compareBy: selected.key,
      page: 1,
    }))
    setCompareBy(selected.key)
  }

  const handleCurriculumIdChange = (selected) => {
    setCurriculumId(selected.key)
  }
  const onSetSortKey = (value) => {
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      sortKey: value,
    }))
    setSortKey(value)
  }
  const onSetSortOrder = (value) => {
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      sortOrder: value,
    }))
    setSortOrder(value)
  }
  const onSetPage = (value) => {
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      page: value,
    }))
    setPageFilters({ ...pageFilters, page: 1 })
  }

  const selectedCurriculumId = standardsDropdownData.find(
    (s) => `${s.key}` === `${curriculumId}`
  )

  const selectedItems = isViewByStandards ? selectedStandards : selectedDomains

  const BarToRender =
    analyzeBy === analyzeByMode.SCORE || analyzeBy === analyzeByMode.RAW_SCORE
      ? SimpleStackedBarChartContainer
      : SignedStackedBarChartContainer

  const noDatacondition =
    !summary.performanceSummaryStats?.length || detailsError || summaryError

  const noStandardsInTest = !summary?.performanceSummaryStats?.find(
    (stat) => stat.standardId != 0
  )

  const isTableLoading = isViewOrAnalyzeByChanged || detailsLoading

  const noMatchingStandardsCondition =
    summary.standardsMap &&
    !Object.keys(summary.standardsMap).length &&
    summary.performanceSummaryStats?.length

  return (
    <>
      <EduIf condition={!summaryLoading}>
        <EduThen>
          <EduIf condition={!noDatacondition && !noStandardsInTest}>
            <EduThen>
              <EduIf condition={!noMatchingStandardsCondition}>
                <EduThen>
                  <StyledCard>
                    <Row type="flex" justify="start">
                      <Col xs={24} sm={24} md={12} lg={8} xl={12}>
                        <StyledH3>
                          Performance by {capitalize(`${viewBy}s`)} |{' '}
                          {assessmentName}
                        </StyledH3>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={16} xl={12}>
                        <Row type="flex" justify="end" gutter={[5, 10]}>
                          <StyledDropDownContainer
                            data-cy="viewBy"
                            xs={24}
                            sm={24}
                            md={8}
                            lg={8}
                            xl={8}
                          >
                            <ControlDropDown
                              prefix="View by"
                              by={viewBy}
                              selectCB={handleViewByChange}
                              data={dropDownFormat.viewByDropDownData}
                            />
                          </StyledDropDownContainer>
                          <StyledDropDownContainer
                            data-cy="analyzeBy"
                            xs={24}
                            sm={24}
                            md={7}
                            lg={7}
                            xl={7}
                          >
                            <ControlDropDown
                              prefix="Analyze by"
                              by={analyzeBy}
                              selectCB={handleAnalyzeByChange}
                              data={dropDownFormat.analyzeByDropDownData}
                            />
                          </StyledDropDownContainer>
                          <StyledDropDownContainer
                            data-cy="standardSet"
                            xs={24}
                            sm={24}
                            md={7}
                            lg={7}
                            xl={7}
                          >
                            <ControlDropDown
                              prefix="Standard Set"
                              by={
                                selectedCurriculumId || { key: '', title: '' }
                              }
                              selectCB={handleCurriculumIdChange}
                              data={standardsDropdownData}
                              showPrefixOnSelected={false}
                            />
                          </StyledDropDownContainer>
                        </Row>
                      </Col>
                    </Row>
                    <StyledSignedBarContainer>
                      <BarToRender
                        report={reportWithFilteredSkills}
                        viewBy={viewBy}
                        analyzeBy={analyzeBy}
                        onBarClick={handleToggleSelectedData}
                        selectedData={selectedItems}
                        onResetClick={handleResetSelection}
                      />
                    </StyledSignedBarContainer>
                  </StyledCard>
                  <StyledCard style={{ marginTop: '20px' }}>
                    <CardHeader>
                      <CardTitle>
                        {capitalize(viewBy)} Performance Analysis by{' '}
                        {findCompareByTitle(compareBy)} | {assessmentName}
                      </CardTitle>
                      <CardDropdownWrapper data-cy="compareBy">
                        <ControlDropDown
                          prefix="Compare by"
                          by={compareBy}
                          selectCB={handleCompareByChange}
                          data={filteredDropDownData}
                        />
                      </CardDropdownWrapper>
                    </CardHeader>
                    <EduIf condition={!isTableLoading}>
                      <EduThen>
                        <PerformanceAnalysisTable
                          report={reportWithFilteredSkills}
                          viewBy={viewBy}
                          analyzeBy={analyzeBy}
                          compareBy={compareBy}
                          selectedStandards={selectedStandards}
                          selectedDomains={selectedDomains}
                          isCsvDownloading={
                            generateCSVRequired ? null : isCsvDownloading
                          }
                          location={location}
                          pageTitle={pageTitle}
                          sortKey={sortKey}
                          setSortKey={onSetSortKey}
                          sortOrder={sortOrder}
                          setSortOrder={onSetSortOrder}
                          setPageNo={onSetPage}
                        />
                        <BackendPagination
                          itemsCount={totalRows}
                          backendPagination={pageFilters}
                          setBackendPagination={setPageFilters}
                          hasMultiplePages={hasMultiplePages}
                        />
                      </EduThen>
                      <EduElse>
                        <SpinLoader
                          tip={`Loading ${compareByModeToName[compareBy]} data, it may take a while...`}
                        />
                      </EduElse>
                    </EduIf>
                  </StyledCard>
                </EduThen>
                <EduElse>
                  <NoDataNotification
                    heading="Test standards do not match your Standard Set. Details below.  "
                    description={
                      <>
                        Please visit{' '}
                        <Link to="/author/profile">My Profile</Link> and add the
                        relevant standard set for this test to your Interested
                        Standards.
                      </>
                    }
                    style={{
                      width: '750px',
                    }}
                  />
                </EduElse>
              </EduIf>
            </EduThen>
            <EduElse>
              <EduIf condition={noDatacondition}>
                <EduThen>
                  <NoDataContainer>
                    {requestFilters?.termId
                      ? 'No data available currently.'
                      : ''}
                  </NoDataContainer>
                </EduThen>
                <EduElse>
                  <NoDataNotification
                    heading="Report requires test items to be tagged to standards."
                    description="Please add standards to the test items and regrade the test to view
                    standard-wise performance."
                    style={{ width: '600px' }}
                  />
                </EduElse>
              </EduIf>
            </EduElse>
          </EduIf>
        </EduThen>
        <EduElse>
          <SpinLoader
            tip="Please wait while we gather the required information..."
            position="fixed"
          />
        </EduElse>
      </EduIf>
    </>
  )
}

PerformanceByStandards.propTypes = {
  settings: PropTypes.object.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
}

const enhance = connect(
  (state) => ({
    role: getUserRole(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    setStandardMasteryProfile: setStandardMasteryProfileAction,
    generateCSV: generateCSVAction,
  }
)

export default enhance(PerformanceByStandards)
