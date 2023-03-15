import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { SpinLoader } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { SimpleStackedBarWithLineChartContainer } from './componenets/charts/simpleStackedBarWithLineChartContainer'
import {
  StyledCard,
  StyledP,
  BottomRow,
  UpperContainer,
} from './componenets/styled'
import { getUserRole } from '../../../../../student/Login/ducks'
import { getCsvDownloadingState } from '../../../ducks'
import { getChartData } from './utils/transformers'
import { getAssessmentName } from '../../../common/util'
import TableWrapper from './componenets/TableContainer'
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

const QuestionAnalysis = ({
  isCsvDownloading,
  role,
  settings,
  sharedReport,
  toggleFilter,
  demographicFilters,
}) => {
  const [userRole] = useMemo(
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

  const assessmentName = getAssessmentName(
    settings.tagsData?.testId || settings.selectedTest
  )

  const [
    qSummaryData,
    qSummaryLoading,
    qSummaryLoadError,
  ] = useQAnalysisSummaryFetch({
    settings,
    demographicFilters,
    toggleFilter,
    sortOrder,
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
  const qSummary = qSummaryData.metricInfo || []
  const isDynamicTest = qSummaryData.isRecommended

  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !qSummaryLoading &&
      !qSummary?.length
    ) {
      toggleFilter(null, true)
    }
  }, [qSummary, qSummaryLoading, performanceByDimensionLoading])

  const chartData = useMemo(() => getChartData(qSummary, sortKey), [
    qSummary,
    sortKey,
  ])

  const updateCompareByCB = (event, selected) => {
    setCompareBy(selected.key)
    setpageNo(1)
    setSortOrder(false)
    setSortKey(sortByOptions.AVG_PERFORMANCE)
    setVisibleIndices({
      startIndex: 0,
      endIndex: 9,
    })
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

  if (
    (qSummaryLoadError && qSummaryLoadError.dataSizeExceeded) ||
    (performanceLoadError && performanceLoadError.dataSizeExceeded)
  ) {
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
          <StyledH3 data-testid="title">
            Question Performance Analysis | {assessmentName}
          </StyledH3>
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
              sortKey={sortKey}
              handleSort={handleSort}
              updateCompareByCB={updateCompareByCB}
            />
            <TableWrapper
              performanceByDimensionLoading={performanceByDimensionLoading}
              compareBy={compareBy}
              isCsvDownloading={isCsvDownloading}
              chartFilter={chartFilter}
              userRole={userRole}
              sortKey={sortKey}
              visibleIndices={visibleIndices}
              setSortOrder={setSortOrder}
              performanceByDimension={performanceByDimension}
              qSummary={qSummary}
              pageSize={pageSize}
              setpageNo={setpageNo}
              pageNo={pageNo}
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

export default connect((state) => ({
  isCsvDownloading: getCsvDownloadingState(state),
  role: getUserRole(state),
}))(QuestionAnalysis)
