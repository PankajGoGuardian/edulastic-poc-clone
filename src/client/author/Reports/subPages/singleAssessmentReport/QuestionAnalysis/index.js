import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Col, Row, Pagination } from 'antd'
import { EduIf, SpinLoader } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { reportsApi } from '@edulastic/api'
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
import { getReportsQuestionAnalysisError } from './ducks'

import { compareByToPluralName, getChartData } from './utils/transformers'

import dropDownData from './static/json/dropDownData.json'
import { getAssessmentName } from '../../../common/util'

const QuestionAnalysis = ({
  error,
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
  const [qSummary, setQSummary] = useState([])
  const [performanceByDimension, setPerformanceByDimension] = useState({})
  const [loading, setLoading] = useState({
    qSummary: false,
    performanceByDimension: false,
  })

  const assessmentName = getAssessmentName(settings.selectedTest)

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
      try {
        setLoading({
          qSummary: true,
          performanceByDimension: true,
        })
        reportsApi.fetchQuestionAnalysisSummaryReport(q).then((response) => {
          setQSummary(response || [])
          setLoading((prev) => ({
            ...prev,
            qSummary: false,
          }))
        })
        reportsApi
          .fetchQuestionAnalysisPerformanceReport(q)
          .then((response) => {
            setPerformanceByDimension(response)
            setLoading((prev) => ({
              ...prev,
              performanceByDimension: false,
            }))
          })
      } catch (e) {
        setLoading({
          qSummary: false,
          performanceByDimension: false,
        })
      }
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedTest?.key, settings.requestFilters, sortByDimension])

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: {
          ...settings.requestFilters,
          ...demographicFilters,
          compareBy,
        },
        testId: settings.selectedTest.key,
        pageNo,
      }
      setLoading({
        qSummary: false,
        performanceByDimension: true,
      })
      reportsApi.fetchQuestionAnalysisPerformanceReport(q).then((response) => {
        setPerformanceByDimension(response || {})
        setLoading({
          qSummary: false,
          performanceByDimension: false,
        })
      })
    }
  }, [compareBy, pageNo])

  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading.qSummary &&
      !qSummary?.length
    ) {
      toggleFilter(null, true)
    }
  }, [qSummary])

  const chartData = useMemo(() => getChartData(qSummary, sortBy), [
    qSummary,
    sortBy,
  ])

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
  if (loading.qSummary && loading.performanceByDimension) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }
  // Dynamic test check
  // if (qSummary.isDynamicTest) {
  //   return (
  //     <NoDataContainer fontSize="12px">
  //       The Questions for each student have been dynamically selected and as a
  //       result, question based comparison is unavailable for the assignment.
  //     </NoDataContainer>
  //   )
  // }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!qSummary?.length || !settings.selectedTest.key) {
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
              <EduIf condition={loading.performanceByDimension}>
                <SpinLoader
                  tip={`Loading ${compareByToPluralName[compareBy]} data`}
                />
              </EduIf>
              <EduIf condition={!loading.performanceByDimension}>
                <QuestionAnalysisTable
                  isCsvDownloading={isCsvDownloading}
                  questionAnalysis={{ qSummary, performanceByDimension }}
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
                  total={performanceByDimension?.totalPages}
                />
              </EduIf>
            </Col>
          </Row>
        </StyledCard>
      </TableContainer>
    </div>
  )
}

QuestionAnalysis.propTypes = {
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
}

export default connect((state) => ({
  error: getReportsQuestionAnalysisError(state),
  isCsvDownloading: getCsvDownloadingState(state),
  role: getUserRole(state),
}))(QuestionAnalysis)
