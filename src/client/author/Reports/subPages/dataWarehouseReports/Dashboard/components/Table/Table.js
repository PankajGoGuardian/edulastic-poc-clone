import React, { useState } from 'react'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { StyledTag } from '../../../common/styled'
import {
  StyledRow,
  StyledText,
  TableContainer,
  CustomStyledTable,
} from '../common/styledComponents'
import TableHeaderCell from '../common/TableHeaderCell'
import DashboardTableFilters from './Filters'
import { getTableColumns, onCsvConvert } from './utils'

const DashboardTable = ({ tableData, isCsvDownloading }) => {
  const defaultCompareBy = { key: 'school', title: 'School' }
  const [compareBy, setCompareBy] = useState(defaultCompareBy)
  const tableColumns = getTableColumns(tableData, defaultCompareBy)
  return (
    <>
      <DashboardTableFilters
        selectedCompareBy={compareBy}
        setCompareBy={setCompareBy}
      />
      <TableContainer>
        <StyledRow type="flex" wrap justify="space-between" margin="30px">
          <StyledTag border="1.5px solid black" font="bold">
            Edulastic
          </StyledTag>
          <StyledText textTransform="uppercase">
            {compareBy.title} PERFORMANCE ACCORDING TO DISTRICT AVERAGE
          </StyledText>
          <TableHeaderCell
            title="Above/Equal to avg.:"
            value={12}
            color="#BBEFC9"
          />
          <TableHeaderCell title="Below avg.:" value={4} color="#EFBBBB" />
        </StyledRow>
        <CsvTable
          dataSource={tableData}
          columns={tableColumns}
          tableToRender={CustomStyledTable}
          onCsvConvert={onCsvConvert}
          bordered="dashed"
          isCsvDownloading={isCsvDownloading}
        />
      </TableContainer>
    </>
  )
}

export default DashboardTable
