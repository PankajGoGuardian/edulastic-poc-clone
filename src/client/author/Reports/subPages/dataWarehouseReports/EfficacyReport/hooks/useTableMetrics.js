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
      onSelect: ({ studentId }) => {
        return setCheckedStudents(
          checkedStudents.includes(studentId)
            ? checkedStudents.filter((i) => i !== studentId)
            : [...checkedStudents, studentId]
        )
      },
      onSelectAll: (flag) =>
        setCheckedStudents(flag ? tableData.map((d) => d.studentId) : []),
    }

    const checkedStudentsForModal = tableData
      .filter((d) => checkedStudents.includes(d.studentId))
      .map(({ studentId, firstName, lastName, username }) => ({
        _id: studentId,
        firstName,
        lastName,
        username,
      }))
    return [tableData, rowSelection, checkedStudentsForModal]
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
