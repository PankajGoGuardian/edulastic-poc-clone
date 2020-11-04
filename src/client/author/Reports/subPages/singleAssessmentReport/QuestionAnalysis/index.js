import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { getUserRole } from '../../../../../student/Login/ducks'
import { EmptyData } from '../../../common/components/emptyData'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import { StyledH3, NoDataContainer } from '../../../common/styled'
import { getCsvDownloadingState } from '../../../ducks'
import { SimpleStackedBarWithLineChartContainer } from './componenets/charts/simpleStackedBarWithLineChartContainer'
import {
  StyledCard,
  StyledP,
  TableContainer,
  UpperContainer,
} from './componenets/styled'
import { QuestionAnalysisTable } from './componenets/table/questionAnalysisTable'
import {
  getQuestionAnalysisRequestAction,
  getReportsQuestionAnalysis,
  getReportsQuestionAnalysisLoader,
} from './ducks'
import { getTestListSelector } from '../common/filterDataDucks'
import dropDownData from './static/json/dropDownData.json'
import { getChartData, getTableData } from './utils/transformers'

const QuestionAnalysis = ({
  loading,
  isCsvDownloading,
  role,
  questionAnalysis,
  getQuestionAnalysis,
  settings,
  testList,
}) => {
  const [compareBy, setCompareBy] = useState(
    role === 'teacher' ? 'groupId' : 'schoolId'
  )
  const [chartFilter, setChartFilter] = useState({})

  const selectedTest =
    testList.find((t) => t._id === settings.selectedTest.key) || {}
  const assessmentName = selectedTest.title || ''

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {}
      q.testId = settings.selectedTest.key
      q.requestFilters = { ...settings.requestFilters }
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

  if (isEmpty(questionAnalysis) && !loading) {
    return (
      <>
        <EmptyData />
      </>
    )
  }

  if (settings.selectedTest && !settings.selectedTest.key) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }

  return (
    <div>
      {loading ? (
        <SpinLoader position="fixed" />
      ) : (
        <>
          <UpperContainer>
            <StyledCard>
              <StyledH3>
                Question Performance Analysis | {assessmentName}
              </StyledH3>
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
                        {role !== 'teacher'
                          ? `By ${dropDownKeyToLabel[compareBy]}`
                          : ''}{' '}
                        | {assessmentName}
                      </StyledH3>
                    </Col>
                    <Col>
                      {role !== 'teacher' ? (
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
                    role={role}
                    compareByTitle={dropDownKeyToLabel[compareBy]}
                  />
                </Col>
              </Row>
            </StyledCard>
          </TableContainer>
        </>
      )}
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
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    questionAnalysis: getReportsQuestionAnalysis(state),
    testList: getTestListSelector(state),
  }),
  { getQuestionAnalysis: getQuestionAnalysisRequestAction }
)(QuestionAnalysis)
