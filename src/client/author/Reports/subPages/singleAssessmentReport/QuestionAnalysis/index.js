import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Col from "antd/es/Col";
import Row from "antd/es/Row";
import { SpinLoader } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import { StyledH3, NoDataContainer } from '../../../common/styled'
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
import { getCsvDownloadingState, getTestListSelector } from '../../../ducks'
import {
  getQuestionAnalysisRequestAction,
  getReportsQuestionAnalysis,
  getReportsQuestionAnalysisLoader,
  getReportsQuestionAnalysisError,
} from './ducks'

import { getChartData, getTableData } from './utils/transformers'

import dropDownData from './static/json/dropDownData.json'

const QuestionAnalysis = ({
  loading,
  error,
  isCsvDownloading,
  role,
  questionAnalysis,
  getQuestionAnalysis,
  settings,
  testList,
  sharedReport,
}) => {
  const [userRole, isSharedReport] = useMemo(
    () => [sharedReport?.sharedBy?.role || role, !!sharedReport?._id],
    [sharedReport]
  )
  const [compareBy, setCompareBy] = useState(
    userRole === roleuser.TEACHER ? 'groupId' : 'schoolId'
  )
  const [chartFilter, setChartFilter] = useState({})

  const selectedTest = testList.find(
    (t) => t._id === settings.selectedTest.key
  ) || { _id: '', title: '' }
  const assessmentName = `${
    selectedTest.title
  } (ID:${selectedTest._id.substring(selectedTest._id.length - 5)})`

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: { ...settings.requestFilters },
        testId: settings.selectedTest.key,
      }
      getQuestionAnalysis(q)
    }
  }, [settings])

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
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!questionAnalysis.metricInfo?.length) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
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
                <Col>
                  {userRole !== roleuser.TEACHER ? (
                    <ControlDropDown
                      prefix="Compare by"
                      by={compareByDropDownData[0]}
                      selectCB={updateCompareByCB}
                      data={compareByDropDownData}
                    />
                  ) : null}
                </Col>
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
    testList: getTestListSelector(state),
  }),
  { getQuestionAnalysis: getQuestionAnalysisRequestAction }
)(QuestionAnalysis)
