import React from 'react'
import next from 'immer'
import { Row, Tooltip } from 'antd'

import { reportUtils } from '@edulastic/constants'
import CsvTable from '../../../../common/components/tables/CsvTable'
import {
  StyledTag,
  CustomStyledTable,
  TableContainer,
  AssessmentName,
} from '../../common/styled'
import {
  AssessmentNameContainer,
  StyledSpan,
  TableTooltipWrapper,
} from '../common/styled'
import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
  DashedHr,
  ColorCircle,
  ColorBandRow,
} from '../../../../common/styled'
import LargeTag from '../../common/LargeTag'

import { tableColumnsData, compareByMap } from '../utils'
import IncompleteTestsMessage from '../../../../common/components/IncompleteTestsMessage'

const { formatDate } = reportUtils.common

const CustomTooltip = (props) => (
  <TableTooltipWrapper>
    <Tooltip {...props} />
  </TableTooltipWrapper>
)

const TooltipRowItem = ({ title = '', value = '' }) => (
  <TooltipRow>
    <TooltipRowTitle>{`${title}`}</TooltipRowTitle>
    <TooltipRowValue>{value}</TooltipRowValue>
  </TooltipRow>
)

const ColorBandItem = ({ name, color, highlight }) => {
  let style = {}
  if (highlight) {
    style = { fontSize: '15px', fontWeight: 'bold' }
  }
  return (
    <ColorBandRow>
      <ColorCircle color={color} />
      <TooltipRowValue style={style}>{name}</TooltipRowValue>
    </ColorBandRow>
  )
}

const getTableColumns = (
  overallAssessmentsData,
  isSharedReport,
  settings,
  isPrinting
) => {
  const compareBy = settings.selectedCompareBy
  return next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex((col) => col.key === 'compareBy')
    _columns[compareByIdx].title = compareBy.title
    _columns[compareByIdx].dataIndex = compareByMap[compareBy.key]
    _columns[compareByIdx].render = (data) => data || '-'
    _columns[compareByIdx].sorter = (a, b) => {
      const dataIndex = compareByMap[compareBy.key]
      return (a[dataIndex] || '')
        .toLowerCase()
        .localeCompare((b[dataIndex] || '').toLowerCase())
    }
    _columns[compareByIdx].defaultSortOrder = 'ascend'

    // render rectangular tag for assessment performance
    const assessmentColumns = overallAssessmentsData.flatMap((assessment) => {
      const {
        uniqId,
        testName,
        externalTestType,
        isIncomplete = false,
        averageScore,
      } = assessment
      const _testName = isIncomplete ? `${testName} *` : testName
      return [
        // assessment column to be rendered in browser
        {
          key: uniqId,
          title: (
            <Tooltip title={_testName}>
              <AssessmentNameContainer isPrinting={isPrinting}>
                <div className="test-name-container">
                  <AssessmentName>{_testName}</AssessmentName>
                </div>
                <div>
                  <StyledSpan float="left">
                    {externalTestType ? (
                      <StyledTag color="black">{externalTestType}</StyledTag>
                    ) : null}
                  </StyledSpan>
                  <StyledSpan float="right">
                    {averageScore}
                    {!externalTestType && '%'}
                  </StyledSpan>
                </div>
              </AssessmentNameContainer>
            </Tooltip>
          ),
          align: 'center',
          dataIndex: 'tests',
          visibleOn: ['browser'],
          render: (tests = {}) => {
            const currentTest = tests.find((t) => t.uniqId === uniqId)
            if (currentTest) {
              const tooltipText = (
                <div>
                  <TooltipRowItem
                    title="Date:"
                    value={formatDate(currentTest.assessmentDate)}
                  />
                  <TooltipRowItem
                    title="Students:"
                    value={currentTest.totalStudentCount}
                  />
                  <TooltipRowItem
                    title="Score:"
                    value={
                      currentTest.externalTestType
                        ? currentTest.averageScore
                        : `${currentTest.totalTotalScore}/${currentTest.totalMaxScore}`
                    }
                  />
                  <DashedHr />
                  <ColorBandItem
                    color={currentTest.band.color}
                    name={currentTest.band.name}
                  />
                </div>
              )
              return (
                <Row type="flex" justify="center">
                  <LargeTag
                    CustomTooltip={CustomTooltip}
                    tooltipText={tooltipText}
                    leftText={currentTest.band.name}
                    rightText={
                      currentTest.externalTestType
                        ? currentTest.averageScore
                        : `${currentTest.averageScorePercentage}%`
                    }
                    background={currentTest.band.color}
                  />
                </Row>
              )
            }
            return '-'
          },
        },
        // assessment column to be downloaded in csv
        {
          key: uniqId,
          title: `${_testName} Score(%)`,
          align: 'center',
          dataIndex: 'tests',
          visibleOn: ['csv'],
          render: (tests = {}) => {
            const currentTest = tests.find((t) => t.uniqId === uniqId)
            return currentTest
              ? `${
                  currentTest.externalTestType
                    ? currentTest.averageScore
                    : `${currentTest.averageScorePercentage}%`
                }`
              : '-'
          },
        },
      ]
    })
    const additionalDownloadCsvColumns = overallAssessmentsData.map(
      (assessment) => {
        const { uniqId, testName, isIncomplete = false } = assessment
        const _testName = isIncomplete ? `${testName} *` : testName
        return {
          key: uniqId,
          title: `${_testName} Performance Band`,
          align: 'center',
          dataIndex: 'tests',
          visibleOn: ['csv'],
          render: (tests = {}) => {
            const currentTest = tests.find((t) => t.uniqId === uniqId)
            return currentTest ? `${currentTest.band.name}` : '-'
          },
        }
      }
    )
    // push assessment columns to the original table columns
    _columns.push(...assessmentColumns)
    _columns.push(...additionalDownloadCsvColumns)
  })
}

const getDownloadCsvColumnHeadersFunc = (
  compareBy,
  overallAssessmentsData
) => () => {
  const dowloadCsvTableColumnHeaders = {
    names: [compareBy],
    dates: ['Date'],
    testType: ['Test Type'],
    totalStudents: ['Students'],
    avgScore: ['Avg. Score'],
  }

  const addAdditionalColumns = (assessment) => {
    const {
      assessmentDate,
      totalGraded,
      testType,
      externalTestType,
      averageScore,
    } = assessment
    dowloadCsvTableColumnHeaders.dates.push(formatDate(assessmentDate))
    dowloadCsvTableColumnHeaders.testType.push(testType || externalTestType)
    dowloadCsvTableColumnHeaders.totalStudents.push(`${totalGraded}`)
    dowloadCsvTableColumnHeaders.avgScore.push(
      `${averageScore}${assessment.externalTestType ? '' : '%'}`
    )
  }

  overallAssessmentsData.forEach((assessment) => {
    const { testName, externalTestType, isIncomplete = false } = assessment
    const _testName = isIncomplete ? `${testName} *` : testName
    dowloadCsvTableColumnHeaders.names.push(
      `${_testName}${externalTestType ? ' Score' : ' Score(%)'}`
    )
    addAdditionalColumns(assessment)
  })
  overallAssessmentsData.forEach((assessment) => {
    const { testName, isIncomplete = false } = assessment
    const _testName = isIncomplete ? `${testName} *` : testName
    dowloadCsvTableColumnHeaders.names.push(`${_testName} Performance Band`)
    addAdditionalColumns(assessment)
  })
  return dowloadCsvTableColumnHeaders
}

const AssessmentsTable = ({
  tableData,
  overallAssessmentsData,
  showIncompleteTestsMessage,
  settings,
  onCsvConvert,
  isCsvDownloading,
  isSharedReport,
  isPrinting,
}) => {
  const tableColumns = getTableColumns(
    overallAssessmentsData,
    isSharedReport,
    settings,
    isPrinting
  )
  // show message closer to table if tableData length is greater than 50 (default pagination size)
  const incompleteTestsMessageMargin =
    tableData.length > 50 ? '-40px 0 0 0' : '20px 0 0 0'
  return (
    <TableContainer>
      <CsvTable
        dataSource={tableData}
        columns={tableColumns}
        getColumnHeaders={getDownloadCsvColumnHeadersFunc(
          settings.selectedCompareBy.title,
          overallAssessmentsData
        )}
        tableToRender={CustomStyledTable}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
      />
      <IncompleteTestsMessage
        hasIncompleteTests={showIncompleteTestsMessage}
        incompleteTestsMessageMargin={incompleteTestsMessageMargin}
      />
    </TableContainer>
  )
}

export default AssessmentsTable
