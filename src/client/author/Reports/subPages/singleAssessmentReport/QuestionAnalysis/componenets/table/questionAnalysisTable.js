import { reportUtils } from '@edulastic/constants'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { get } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { ColoredCell } from '../../../../../common/styled'
import { getHSLFromRange1 } from '../../../../../common/util'
import { compareByEnums } from '../../constants'
import { StyledTable } from '../styled'
import ColumnTitle from './ColumnTitle'
import { TooltipText } from './ToolTipText'

const {
  getTableData,
  getTableColumns,
  convertQAnalysisTableToCSV,
  compareByToPluralName,
} = reportUtils.questionAnalysis

const GetCellContents = (props) => {
  const { score } = props
  const bgColor = getHSLFromRange1(score)
  return (
    <ColoredCell bgColor={bgColor}>{score ? `${score}%` : '-'}</ColoredCell>
  )
}

const getTableColumnsWraper = (
  qSummary,
  compareBy,
  filter = {},
  visibleIndices,
  sortKey,
  questionLinkData
) => {
  const orderedQuestions = getTableColumns(
    qSummary,
    compareBy,
    filter,
    visibleIndices,
    sortKey
  )
  const result = orderedQuestions.map((question) => {
    return {
      title: (
        <ColumnTitle question={question} questionLinkData={questionLinkData} />
      ),
      dataIndex: `scorePercentByQId.${question.questionId}`,
      key: question.questionId,
      children: [
        {
          title: Math.round(question.districtAvgPerf),
          dataIndex: `scorePercentByQId.${question.questionId}`,
          key: question.questionId,
          render: (text, record) => (
            <CustomTableTooltip
              getCellContents={GetCellContents}
              score={text}
              placement="top"
              title={TooltipText(compareBy, record, question)}
            />
          ),
        },
      ],
    }
  })

  const compareColumn = {
    title: compareByToPluralName[compareBy],
    width: 150,
    dataIndex: 'dimension',
    sorter: true,
    children: [
      {
        title: 'District Avg.',
        dataIndex: 'dimension',
        key: `dimension`,
      },
    ],
  }

  if (result && result.length) {
    return [compareColumn, ...result]
  }
  return [compareColumn]
}

export const QuestionAnalysisTable = ({
  compareBy,
  filter,
  isCsvDownloading,
  qSummary,
  performanceByDimension,
  visibleIndices,
  sortKey,
  setSortByDimension,
  isSharedReport,
}) => {
  const groupId = get(performanceByDimension, 'details.0.dimensionId', '') // only for group details dimensionId will be groupId others are handled with showLink variable
  const assignmentId = get(performanceByDimension, 'details.0.assignmentId', '')
  const compareByClass = compareBy === compareByEnums.CLASS
  const questionLinkData = {
    groupId,
    assignmentId,
    isQuetionLinkEnabled: !isSharedReport && compareByClass,
  }

  const columns = useMemo(
    () =>
      getTableColumnsWraper(
        qSummary,
        compareBy,
        filter,
        visibleIndices,
        sortKey,
        questionLinkData
      ),
    [qSummary, compareBy, filter, visibleIndices, sortKey]
  )
  const tableData = useMemo(
    () => getTableData(qSummary, performanceByDimension, 'dimensionId'),
    [qSummary, performanceByDimension]
  )

  const onCsvConvert = (data) =>
    downloadCSV(
      `Question Performance Analysis Report by ${compareByToPluralName[compareBy]}.csv`,
      data
    )

  useEffect(() => {
    if (isCsvDownloading) {
      const { csvText, csvRawData } = convertQAnalysisTableToCSV(
        qSummary,
        tableData,
        compareBy,
        filter,
        sortKey
      )
      onCsvConvert(csvText, csvRawData)
    }
  }, [isCsvDownloading])

  return (
    <CsvTable
      data-testid="QuestionAnalysisTable"
      isCsvDownloading={false}
      tableToRender={StyledTable}
      columns={columns}
      dataSource={tableData}
      onCsvConvert={onCsvConvert}
      rowKey="questionId"
      colorCellStart={2}
      flexWrap="unset"
      scroll={{ y: 300 }}
      onChange={() => {
        setSortByDimension((prevState) => !prevState)
      }}
    />
  )
}
