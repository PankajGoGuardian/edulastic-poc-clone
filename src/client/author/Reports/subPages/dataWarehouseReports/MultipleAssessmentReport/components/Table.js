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
  StyledH3,
} from '../../../../common/styled'
import LargeTag from '../../common/LargeTag'

import { tableColumnsData, compareByMap } from '../utils'

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
        averageScorePercentage,
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
                    {externalTestType
                      ? averageScore
                      : `${averageScorePercentage}%`}
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
          title: `${_testName}${
            externalTestType ? ` (${externalTestType})` : ''
          } - ${
            externalTestType ? averageScore : `${averageScorePercentage}%`
          }`,
          align: 'center',
          dataIndex: 'tests',
          visibleOn: ['csv'],
          render: (tests = {}) => {
            const currentTest = tests.find((t) => t.uniqId === uniqId)
            return currentTest
              ? `${currentTest.band.name} - ${
                  currentTest.externalTestType
                    ? currentTest.averageScore
                    : `${currentTest.averageScorePercentage}%`
                }`
              : '-'
          },
        },
      ]
    })
    // push assessment columns to the original table columns
    _columns.push(...assessmentColumns)
  })
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
        tableToRender={CustomStyledTable}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
      />
      {showIncompleteTestsMessage && (
        <StyledH3
          fontSize="10px"
          fontWeight="normal"
          margin={incompleteTestsMessageMargin}
        >
          * Some assignment(s) for this test are still in progress and hence the
          results may not be complete
        </StyledH3>
      )}
    </TableContainer>
  )
}

export default AssessmentsTable
