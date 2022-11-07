import React from 'react'
import next from 'immer'
import { Row, Tooltip } from 'antd'
import TableFilters from '../filters/TableFilters'
import {
  TableContainer,
  CustomStyledTable,
  TableTooltipWrapper,
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

const compareByMap = {
  school: 'schoolName',
  teacher: 'teacherName',
  group: 'groupName',
  student: 'studentName',
  race: 'race',
  gender: 'gender',
  ellStatus: 'ellStatus',
  iepStatus: 'iepStatus',
  frlStatus: 'frlStatus',
  standard: 'standard',
  hispanicEthnicity: 'hispanicEthnicity',
}

const getTableColumns = (
  tableData,
  rubric,
  chartRenderData,
  selectedCompareBy,
  analyseBy
) => {
  return next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex(
      (col) => col.dataIndex === 'rowName'
    )
    _columns[compareByIdx].title = selectedCompareBy.title
    _columns[compareByIdx].render = (data) => data || '-'

    Object.assign(
      _columns.find((col) => col.dataIndex === 'averageRatingPoints'),
      {
        render: (value) => (Number.isNaN(value) ? '-' : value ?? '-'),
      }
    )
    _columns[compareByIdx].title = selectedCompareBy.title
    _columns[compareByIdx].render = (data) => data || '-'

    const criteriaColumns = rubric.criteria.map((criteria) => {
      const chartData = chartRenderData.find(
        (c) => c.criteriaId === criteria.id
      )
      return {
        key: criteria.id,
        title: (
          <div>
            <h4>{criteria.name}</h4>
            <h4>
              {analyseBy.key === 'rawScore'
                ? chartData.avgScorePerCriteria
                : `${chartData.scorePercentagePerCriteria}%`}
            </h4>
          </div>
        ),
        align: 'center',
        dataIndex: criteria.id,
        visibleOn: ['browser', 'csv'],
        render: (value) => {
          const valueToShow =
            analyseBy.key === 'score'
              ? `${value.avgScorePercentage}%`
              : value.avgScore
          return value ? (
            <TableTooltipWrapper>
              <Tooltip
                title={`Avg Score: ${value.avgScore}/${value.maxScore} (${value.avgScorePercentage}%)`}
                getPopupContainer={(triggerNode) => triggerNode}
              >
                <Row type="flex" justify="center">
                  <div>
                    {Number.isNaN(valueToShow) ? '-' : valueToShow ?? '-'}
                  </div>
                </Row>
              </Tooltip>
            </TableTooltipWrapper>
          ) : (
            '-'
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
          Rubric Scores by {selectedTableFilters.compareBy.title}
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
