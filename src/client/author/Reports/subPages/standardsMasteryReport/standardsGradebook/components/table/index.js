import React, { useCallback, useMemo } from 'react'

import { withNamespaces } from '@edulastic/localization'
import { reportUtils } from '@edulastic/constants'

import {
  DB_SORT_ORDER_TYPES,
  tableToDBSortOrderMap,
} from '@edulastic/constants/reportUtils/common'
import { GradebookTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'

import { getTableColumnsFE, onCsvConvert } from '../../utils/transformers'

const { getTableData } = reportUtils.standardsGradebook

const StandardsGradebookTable = ({
  t,
  filters,
  scaleInfo,
  summaryMetricInfo,
  detailsMetricInfo,
  isSharedReport,
  isCsvDownloading,
  navigationItems,
  summaryMetricInfoWithSkillInfo,
  tableFilters,
  setTableFilters,
  handleOnClickStandard,
}) => {
  const tableData = useMemo(
    () =>
      getTableData({
        summaryMetricInfo,
        detailsMetricInfo,
        scaleInfo,
      }),
    [summaryMetricInfo, detailsMetricInfo, scaleInfo]
  )
  const pagination = useMemo(
    () => ({
      hideOnSinglePage: true,
      pageSize: tableFilters.pageSize,
    }),
    [tableFilters.pageSize]
  )
  const tableColumns = getTableColumnsFE({
    t,
    filters,
    scaleInfo,
    isSharedReport,
    navigationItems,
    summaryMetricInfoWithSkillInfo,
    tableFilters,
    setTableFilters,
    handleOnClickStandard,
  })
  const xScrollForVisibleColumns =
    tableColumns.reduce((count, col) => count + (col.visibleOn ? 0 : 1), 0) *
      180 || '100%'

  const handleTableChange = useCallback(
    (_pagination, _filters, sorter) => {
      setTableFilters((activeTableFilters) => {
        const curSortKey =
          sorter.columnKey === 'dimension'
            ? activeTableFilters.compareByKey
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
      columns={tableColumns}
      dataSource={tableData}
      onChange={handleTableChange}
      rowKey={tableFilters.compareByKey}
      tableToRender={GradebookTable}
      onCsvConvert={onCsvConvert}
      isCsvDownloading={isCsvDownloading}
      pagination={pagination}
      scroll={{ x: xScrollForVisibleColumns }}
    />
  )
}

export default withNamespaces('student')(StandardsGradebookTable)
