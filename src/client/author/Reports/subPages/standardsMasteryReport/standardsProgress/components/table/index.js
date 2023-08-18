import React, { useMemo } from 'react'

import { Row, Col } from 'antd'

import { reportUtils } from '@edulastic/constants'

import BackendPagination from '../../../../../common/components/BackendPagination'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { GradebookTable as StyledTable } from '../../../standardsGradebook/components/styled'
import TableFilters from './TableFilters'

import { getTableColumnsFE } from '../../utils/transformers'
import TableHeader from './TableHeader'

const { downloadCSV } = reportUtils.common
const { SortKeys, SortOrders } = reportUtils.standardsProgress

const onCsvConvert = (data) =>
  downloadCSV(`Standard Mastery Over Time.csv`, data)

const StandardsProgressTable = ({
  chartMetrics,
  tableMetrics,
  masteryScale,
  tableFiltersDropDownData,
  tableFilters,
  setTableFilters,
  isCsvDownloading,
  backendPagination,
  setBackendPagination,
  filters,
  isSharedReport,
}) => {
  const tableColumns = getTableColumnsFE(
    chartMetrics,
    masteryScale,
    tableFilters,
    filters,
    isSharedReport
  )

  const scrollX = useMemo(() => chartMetrics.length * 160 || '100%', [
    chartMetrics.length,
  ])

  return (
    <>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={12} lg={12} xl={16}>
          <TableHeader tableFilters={tableFilters} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <TableFilters
            tableFiltersDropDownData={tableFiltersDropDownData}
            tableFilters={tableFilters}
            setTableFilters={setTableFilters}
          />
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col span={24}>
          <CsvTable
            dataSource={tableMetrics}
            columns={tableColumns}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            tableToRender={StyledTable}
            scroll={{ x: scrollX }}
            onChange={(_, __, column) => {
              setTableFilters({
                ...tableFilters,
                sortKey: column.order ? column.columnKey : SortKeys.DIMENSION,
                sortOrder: column.order ? column.order : SortOrders.ASCEND,
                rowPage: 1,
              })
            }}
          />
        </Col>
        <Col span={24}>
          <BackendPagination
            backendPagination={backendPagination}
            setBackendPagination={setBackendPagination}
          />
        </Col>
      </Row>
    </>
  )
}

export default StandardsProgressTable
