import React, { useCallback, useMemo } from 'react'
import { reportUtils } from '@edulastic/constants'

import CsvTable from '../../../../../common/components/tables/CsvTable'
import { CustomStyledTable } from '../common/styledComponents'

import { districtAvgDimension, tableFilterTypes } from '../../utils'
import { getTableColumns, onCsvConvert } from './utils'
import { compareByKeys } from '../../../common/utils'

const { DB_SORT_ORDER_TYPES, tableToDBSortOrderMap } = reportUtils.common

const DashboardTable = ({
  tableFilters,
  setTableFilters,
  getTableDrillDownUrl,
  districtAveragesData,
  tableData,
  selectedPerformanceBand,
  isCsvDownloading,
  rowSelection,
  availableTestTypes,
}) => {
  const {
    metricInfo: districtAveragesMetricInfo,
    avgAttendance: districtAvgAttendance,
  } = districtAveragesData

  const { metricInfo: tableMetricInfo = [] } = tableData

  const metricInfo = useMemo(() => {
    const districtAvgRecord = {
      dimension: districtAvgDimension,
      avgAttendance: districtAvgAttendance,
      performance: districtAveragesMetricInfo,
    }
    return [districtAvgRecord, ...tableMetricInfo]
  }, [districtAvgAttendance, districtAveragesMetricInfo, tableMetricInfo])

  const isStudentCompareBy =
    tableFilters[tableFilterTypes.COMPARE_BY].key === compareByKeys.STUDENT

  const tableColumns = getTableColumns({
    metricInfo,
    tableFilters,
    isStudentCompareBy,
    getTableDrillDownUrl,
    selectedPerformanceBand,
    availableTestTypes,
  })

  const handleTableChange = useCallback(
    (_pagination, _filters, sorter) => {
      setTableFilters((activeTableFilters) => {
        const curSortKey =
          sorter.columnKey === 'dimension'
            ? activeTableFilters[tableFilterTypes.COMPARE_BY].key
            : sorter.columnKey
        const curSortOrder =
          tableToDBSortOrderMap[sorter.order] || DB_SORT_ORDER_TYPES.ASCEND
        if (
          activeTableFilters.sortKey === curSortKey &&
          activeTableFilters.sortOrder === curSortOrder
        )
          return activeTableFilters
        return {
          ...activeTableFilters,
          sortKey: curSortKey,
          sortOrder: curSortOrder,
        }
      })
    },
    [setTableFilters]
  )

  return (
    <CsvTable
      dataSource={metricInfo}
      columns={tableColumns}
      tableToRender={CustomStyledTable}
      onChange={handleTableChange}
      onCsvConvert={onCsvConvert}
      rowSelection={rowSelection}
      isCsvDownloading={isCsvDownloading}
      isStudentCompareBy={isStudentCompareBy}
      pagination={false}
    />
  )
}

export default DashboardTable
