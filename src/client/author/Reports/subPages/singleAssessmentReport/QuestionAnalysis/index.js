import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Col, Row } from 'antd'
import { SpinLoader } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { isEmpty } from 'lodash'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import {
  StyledH3,
  NoDataContainer,
  StyledDropDownContainer,
} from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { SimpleStackedBarWithLineChartContainer } from './componenets/charts/simpleStackedBarWithLineChartContainer'
import {
  StyledCard,
  StyledP,
  TableContainer,
  UpperContainer,
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

import { getChartData, getTableData } from './utils/transformers'

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
}) => {
  const [userRole, isSharedReport] = useMemo(
    () => [sharedReport?.sharedBy?.role || role, !!sharedReport?._id],
    [sharedReport]
  )
  const [compareBy, setCompareBy] = useState(
    userRole === roleuser.TEACHER ? 'groupId' : 'schoolId'
  )
  const [chartFilter, setChartFilter] = useState({})

  const assessmentName = getAssessmentName(
    questionAnalysis?.meta?.test || settings.selectedTest
  )

  useEffect(() => () => resetQuestionAnalysis(), [])

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: { ...settings.requestFilters },
        testId: settings.selectedTest.key,
      }
      getQuestionAnalysis(q)
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedTest?.key, settings.requestFilters])

  useEffect(() => {
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(questionAnalysis) &&
      !questionAnalysis.metricInfo?.length
    ) {
      toggleFilter(null, true)
    }
  }, [questionAnalysis])

  const chartData = useMemo(() => getChartData(questionAnalysis.metricInfo), [
    questionAnalysis,
  ])

  const tableData = useMemo(() => getTableData(questionAnalysis), [
    questionAnalysis,
    compareBy,
  ])

  const { compareByDropDownData, dropDownKeyToLabel } = dropDownData

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

  if (!questionAnalysis.metricInfo?.length || !settings.selectedTest.key) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }
  return (
    <div>
      <UpperContainer>
        <StyledCard>
          <StyledH3>Question Performance Analysis | {assessmentName}</StyledH3>
          <SimpleStackedBarWithLineChartContainer
            chartData={chartData}
            onBarClickCB={onBarClickCB}
            onResetClickCB={onResetClickCB}
            filter={chartFilter}
          />
          <StyledP style={{ marginTop: '-30px' }}>
            ITEMS (SORTED BY PERFORMANCE IN ASCENDING ORDER)
          </StyledP>
        </StyledCard>
      </UpperContainer>
      <TableContainer>
        <StyledCard>
          <Row type="flex" justify="start" className="parent-row">
            <Col className="top-row-container">
              <Row
                className="top-row"
                type="flex"
                gutter={[5, 10]}
                justify="start"
              >
                <Col xs={24} sm={12} md={16} lg={18} xl={20}>
                  <StyledH3>
                    Detailed Performance Analysis{' '}
                    {userRole !== roleuser.TEACHER
                      ? `By ${dropDownKeyToLabel[compareBy]}`
                      : ''}{' '}
                    | {assessmentName}
                  </StyledH3>
                </Col>
                {userRole !== roleuser.TEACHER && (
                  <StyledDropDownContainer
                    data-cy="compareBy"
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={4}
                  >
                    <ControlDropDown
                      prefix="Compare by"
                      by={compareByDropDownData[0]}
                      selectCB={updateCompareByCB}
                      data={compareByDropDownData}
                      isPageFilter
                    />
                  </StyledDropDownContainer>
                )}
              </Row>
            </Col>
            <Col className="bottom-table-container">
              <QuestionAnalysisTable
                isCsvDownloading={isCsvDownloading}
                tableData={tableData}
                compareBy={compareBy}
                filter={chartFilter}
                role={userRole}
                compareByTitle={dropDownKeyToLabel[compareBy]}
                isSharedReport={isSharedReport}
              />
            </Col>
          </Row>
        </StyledCard>
      </TableContainer>
    </div>
  )
}

const reportPropType = PropTypes.shape({
  metaInfo: PropTypes.array,
  metricInfo: PropTypes.array,
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
