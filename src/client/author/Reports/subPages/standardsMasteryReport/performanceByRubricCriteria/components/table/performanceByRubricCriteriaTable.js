import React from 'react'
import next from 'immer'
import { Row, Tooltip } from 'antd'
import TableFilters from '../filters/TableFilters'
import {
  TableContainer,
  CustomStyledTable,
  TableTooltipWrapper,
  AssessmentNameContainer,
  StyledH4,
} from '../styled'
import { StyledH3 } from '../../../../../common/styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'

const tableColumnsData = [
  {
    dataIndex: 'rowName',
    key: 'rowId',
    align: 'left',
    fixed: 'left',
    width: 200,
  },
  {
    dataIndex: 'averageRatingPoints',
    align: 'center',
    fixed: 'left',
    title: 'AVG. RATING',
    width: 150,
  },
  // next up are dynamic columns for each assessment
]

const renderValue = (value, suffix = '', fallback = '-') => {
  if (Number.isNaN(value) || value === null || value === undefined)
    return fallback

  return `${value}${suffix}`
}

const getTableColumns = (
  tableData,
  rubric,
  chartRenderData,
  selectedCompareBy,
  analyseBy
) => {
  return next(tableColumnsData, (_columns) => {
    const showPerc = analyseBy.key === 'score'
    // compareBy column
    const compareByIdx = _columns.findIndex(
      (col) => col.dataIndex === 'rowName'
    )
    _columns[compareByIdx].title = selectedCompareBy.title
    _columns[compareByIdx].render = (data) => data || '-'

    Object.assign(
      _columns.find((col) => col.dataIndex === 'averageRatingPoints'),
      {
        render: (value, record) => {
          return (
            <TableTooltipWrapper>
              <Tooltip
                title={`Avg Score: ${renderValue(
                  record.averageRatingPoints
                )}/${renderValue(record.maxRubricPoints)} (${renderValue(
                  record.averageRatingPercPoints,
                  '%'
                )})`}
                getPopupContainer={(triggerNode) => triggerNode}
              >
                <Row type="flex" justify="center">
                  <div>
                    {renderValue(
                      showPerc ? record.averageRatingPercPoints : value,
                      showPerc ? '%' : ''
                    )}
                  </div>
                </Row>
              </Tooltip>
            </TableTooltipWrapper>
          )
        },
      }
    )

    const criteriaColumns = rubric.criteria.map((criteria) => {
      const chartData = chartRenderData.find(
        (c) => c.criteriaId === criteria.id
      )
      return {
        key: criteria.id,
        title: (
          <AssessmentNameContainer>
            <Tooltip title={criteria.name}>
              <div className="test-name-container">{criteria.name}</div>
            </Tooltip>
            <div>
              <StyledH4>
                {renderValue(
                  showPerc
                    ? chartData.scorePercentagePerCriteria
                    : chartData.avgScorePerCriteria,
                  showPerc ? '%' : ''
                )}
              </StyledH4>
            </div>
          </AssessmentNameContainer>
        ),
        align: 'center',
        dataIndex: criteria.id,
        visibleOn: ['browser', 'csv'],
        render: (value) => {
          const valueToShow = renderValue(
            showPerc ? value.avgScorePercentage : value.avgScore,
            showPerc ? '%' : ''
          )
          return (
            <TableTooltipWrapper>
              <Tooltip
                title={`Avg Score: ${renderValue(value.avgScore)}/${renderValue(
                  value.maxScore
                )} (${renderValue(value.avgScorePercentage, '%')})`}
                getPopupContainer={(triggerNode) => triggerNode}
              >
                <Row type="flex" justify="center">
                  <div>{valueToShow}</div>
                </Row>
              </Tooltip>
            </TableTooltipWrapper>
          )
        },
      }
    })
    _columns.push(...criteriaColumns)
  })
}

const PerformanceByRubricCriteriaTable = ({
  tableData,
  selectedTableFilters,
  setTableFilters,
  tableFilterOptions,
  rubric,
  chartRenderData,
  onCsvConvert,
  isCsvDownloading,
}) => {
  const tableColumns = getTableColumns(
    tableData,
    rubric,
    chartRenderData,
    selectedTableFilters.compareBy,
    selectedTableFilters.analyseBy
  )
  return (
    <>
      <Row type="flex" justify="space-between">
        <StyledH3>
          Rubric Scores by {selectedTableFilters.compareBy.title} in{' '}
          {rubric.name}
        </StyledH3>
        <TableFilters
          setTableFilters={setTableFilters}
          compareByOptions={tableFilterOptions.compareByData}
          analyseByOptions={tableFilterOptions.analyseByData}
          selectedTableFilters={selectedTableFilters}
        />
      </Row>
      <TableContainer>
        <CsvTable
          dataSource={tableData}
          columns={tableColumns}
          tableToRender={CustomStyledTable}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
        />
      </TableContainer>
    </>
  )
}

export default PerformanceByRubricCriteriaTable
