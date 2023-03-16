import React, { useMemo, useEffect } from 'react'
import { uniqBy, get } from 'lodash'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { StyledTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import {
  getOrderedQuestions,
  getTableData,
  sortByAvgPerformanceAndLabel,
} from '../../utils/transformers'
import { ColoredCell } from '../../../../../common/styled'
import {
  convertQAnalysisTableToCSV,
  getHSLFromRange1,
} from '../../../../../common/util'
import { TooltipText } from './ToolTipText'
import ColumnTitle from './ColumnTitle'
import { compareByEnums, compareByToPluralName } from '../../constants'

const GetCellContents = (props) => {
  const { score } = props
  const bgColor = getHSLFromRange1(score)
  return (
    <ColoredCell bgColor={bgColor}>
      {!Number.isNaN(score) ? `${score}%` : '0%'}
    </ColoredCell>
  )
}

const getTableColumns = (
  qSummary,
  compareBy,
  filter = {},
  visibleIndices,
  sortKey,
  questionLinkData
) => {
  const uniqQuestionMetrics = uniqBy(qSummary, 'questionId')?.map((item) => {
    const { avgPerformance: _avgPerformance, ...rest } = item
    const avgPerformance = !Number.isNaN(_avgPerformance)
      ? Math.round(_avgPerformance)
      : 0
    return {
      ...rest,
      avgPerformance,
    }
  })
  const qLabelsToFilter = Object.keys(filter)
  const orderedQuestions = sortByAvgPerformanceAndLabel(
    getOrderedQuestions(uniqQuestionMetrics),
    sortKey
  ).filter((question, index) => {
    // filter out selected bars
    if (qLabelsToFilter && qLabelsToFilter.length) {
      return qLabelsToFilter.includes(question.questionLabel)
    }
    // if no bar selected then choose current page items
    return (
      index >= visibleIndices.startIndex && index <= visibleIndices.endIndex
    )
  })
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
      getTableColumns(
        qSummary,
        compareBy,
        filter,
        visibleIndices,
        sortKey,
        questionLinkData
      ),
    [qSummary, compareBy, filter, visibleIndices, sortKey, questionLinkData]
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
      scroll={{ x: '100%', y: '100%' }}
      onChange={() => {
        setSortByDimension((prevState) => !prevState)
      }}
    />
  )
}
