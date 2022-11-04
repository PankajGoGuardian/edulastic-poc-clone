import React from 'react'
import next from 'immer'
import { Row } from 'antd'
import TableFilters from '../filters/TableFilters'
import { TableContainer, CustomStyledTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'

const tableColumnsData = [
  {
    dataIndex: 'rowName',
    key: 'rowId',
    align: 'left',
    fixed: 'left',
    width: 200,
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

const getTableColumns = (tableData, rubric, chartRenderData) => {
  return next(tableColumnsData, (_columns) => {
    // compareBy column
    // const compareByIdx = _columns.findIndex((col) => col.key === 'compareBy')
    // _columns[compareByIdx].title = compareBy.title
    // _columns[compareByIdx].dataIndex = compareByMap[compareBy.key]
    // _columns[compareByIdx].render = (data) => data || '-'
    // _columns[compareByIdx].sorter = (a, b) => {
    //   const dataIndex = compareByMap[compareBy.key]
    //   return (a[dataIndex] || '')
    //     .toLowerCase()
    //     .localeCompare((b[dataIndex] || '').toLowerCase())
    // }
    // _columns[compareByIdx].defaultSortOrder = 'ascend'

    const criteriaColumns = rubric.criteria.map((criteria) => {
      const chartData = chartRenderData.find(
        (c) => c.criteriaId === criteria.id
      )
      return {
        key: criteria.id,
        title: (
          <div>
            <h4>{rubric.name}</h4>
            <h4>{criteria.name}</h4>
            <h4>{chartData.avgScore}</h4>
          </div>
        ),
        align: 'center',
        dataIndex: criteria.id,
        visibleOn: ['browser'],
        render: (value) => {
          return value ? (
            <Row type="flex" justify="center">
              <p>{criteria.avgScorePercentage}</p>
            </Row>
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
}) => {
  const tableColumns = getTableColumns(tableData, rubric, chartRenderData)
  console.log(tableColumns, tableData)
  return (
    <>
      <TableFilters
        setTableFilters={setTableFilters}
        compareByOptions={tableFilterOptions.compareByData}
        analyseByOptions={tableFilterOptions.analyseByData}
        selectedTableFilters={selectedTableFilters}
      />
      <TableContainer>
        <CsvTable
          dataSource={tableData}
          columns={tableColumns}
          tableToRender={CustomStyledTable}
          onCsvConvert={() => {}}
          isCsvDownloading={() => {}}
        />
      </TableContainer>
    </>
  )
}

export default PerformanceByRubricCriteriaTable
