import React from 'react'
import next from 'immer'
import TableFilters from '../filters/TableFilters'
import { TableContainer, CustomStyledTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'

const tableColumnsData = [
  {
    dataIndex: 'compareBy',
    key: 'compareBy',
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

const getTableColumns = (tableData, selectedTableFilters) => {
  const compareBy = selectedTableFilters.compareBy
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
  })
}

const PerformanceByRubricCriteriaTable = ({
  tableData,
  selectedTableFilters,
  setTableFilters,
  tableFilterOptions,
}) => {
  const tableColumns = getTableColumns(tableData)
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
