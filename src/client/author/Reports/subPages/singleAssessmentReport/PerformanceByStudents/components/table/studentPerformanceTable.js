import React from 'react'
import { reportUtils } from '@edulastic/constants'
import { StyledTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'

const { downloadCSV } = reportUtils.common

const onCsvConvert = (data) => downloadCSV(`Performance by Students.csv`, data)

const StudentPerformanceTable = ({
  report,
  isCsvDownloading,
  columns,
  rowSelection,
  setSortKey,
  setSortOrder,
  setPageNo,
  location,
  pageTitle,
}) => {
  const onChange = (_, __, column) => {
    setSortKey(column.columnKey)
    setSortOrder(column.order)
    setPageNo(1)
  }
  const scrollX = '100%'
  return (
    <CsvTable
      isCsvDownloading={isCsvDownloading}
      onCsvConvert={onCsvConvert}
      columns={columns}
      dataSource={report}
      tableToRender={StyledTable}
      rowSelection={rowSelection}
      colouredCellsNo={4}
      rightAligned={6}
      onChange={onChange}
      location={location}
      scroll={{ x: scrollX }}
      pageTitle={pageTitle}
      pagination={false}
    />
  )
}

export default StudentPerformanceTable
