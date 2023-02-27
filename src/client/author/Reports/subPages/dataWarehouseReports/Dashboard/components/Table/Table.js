import React from 'react'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { StyledTag } from '../../../common/styled'
import {
  StyledRow,
  SubFooter,
  TableContainer,
  CustomStyledTable,
} from '../common/styledComponents'
import TableHeaderCell from '../common/TableHeaderCell'
import DashboardTableFilters from './Filters'
import { getTableColumns, onCsvConvert } from './utils'

const DashboardTable = ({ tableData, isCsvDownloading }) => {
  const selectedTableFilter = { key: 'school', title: 'School' }
  const tableColumns = getTableColumns(tableData, selectedTableFilter)
  return (
    <>
      <DashboardTableFilters selectedTableFilter={selectedTableFilter} />
      <TableContainer>
        <StyledRow
          type="flex"
          wrap
          justify="space-between"
          style={{ margin: '30px' }}
        >
          <StyledTag border="1.5px solid black" font="bold">
            Edulastic
          </StyledTag>
          <SubFooter>
            SCHOOL PERFORMANCE ACCORDING TO DISTRICT AVERAGE
          </SubFooter>
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
