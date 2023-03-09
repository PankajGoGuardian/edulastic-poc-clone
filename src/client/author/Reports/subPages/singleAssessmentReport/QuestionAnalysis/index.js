import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Col, Row, Pagination } from 'antd'
import { SpinLoader } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { isEmpty } from 'lodash'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import { StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { SimpleStackedBarWithLineChartContainer } from './componenets/charts/simpleStackedBarWithLineChartContainer'
import {
  StyledCard,
  StyledP,
  TableContainer,
  UpperContainer,
  StyledSwitch,
} from './componenets/styled'
import { QuestionAnalysisTable } from './componenets/table/questionAnalysisTable'

import { getUserRole } from '../../../../../student/Login/ducks'
import { getCsvDownloadingState } from '../../../ducks'
import {
  getQuestionAnalysisRequestAction,
  getReportsQuestionAnalysis,
  getReportsQuestionAnalysisLoader,
  getReportsQuestionAnalysisError,
  resetQuestionAnalysisAction,
} from './ducks'

import { getChartData } from './utils/transformers'

import dropDownData from './static/json/dropDownData.json'
import { getAssessmentName } from '../../../common/util'

const QuestionAnalysis = ({
  loading,
  error,
  isCsvDownloading,
  role,
  questionAnalysis,
  getQuestionAnalysis,
  resetQuestionAnalysis,
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
    userRole === roleuser.TEACHER ? 'group' : 'school'
  )
  const [chartFilter, setChartFilter] = useState({})
  const [pageNo, setpageNo] = useState(1)
  const [horizontalPage, setHorizontalPageNo] = useState({
    startIndex: 0,
    endIndex: 9,
  })
  const [sortBy, setSortBy] = useState('avgPerformance')
  const [sortByDimension, setSortByDimension] = useState(false)

  const assessmentName = getAssessmentName(
    questionAnalysis?.meta?.test || settings.selectedTest
  )

  useEffect(() => () => resetQuestionAnalysis(), [])

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: {
          ...settings.requestFilters,
          ...demographicFilters,
          compareBy,
          sortByDimension: !sortByDimension ? 'asc' : 'desc',
        },
        testId: settings.selectedTest.key,
        pageNo,
      }
      getQuestionAnalysis(q)
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [
    settings.selectedTest?.key,
    settings.requestFilters,
    compareBy,
    pageNo,
    sortByDimension,
  ])

  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(questionAnalysis) &&
      !questionAnalysis.qSummary?.length
    ) {
      toggleFilter(null, true)
    }
  }, [questionAnalysis])

  const chartData = useMemo(
    () => getChartData(questionAnalysis.qSummary, sortBy),
    [questionAnalysis, sortBy]
  )

  const { compareByDropDownData, dropDownKeyToLabel } = dropDownData

  const selectedCompareByOption = useMemo(
    () =>
      compareByDropDownData.find(({ key }) => key === compareBy) ||
      compareByDropDownData[0],
    [compareBy]
  )

  const updateCompareByCB = (event, selected) => {
    setCompareBy(selected.key)
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

  if (loading) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (questionAnalysis.isRecommended) {
    return (
      <NoDataContainer fontSize="12px">
        The Questions for each student have been dynamically selected and as a
        result, question based comparison is unavailable for the assignment.
      </NoDataContainer>
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!questionAnalysis.qSummary?.length || !settings.selectedTest.key) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }
  const handleSort = (checked) => {
    if (checked) {
      return setSortBy('avgPerformance')
    }
    return setSortBy('qLabel')
  }

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
            setHorizontalPageNo={setHorizontalPageNo}
          />
          <StyledP style={{ marginTop: '-30px' }}>
            ITEMS (SORTED BY
            {sortBy === 'avgPerformance' ? 'PERFORMANCE' : 'QUESTION'} IN
            ASCENDING ORDER)
          </StyledP>
        </StyledCard>
      </UpperContainer>
      <TableContainer>
        <StyledCard>
          <Row type="flex" justify="start" className="parent-row">
            <Col className="top-row-container">
              <Row type="flex" justify="space-between" className="top-row">
                <Col>
                  <StyledH3>
                    Detailed Performance Analysis{' '}
                    {userRole !== roleuser.TEACHER
                      ? `By ${dropDownKeyToLabel[compareBy]}`
                      : ''}{' '}
                    | {assessmentName}
                  </StyledH3>
                </Col>
                <Col
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Col
                    style={{
                      marginRight: '50px',
                    }}
                  >
                    <StyledH3
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          marginRight: '10px',
                          fontWeight: 'bold',
                        }}
                      >
                        Sort By (Asc):
                      </span>
                      <StyledSwitch
                        checkedChildren="Performance"
                        unCheckedChildren="Question"
                        checked={sortBy === 'avgPerformance'}
                        onChange={handleSort}
                      />
                    </StyledH3>
                  </Col>
                  <Col data-cy="compareBy" data-testid="compareBy">
                    {userRole !== roleuser.TEACHER ? (
                      <ControlDropDown
                        prefix="Compare by"
                        by={selectedCompareByOption}
                        selectCB={updateCompareByCB}
                        data={compareByDropDownData}
                      />
                    ) : null}
                  </Col>
                </Col>
              </Row>
            </Col>
            <Col className="bottom-table-container">
              <QuestionAnalysisTable
                isCsvDownloading={isCsvDownloading}
                questionAnalysis={questionAnalysis}
                compareBy={compareBy}
                filter={chartFilter}
                role={userRole}
                sortBy={sortBy}
                horizontalPage={horizontalPage}
                setSortByDimension={setSortByDimension}
              />
              <Pagination
                style={{ marginTop: '10px' }}
                onChange={setpageNo}
                current={pageNo}
                pageSize={1}
                total={questionAnalysis?.performanceByDimension?.totalPages}
              />
            </Col>
          </Row>
        </StyledCard>
      </TableContainer>
    </div>
  )
}

const reportPropType = PropTypes.shape({
  qSummary: PropTypes.array,
  performanceByDimension: PropTypes.object,
})

QuestionAnalysis.propTypes = {
  loading: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  questionAnalysis: reportPropType.isRequired,
  getQuestionAnalysis: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
}

export default connect(
  (state) => ({
    loading: getReportsQuestionAnalysisLoader(state),
    error: getReportsQuestionAnalysisError(state),
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    questionAnalysis: getReportsQuestionAnalysis(state),
  }),
  {
    getQuestionAnalysis: getQuestionAnalysisRequestAction,
    resetQuestionAnalysis: resetQuestionAnalysisAction,
  }
)(QuestionAnalysis)
