import React from 'react'
import next from 'immer'
import TableFilters from '../filters/TableFilters'
import { TableContainer, CustomStyledTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'

// data: [{
//   rubricId: string
//   criteriaId: string
//   scoreGrouped: {
//     [compareBy_Id]: number
//   }
//   responseCount: number
// }]
// schools: { // or other
//   [compareBy_Id]: string // schoolId: name
// }
const tableColumnsData = [
  {
    dataIndex: 'compareBy',
    key: 'compareBy',
    align: 'left',
    fixed: 'left',
    width: 200,
  },
  {
    title: 'Students',
    key: 'totalStudentCount',
    dataIndex: 'totalStudentCount',
    align: 'center',
    width: 100,
    visibleOn: ['csv'],
  },
  // next up are dynamic columns for each assessment
]

const getTableColumns = (tableData) => {
  return next(tableColumnsData, (_columns) => {
    
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
