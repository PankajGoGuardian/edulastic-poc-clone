import React, { useMemo, useEffect } from 'react'
import { get } from 'lodash'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { reportUtils } from '@edulastic/constants'
import { StyledTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import { ColoredCell } from '../../../../../common/styled'
import { getHSLFromRange1 } from '../../../../../common/util'
import { TooltipText } from './ToolTipText'
import ColumnTitle from './ColumnTitle'
import { compareByEnums } from '../../constants'

const {
  compareByToPluralName,
  getTableData,
  getTableColumns,
  convertQAnalysisTableToCSV,
} = reportUtils.questionAnalysis

const GetCellContents = (props) => {
  const { score } = props
  const bgColor = getHSLFromRange1(score)
  return (
    <ColoredCell bgColor={bgColor}>
      {!Number.isNaN(score) ? `${score}%` : '0%'}
    </ColoredCell>
  )
}

const getTableColumnsWrapper = (
  qSummary,
  compareBy,
  filter = {},
  visibleIndices,
  sortKey,
  questionLinkData,
  sortOrder
) => {
  const orderedQuestions = getTableColumns(
    qSummary,
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
          title: !Number.isNaN(question.districtAvgPerf)
            ? `${Math.round(question.districtAvgPerf)}%`
            : '0%',
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
    sortOrder: sortOrder ? 'ascend' : 'descend',
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
  sortOrder,
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
      getTableColumnsWrapper(
        qSummary,
        compareBy,
        filter,
        visibleIndices,
        sortKey,
        questionLinkData,
        sortOrder
      ),
    [
      qSummary,
      compareBy,
      filter,
      visibleIndices,
      sortKey,
      questionLinkData,
      sortOrder,
    ]
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
      const { csvText } = convertQAnalysisTableToCSV(
        qSummary,
        tableData,
        filter,
        sortKey,
        compareBy
      )
      onCsvConvert(csvText)
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
      onChange={() => {
        setSortByDimension((prevState) => !prevState)
      }}
    />
  )
}
