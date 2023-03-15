import React from 'react'

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

const DashboardTable = ({
  tableFilters,
  updateTableFiltersCB,
  tableData,
  selectedPerformanceBand,
  isCsvDownloading,
}) => {
  const tableColumns = getTableColumns(
    tableFilters.compareBy,
    selectedPerformanceBand
  )
  const { metricInfo, aboveOrAtStandardCount, belowStandardCount } = tableData
  return (
    <TableContainer>
      <StyledRow type="flex" wrap justify="space-between" margin="30px">
        <StyledTag border="1.5px solid black" font="bold">
          Edulastic
        </StyledTag>
        <StyledText textTransform="uppercase">
          {tableFilters.compareBy.title} PERFORMANCE ACCORDING TO DISTRICT
          AVERAGE
        </StyledText>
        <TableHeaderCell
          title="Above/Equal to avg.:"
          value={aboveOrAtStandardCount}
          color="#BBEFC9"
          onClick={() =>
            updateTableFiltersCB(
              !tableFilters[tableFilterTypes.ABOVE_EQUAL_TO_AVG],
              tableFilterTypes.ABOVE_EQUAL_TO_AVG
            )
          }
        />
        <TableHeaderCell
          title="Below avg.:"
          value={belowStandardCount}
          color="#EFBBBB"
          onClick={() =>
            updateTableFiltersCB(
              !tableFilters[tableFilterTypes.BELOW_AVG],
              tableFilterTypes.BELOW_AVG
            )
          }
        />
      </StyledRow>
      <CsvTable
        dataSource={metricInfo}
        columns={tableColumns}
        tableToRender={CustomStyledTable}
        onCsvConvert={onCsvConvert}
        bordered="dashed"
        isCsvDownloading={isCsvDownloading}
      />
    </TableContainer>
  )
}

export default DashboardTable
