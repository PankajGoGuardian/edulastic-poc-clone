const { produce: next } = require('immer')

const sortKeys = {
  COMPARE_BY: 'compareBy',
}
const tableColumnsData = [
  {
    dataIndex: sortKeys.COMPARE_BY,
    key: sortKeys.COMPARE_BY,
    fixed: 'left',
    width: 250,
  },
]

const tableColumns = [
  {
    title: 'Test Name',
    dataIndex: 'testName',
    key: 'testName',
    sorter: true,
    fixed: 'left',
    width: 250,
  },
  {},
  {
    title: '# Assigned',
    dataIndex: 'assigned',
    key: 'assigned',
    sorter: true,
    align: 'center',
  },
  {
    title: 'Not open',
    dataIndex: 'notOpen',
    key: 'notOpen',
    className: 'absent',
    align: 'center',
  },
  {
    title: 'Absent',
    dataIndex: 'absent',
    key: 'absent',
    className: 'absent',
    align: 'center',
  },
  {
    title: 'Not started',
    dataIndex: 'notStarted',
    key: 'notStarted',
    className: 'absent',
    align: 'center',
  },
  {
    title: 'In progress',
    dataIndex: 'inProgress',
    key: 'inProgress',
    align: 'center',
  },
  {
    title: 'Submitted',
    dataIndex: 'submitted',
    key: 'submitted',
    align: 'center',
  },
  {
    title: 'GRADED',
    dataIndex: 'graded',
    key: 'graded',
    align: 'center',
  },
]

const getTableColumnsBE = (compareBy) => {
  // Adding 2nd column based on compareBy
  const columnByCompareBy = next(tableColumnsData, (_columns) => {
    const compareByIdx = _columns.findIndex(
      (col) => col.key === sortKeys.COMPARE_BY
    )
    _columns[compareByIdx].title = compareBy.title
    _columns[compareByIdx].dataIndex = 'dimensionName'
  })

  tableColumns[1] = columnByCompareBy[0]

  return tableColumns
}

const isAnalyseByPercentage = (analyseBy) => analyseBy === 'percentage'

const getCellValue = (value, total, analyseBy) => {
  const isAnalyseByPercent = isAnalyseByPercentage(analyseBy)
  let totalValue = value || 0
  if (isAnalyseByPercent) {
    totalValue = Math.round((totalValue * 100) / total)
  }
  return `${totalValue || 0}${isAnalyseByPercent ? '%' : ''}`
}

const getTableData = (tableData) => {
  const overAllData = {
    testId: 'overall_tid',
    testName: 'Overall',
    testType: '',
    assigned: tableData?.[0]?.totalAssigned || 0,
    inProgress: tableData?.[0]?.totalInProgress || 0,
    submitted: tableData?.[0]?.totalSubmitted || 0,
    absent: tableData?.[0]?.totalAbsent || 0,
    notStarted: tableData?.[0]?.totalNotStarted || 0,
    notOpen: tableData?.[0]?.totalNotOpen || 0,
    graded: tableData?.[0]?.totalGraded || 0,
    dimensionName: '',
    dimensionId: '',
  }
  return [overAllData, ...tableData]
}

module.exports = {
  getTableColumnsBE,
  getTableData,
  getCellValue,
  isAnalyseByPercentage,
}
