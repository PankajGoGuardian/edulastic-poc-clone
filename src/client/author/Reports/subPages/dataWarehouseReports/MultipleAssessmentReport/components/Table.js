import React, { useMemo, useCallback } from 'react'
import next from 'immer'
import { Row, Col, Tooltip } from 'antd'
import { round } from 'lodash'

import { reportUtils } from '@edulastic/constants'
import CsvTable from '../../../../common/components/tables/CsvTable'
import {
  StyledTag,
  CustomStyledTable,
  TableContainer,
  AssessmentName,
} from '../../common/components/styledComponents'
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
import LargeTag from '../../common/components/LargeTag'

import { tableColumnsData, compareByMap, sortKeys } from '../utils'
import IncompleteTestsMessage from '../../../../common/components/IncompleteTestsMessage'
import BackendPagination from '../../../../common/components/BackendPagination'
import LinkCell from '../../common/components/LinkCell'
import { buildDrillDownUrl, compareByKeys } from '../../common/utils'

const { formatDate, TABLE_SORT_ORDER_TYPES } = reportUtils.common

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
  isPrinting,
  sortFilters
) => {
  const compareBy = settings.selectedCompareBy
  const isStudentCompareBy = compareBy.key === compareByKeys.STUDENT
  return next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex(
      (col) => col.key === sortKeys.COMPARE_BY
    )
    _columns[compareByIdx].title = compareBy.title
    _columns[compareByIdx].dataIndex = compareByMap[compareBy.key]
    _columns[compareByIdx].sortOrder =
      sortFilters.sortKey === sortKeys.COMPARE_BY && sortFilters.sortOrder
    _columns[compareByIdx].render = (data, record) => {
      const url = buildDrillDownUrl({
        key: record.id,
        selectedCompareBy: compareBy.key,
        reportFilters: settings.requestFilters,
        reportUrl: window.location.pathname,
      })
      return (
        <LinkCell
          value={{ _id: record.id, name: data }}
          url={url}
          openNewTab={isStudentCompareBy}
        />
      )
    }
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
                    {round(averageScore)}
                    {!externalTestType && '%'}
                  </StyledSpan>
                </div>
              </AssessmentNameContainer>
            </Tooltip>
          ),
          align: 'center',
          dataIndex: 'tests',
          width: 200,
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
  rowsCount,
  sortFilters,
  setSortFilters,
  pageFilters,
  setPageFilters,
  rowSelection,
}) => {
  const tableColumns = useMemo(
    () =>
      getTableColumns(
        overallAssessmentsData,
        isSharedReport,
        settings,
        isPrinting,
        sortFilters
      ),
    [overallAssessmentsData, isSharedReport, settings, isPrinting, sortFilters]
  )

  const handleTableChange = useCallback(
    (_pagination, _filters, sorter) => {
      setSortFilters({
        sortKey: sorter.columnKey,
        sortOrder: sorter.order || TABLE_SORT_ORDER_TYPES.ASCEND,
      })
    },
    [setSortFilters]
  )

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
        onChange={handleTableChange}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        rowSelection={rowSelection}
        scroll={{ x: '100%' }}
        pagination={false}
      />
      <Row type="flex" align="middle">
        <Col span={14}>
          <IncompleteTestsMessage
            hasIncompleteTests={showIncompleteTestsMessage}
            incompleteTestsMessageMargin="20px 0 0 0"
          />
        </Col>
        <Col span={10}>
          <BackendPagination
            itemsCount={rowsCount}
            backendPagination={pageFilters}
            setBackendPagination={setPageFilters}
          />
        </Col>
      </Row>
    </TableContainer>
  )
}

export default AssessmentsTable
