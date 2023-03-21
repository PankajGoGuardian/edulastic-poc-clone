import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { SpinLoader } from '@edulastic/common'
import { report as reportTypes, roleuser } from '@edulastic/constants'
import { isEmpty } from 'lodash'
import { StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { SimpleStackedBarWithLineChartContainer } from './componenets/charts/simpleStackedBarWithLineChartContainer'
import {
  StyledCard,
  StyledP,
  BottomRow,
  UpperContainer,
  StyledDiv,
  StyledSwitch,
  StyledSpan,
  StyledCol,
} from './componenets/styled'
import { getUserRole } from '../../../../../student/Login/ducks'
import {
  getCsvDownloadingState,
  getTestListSelector,
  generateCSVAction,
} from '../../../ducks'
import { getChartData } from './utils/transformers'
import { getAssessmentName } from '../../../common/util'
import TableContainer from './componenets/TableContainer'
import {
  compareByEnums,
  pageSize,
  sortByLabels,
  sortByOptions,
} from './constants'
import TableTitleAndFilter from './componenets/TableTitleAndFilter'
import {
  useQAnalysisDetailsFetch,
  useQAnalysisSummaryFetch,
} from './hooks/useFetch'

//! FIXME Have better null-value handling than using memoized empty value
const EMPTY_ARRAY = []

const QuestionAnalysis = ({
  isCsvDownloading,
  role,
  settings,
  sharedReport,
  toggleFilter,
  demographicFilters,
  testList,
  generateCSV,
}) => {
  const [userRole, isSharedReport] = useMemo(
    () => [sharedReport?.sharedBy?.role || role, !!sharedReport?._id],
    [sharedReport]
  )
  const [compareBy, setCompareBy] = useState(
    userRole === roleuser.TEACHER ? compareByEnums.CLASS : compareByEnums.SCHOOL
  )
  const [chartFilter, setChartFilter] = useState({})
  const [pageNo, setpageNo] = useState(1)
  const [visibleIndices, setVisibleIndices] = useState({
    startIndex: 0,
    endIndex: 9,
  })
  const [sortKey, setSortKey] = useState(sortByOptions.AVG_PERFORMANCE)
  const [sortOrder, setSortOrder] = useState(false)
  const { selectedTest } = settings
  if (testList) {
    const currentTest = testList.find((item) => item._id === selectedTest?.key)
    if (currentTest) {
      const { title } = currentTest
      selectedTest.title = title
    }
  }
  const assessmentName = getAssessmentName(
    settings.tagsData?.testId || selectedTest
  )

  const [
    qSummaryData,
    qSummaryLoading,
    qSummaryLoadError,
  ] = useQAnalysisSummaryFetch({
    settings,
    demographicFilters,
    toggleFilter,
  })
  const [
    performanceByDimension,
    performanceByDimensionLoading,
    performanceLoadError,
  ] = useQAnalysisDetailsFetch({
    settings,
    demographicFilters,
    compareBy,
    sortOrder,
    pageNo,
    pageSize,
  })
  const qSummary = qSummaryData.metricInfo || EMPTY_ARRAY
  const isDynamicTest = qSummaryData.isRecommended

  const dataSizeError =
    (qSummaryLoadError && qSummaryLoadError.dataSizeExceeded) ||
    (performanceLoadError && performanceLoadError.dataSizeExceeded)

  const generateCSVSelectionCriteria = [
    (performanceByDimension?.totalRows || 0) > pageSize,
    dataSizeError,
  ]
  const generateCSVRequired = generateCSVSelectionCriteria.some(Boolean)

  useEffect(() => {
    if (isCsvDownloading && generateCSVRequired) {
      const params = {
        reportType: reportTypes.reportNavType.QUESTION_ANALYSIS,
        reportFilters: {
          ...settings.requestFilters,
          ...demographicFilters,
          visibleIndices,
          compareBy,
          sortKey,
          sortOrder: !sortOrder ? 'asc' : 'desc',
          testId: settings.selectedTest.key,
        },
        reportExtras: {},
      }
      generateCSV(params)
    }
  }, [isCsvDownloading])

  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !qSummaryLoading &&
      !isEmpty(qSummaryData) &&
      !qSummary?.length
    ) {
      toggleFilter(null, true)
    }
  }, [qSummary, qSummaryLoading, performanceByDimensionLoading])

  useEffect(() => {
    if (pageNo !== 1) {
      setpageNo(1)
    }
  }, [settings])

  const chartData = useMemo(() => getChartData(qSummary, sortKey), [
    qSummary,
    sortKey,
  ])

  const updateCompareByCB = (event, selected) => {
    setCompareBy(selected.key)
    setpageNo(1)
    setSortOrder(false)
    setSortKey(sortByOptions.AVG_PERFORMANCE)
  }

  const onBarClickCB = (key) => {
    const _chartFilter = { ...chartFilter }
    if (_chartFilter[key]) {
      delete _chartFilter[key]
    } else {
      _chartFilter[key] = true
    }
    setChartFilter(_chartFilter)
  }

  const onResetClickCB = () => {
    setChartFilter({})
  }

  if (qSummaryLoading) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (isDynamicTest) {
    return (
      <NoDataContainer fontSize="12px">
        The Questions for each student have been dynamically selected and as a
        result, question based comparison is unavailable for the assignment.
      </NoDataContainer>
    )
  }

  if (dataSizeError) {
    return <DataSizeExceeded />
  }

  if ((!qSummary?.length && !qSummaryLoading) || !settings.selectedTest.key) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }
  const handleSort = (checked) =>
    setSortKey(checked ? sortByOptions.Q_LABEL : sortByOptions.AVG_PERFORMANCE)

  return (
    <div>
      <UpperContainer>
        <StyledCard>
          <Row type="flex" justify="space-between" align="middle">
            <StyledH3 data-testid="title" align="middle" margin="0">
              Question Performance Analysis | {assessmentName}
            </StyledH3>
            <StyledCol>
              <StyledDiv fontWeight="600" marginRight="10px" opacity="0.65">
                Sort By (asc.):
              </StyledDiv>
              <StyledDiv>
                <StyledSpan>Performance</StyledSpan>
                <StyledSwitch
                  checked={sortKey === sortByOptions.Q_LABEL}
                  onChange={handleSort}
                />
                <StyledSpan>Question</StyledSpan>
              </StyledDiv>
            </StyledCol>
          </Row>
          <SimpleStackedBarWithLineChartContainer
            chartData={chartData}
            onBarClickCB={onBarClickCB}
            onResetClickCB={onResetClickCB}
            filter={chartFilter}
            setVisibleIndices={setVisibleIndices}
          />
          <StyledP style={{ marginTop: '-30px' }}>
            ITEMS (SORTED BY {sortByLabels[sortKey]} IN ASCENDING ORDER)
          </StyledP>
        </StyledCard>
      </UpperContainer>
      <BottomRow>
        <StyledCard>
          <Row type="flex" justify="start" className="parent-row">
            <TableTitleAndFilter
              userRole={userRole}
              compareBy={compareBy}
              assessmentName={assessmentName}
              updateCompareByCB={updateCompareByCB}
            />
            <TableContainer
              performanceByDimensionLoading={performanceByDimensionLoading}
              compareBy={compareBy}
              isCsvDownloading={generateCSVRequired ? null : isCsvDownloading}
              chartFilter={chartFilter}
              userRole={userRole}
              sortKey={sortKey}
              visibleIndices={visibleIndices}
              setSortOrder={setSortOrder}
              sortOrder={sortOrder}
              performanceByDimension={performanceByDimension}
              qSummary={qSummary}
              pageSize={pageSize}
              setpageNo={setpageNo}
              pageNo={pageNo}
              isSharedReport={isSharedReport}
            />
          </Row>
        </StyledCard>
      </BottomRow>
    </div>
  )
}

QuestionAnalysis.propTypes = {
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
}

export default connect(
  (state) => ({
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    testList: getTestListSelector(state),
  }),
  {
    generateCSV: generateCSVAction,
  }
)(QuestionAnalysis)
