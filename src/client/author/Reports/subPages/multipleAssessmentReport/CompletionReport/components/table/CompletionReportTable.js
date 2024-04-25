import React, { useRef, useMemo, useEffect } from 'react'

import {
  tableToDBSortOrderMap,
  downloadCSV,
} from '@edulastic/constants/reportUtils/common'
import { reportUtils } from '@edulastic/constants'
import TableHeader from './TableHeader'
import { StyledTable, TableContainer } from './styled'
import { getTableColumnFE, getTableDataSource } from '../../utils'
import { compareByKeysToFilterKeys } from '../../../common/utils/constants'
import { convertTableToCSV } from '../../../../../common/util'
import TableLoader from './TableLoader'
import { TABLE_PAGINATION_STYLE } from '../../../../../../../common/styled'

const { getTableData } = reportUtils.completionReport

const CompletionReportTable = ({
  settings,
  setMARSettings,
  isTableDataLoading,
  location,
  setAnalyseBy,
  analyseBy,
  setStatusColumnSortState,
  setTestColumnSort,
  tableData = [],
  isCsvDownloading,
  compareBy,
  setCompareBy,
  compareByCB,
  getCsvData,
  pageFilters,
  setPageFilters,
  role,
  districtId,
  csvDownloadLoadingState,
  compareByBasedOnRole,
  isSharedReport,
  generateCSVRequired,
}) => {
  const handleDownloadCsv = (record, progressStatus, progressName, index) => {
    const params = {
      ...settings.requestFilters,
      analyseBy,
      progressStatus,
      testName: record.testName,
      progressName,
      testId: record.testId,
      dimensionVal: record.dimensionId,
      index,
      compareBy: settings.selectedCompareBy?.key,
      isSharedReport,
    }
    // Removing as in BE if reportId is present, All filters will be applied instead instead of specific test
    if (isSharedReport) {
      delete params.reportId
    }
    if (compareByKeysToFilterKeys[compareBy.key]) {
      params[compareByKeysToFilterKeys[compareBy.key]] = record.dimensionId
    }
    getCsvData(params)
  }

  const tableDataWithOverallRow = tableData.length
    ? getTableData(tableData)
    : []
  const dataSource = getTableDataSource(tableDataWithOverallRow)

  const columns = useMemo(
    () =>
      getTableColumnFE({
        compareBy,
        districtId,
        isSharedReport,
        role,
        handleDownloadCsv,
        csvDownloadLoadingState,
        analyseBy: analyseBy.key,
        settings,
      }),
    [tableData, settings, analyseBy, csvDownloadLoadingState]
  )

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field === 'testName') {
      setTestColumnSort({
        sortKey: 'test',
        sortOrder: tableToDBSortOrderMap[sorter.order],
      })
    } else {
      setStatusColumnSortState({
        sortKey: sorter.field,
        sortOrder: tableToDBSortOrderMap[sorter.order],
      })
    }
  }

  const onCsvConvert = (data) => downloadCSV(`Completion Report.csv`, data)
  const childrenRef = useRef(null)

  // Download Csv (FE generated)
  useEffect(() => {
    if (isCsvDownloading && !generateCSVRequired) {
      const { csvRawData } = convertTableToCSV(childrenRef.current)
      const finalCsvData = csvRawData
        .map((row) => row.slice(0, row.length - 2).join(','))
        .join('\n')
      onCsvConvert(finalCsvData)
    }
  }, [isCsvDownloading, generateCSVRequired])
  const getRowClassName = (record) => {
    if (record.testId === 'overall_tid') {
      return 'overall-row'
    }
  }

  const handleTablePageChange = (page) => {
    setPageFilters({
      ...pageFilters,
      page,
    })
  }

  const totalPageSize = parseInt(dataSource?.[1]?.totalRows, 10) || 0

  return (
    <TableContainer ref={childrenRef}>
      <TableHeader
        urlCompareBy={compareByBasedOnRole}
        compareBy={compareBy}
        setCompareBy={setCompareBy}
        settings={settings}
        setMARSettings={setMARSettings}
        compareByCB={compareByCB}
        location={location}
        setAnalyseBy={setAnalyseBy}
        analyseBy={analyseBy}
      />
      <StyledTable
        loading={{
          indicator: <TableLoader />,
          spinning: isTableDataLoading,
        }}
        onChange={handleTableChange}
        columns={columns}
        dataSource={dataSource}
        pagination={
          dataSource.length > pageFilters.pageSize || pageFilters.page > 1
            ? {
                style: TABLE_PAGINATION_STYLE,
                total: totalPageSize,
                onChange: handleTablePageChange,
                pageSize: pageFilters.pageSize + 1,
              }
            : false
        }
        rowClassName={getRowClassName}
        scroll={{ x: 'max-content' }}
      />
    </TableContainer>
  )
}

export default CompletionReportTable
