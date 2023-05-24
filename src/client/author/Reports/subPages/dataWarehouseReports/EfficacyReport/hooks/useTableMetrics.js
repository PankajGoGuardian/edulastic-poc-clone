import { get, isEmpty } from 'lodash'
import { useMemo } from 'react'
import { getTableData } from '../components/Table/utils'

const useTableMetrics = ({
  reportTableData,
  prePerformanceBand,
  postPerformanceBand,
  tableFilters,
  selectedRowKeys,
  onSelectChange,
  checkedStudents,
  setCheckedStudents,
  testInfo,
}) => {
  return useMemo(() => {
    const rowsCount = get(reportTableData, 'rowsCount', 0)
    const tableMetricInfo = get(reportTableData, 'metricInfo', [])
    if (isEmpty(tableMetricInfo)) return []
    const tableData = getTableData(
      tableMetricInfo,
      prePerformanceBand,
      postPerformanceBand,
      tableFilters,
      testInfo
    )
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      onSelect: ({ dimension }) => {
        return setCheckedStudents(
          checkedStudents.includes(dimension._id)
            ? checkedStudents.filter((i) => i !== dimension._id)
            : [...checkedStudents, dimension._id]
        )
      },
      onSelectAll: (flag) =>
        setCheckedStudents(
          flag ? tableData.map(({ dimension }) => dimension._id) : []
        ),
    }

    const checkedStudentsForModal = tableData
      .filter(({ dimension }) => checkedStudents.includes(dimension._id))
      .map(({ dimension }) => dimension)
    return [tableData, rowsCount, rowSelection, checkedStudentsForModal]
  }, [
    reportTableData,
    prePerformanceBand,
    postPerformanceBand,
    tableFilters.compareBy.key,
    tableFilters.preBandScore,
    tableFilters.postBandScore,
    testInfo,
    checkedStudents,
  ])
}

export default useTableMetrics
