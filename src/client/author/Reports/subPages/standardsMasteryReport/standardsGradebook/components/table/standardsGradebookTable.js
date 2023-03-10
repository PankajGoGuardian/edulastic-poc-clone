import React, { useMemo } from 'react'

import { withNamespaces } from '@edulastic/localization'
import { reportUtils } from '@edulastic/constants'

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
  // x-axis scroll length for visible columns
  const scrollX =
    tableColumns.reduce((count, col) => count + (col.visibleOn ? 0 : 1), 0) *
      180 || '100%'

  return (
    <CsvTable
      columns={tableColumns}
      dataSource={tableData}
      rowKey={tableFilters.compareByKey}
      tableToRender={GradebookTable}
      onCsvConvert={onCsvConvert}
      isCsvDownloading={isCsvDownloading}
      scroll={{ x: scrollX }}
    />
  )
}

export default withNamespaces('student')(StandardsGradebookTable)
