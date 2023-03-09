import React from 'react'

import { withNamespaces } from '@edulastic/localization'

import { GradebookTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { getTableColumns, onCsvConvert } from './utils'

const StandardsGradebookTable = ({
  t,
  tableData,
  tableColumns,
  filters,
  scaleInfo,
  isSharedReport,
  isCsvDownloading,
  navigationItems,
  chartDataWithStandardInfo,
  compareByKey,
  analyseByKey,
  tableFilters,
  setTableFilters,
  handleOnClickStandard,
}) => {
  const columns = getTableColumns({
    t,
    tableColumns,
    filters,
    scaleInfo,
    isSharedReport,
    navigationItems,
    chartDataWithStandardInfo,
    compareByKey,
    analyseByKey,
    tableFilters,
    setTableFilters,
    handleOnClickStandard,
  })
  // x-axis scroll length for visible columns
  const scrollX =
    columns.reduce((count, col) => count + (col.visibleOn ? 0 : 1), 0) * 180 ||
    '100%'

  return (
    <CsvTable
      columns={columns}
      dataSource={tableData}
      rowKey={compareByKey}
      tableToRender={GradebookTable}
      onCsvConvert={onCsvConvert}
      isCsvDownloading={isCsvDownloading}
      scroll={{ x: scrollX }}
    />
  )
}

export default withNamespaces('student')(StandardsGradebookTable)
