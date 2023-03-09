import React, { useMemo, useEffect } from 'react'
import { uniqBy } from 'lodash'
import { Row, Col } from 'antd'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { StyledTable, QLabelSpan } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import Tags from '../../../../../../src/components/common/Tags'
import {
  compareByToPluralName,
  comparedByToToolTipLabel,
  getOrderedQuestions,
  getTableData,
  sortByAvgPerformanceAndLabel,
} from '../../utils/transformers'
import { ColoredCell } from '../../../../../common/styled'
import {
  convertQAnalysisTableToCSV,
  getHSLFromRange1,
} from '../../../../../common/util'

const tooltipText = (compareByType, record, { questionId, questionLabel }) => {
  return (
    <div>
      <Row type="flex" justify="center">
        <Col className="custom-table-tooltip-value">{questionLabel}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].name}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">
          {record[compareByType]}
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].type}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">
          {record.scorePercentByQId?.[questionId]}%
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].all}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">
          {record.averageScoreByQId?.[questionId]}%
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">District (% Score):</Col>
        <Col className="custom-table-tooltip-value">
          {record.districtAverage?.[questionId]}%
        </Col>
      </Row>
    </div>
  )
}

const getCellContents = (props) => {
  const { score } = props
  const bgColor = getHSLFromRange1(score)
  return <ColoredCell bgColor={bgColor}>{`${score}%`}</ColoredCell>
}

const getTableColumns = (
  qSummary,
  compareBy,
  filter = {},
  horizontalPage,
  sortBy
) => {
  const uniqQuestionMetrics = uniqBy(qSummary, 'questionId')
  const qLabelsToFilter = Object.keys(filter)
  const orderedQuestions = sortByAvgPerformanceAndLabel(
    getOrderedQuestions(uniqQuestionMetrics),
    sortBy
  ).filter((question, index) => {
    // filter out selected bars
    if (qLabelsToFilter && qLabelsToFilter.length) {
      return qLabelsToFilter.includes(question.questionLabel)
    }
    // if no bar selected then choose current page items
    return (
      index >= horizontalPage.startIndex && index <= horizontalPage.endIndex
    )
  })
  const result = orderedQuestions.map((question) => {
    const standards = question.standards || []
    return {
      title: (
        <>
          <QLabelSpan>{question.questionLabel}</QLabelSpan>
          <Tags placement="topRight" tags={standards} show={1} />
          <span>points {question.points}</span>
        </>
      ),
      dataIndex: `averageScoreByQId.${question.questionId}`,
      key: question.questionId,
      children: [
        {
          title: question.districtAvgPerf,
          dataIndex: `averageScoreByQId.${question.questionId}`,
          key: question.questionId,
          render: (text, record) => (
            <CustomTableTooltip
              getCellContents={getCellContents}
              score={text}
              placement="top"
              title={tooltipText(compareBy, record, question)}
            />
          ),
        },
      ],
    }
  })

  const compareColumn = {
    title: compareByToPluralName[compareBy],
    width: 150,
    dataIndex: compareBy,
    sorter: true,
    children: [
      {
        title: 'District Avg.',
        dataIndex: compareBy,
        key: `${compareBy}`,
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
  questionAnalysis,
  horizontalPage,
  sortBy,
  setSortByDimension,
}) => {
  const columns = useMemo(
    () =>
      getTableColumns(
        questionAnalysis.qSummary,
        compareBy,
        filter,
        horizontalPage,
        sortBy
      ),
    [questionAnalysis.qSummary, compareBy, filter, horizontalPage, sortBy]
  )

  const tableData = useMemo(() => getTableData(questionAnalysis, compareBy), [
    questionAnalysis,
    compareBy,
  ])
  const disableDefaultDownload = true

  const onCsvConvert = (data) =>
    downloadCSV(
      `Question Performance Analysis Report by ${compareByToPluralName[compareBy]}.csv`,
      data
    )

  useEffect(() => {
    if (isCsvDownloading && disableDefaultDownload) {
      const { csvText, csvRawData } = convertQAnalysisTableToCSV(
        questionAnalysis.qSummary,
        tableData,
        compareBy,
        filter,
        sortBy
      )
      onCsvConvert(csvText, csvRawData)
    }
  }, [isCsvDownloading])

  return (
    <CsvTable
      data-testid="QuestionAnalysisTable"
      isCsvDownloading={isCsvDownloading}
      tableToRender={StyledTable}
      columns={columns}
      dataSource={tableData}
      onCsvConvert={onCsvConvert}
      rowKey="questionId"
      colorCellStart={2}
      flexWrap="unset"
      scroll={{ y: 300 }}
      disableDefaultDownload={disableDefaultDownload}
      onChange={() => {
        setSortByDimension((prevState) => !prevState)
      }}
    />
  )
}
