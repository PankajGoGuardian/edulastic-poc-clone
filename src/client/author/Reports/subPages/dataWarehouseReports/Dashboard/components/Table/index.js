import React, { useCallback } from 'react'
import { Spin } from 'antd'
import { EduIf } from '@edulastic/common'
import { isEmpty } from 'lodash'
import { lightGreen13, lightRed6 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'

import CsvTable from '../../../../../common/components/tables/CsvTable'
import { StyledTag } from '../../../common/styled'
import {
  StyledRow,
  StyledText,
  TableContainer,
  CustomStyledTable,
} from '../common/styledComponents'
import TableHeaderCell from './TableHeaderCell'

import { tableFilterTypes } from '../../utils'
import { getTableColumns, onCsvConvert } from './utils'

const { DB_SORT_ORDER_TYPES, tableToDBSortOrderMap } = reportUtils.common

const DashboardTable = ({
  tableFilters,
  setTableFilters,
  onTableHeaderCellClick,
  getTableDrillDownUrl,
  tableData,
  selectedPerformanceBand,
  loadingTableData,
  isCsvDownloading,
}) => {
  const { metricInfo, aboveOrAtStandardCount, belowStandardCount } = tableData

  const tableColumns = getTableColumns({
    metricInfo,
    tableFilters,
    getTableDrillDownUrl,
    selectedPerformanceBand,
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
    <TableContainer>
      <Spin spinning={loadingTableData}>
        <EduIf condition={!loadingTableData && !isEmpty(tableData)}>
          <StyledRow type="flex" wrap justify="space-between" margin="30px">
            <StyledTag border="1.5px solid black" font="bold">
              Edulastic
            </StyledTag>
            <StyledText textTransform="uppercase">
              {tableFilters[tableFilterTypes.COMPARE_BY].title} PERFORMANCE
              ACCORDING TO DISTRICT AVERAGE
            </StyledText>
            <TableHeaderCell
              title="Above/Equal to avg.:"
              value={aboveOrAtStandardCount}
              color={lightGreen13}
              tableHeaderCellClick={() => {
                onTableHeaderCellClick(tableFilterTypes.ABOVE_EQUAL_TO_AVG)
              }}
              isSelected={tableFilters[tableFilterTypes.ABOVE_EQUAL_TO_AVG]}
            />
            <TableHeaderCell
              title="Below avg.:"
              value={belowStandardCount}
              color={lightRed6}
              tableHeaderCellClick={() => {
                onTableHeaderCellClick(tableFilterTypes.BELOW_AVG)
              }}
              isSelected={tableFilters[tableFilterTypes.BELOW_AVG]}
            />
          </StyledRow>
          <CsvTable
            dataSource={metricInfo}
            columns={tableColumns}
            tableToRender={CustomStyledTable}
            onChange={handleTableChange}
            onCsvConvert={onCsvConvert}
            bordered="dashed"
            isCsvDownloading={isCsvDownloading}
          />
        </EduIf>
      </Spin>
    </TableContainer>
  )
}

export default DashboardTable
