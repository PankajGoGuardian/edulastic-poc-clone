import React, { useRef, useMemo, useEffect } from 'react'
import next from 'immer'
import { IconEye } from '@edulastic/icons'
import { greyThemeDark4, themeColor } from '@edulastic/colors'
import {
  tableToDBSortOrderMap,
  downloadCSV,
} from '@edulastic/constants/reportUtils/common'
import { Link } from 'react-router-dom'
import { roleuser } from '@edulastic/constants'
import TableHeader from './TableHeader'
import { StyledTable, TableContainer } from './styled'

import CopyReportLink from './CopyReportLink'
import {
  compareByKeys,
  getTableDataSource,
  sortKeys,
  tableColumnsData,
} from '../../utils'
import { buildDrillDownUrl } from '../../../../dataWarehouseReports/common/utils'
import LinkCell from '../../../../dataWarehouseReports/common/components/LinkCell'
import {
  utastatus,
  sortKey,
  compareByKeysToFilterKeys,
} from '../../../common/utils/constants'

import { convertTableToCSV } from '../../../../../common/util'
import { getCompletionReportPathForAssignment } from '../../../../../../Assignments/components/ActionMenu/ActionMenu'
import StatusCsvDownload from './StatusCsvDownload'
import EllipsisTextWithTooltip from '../../../common/components/EllipsisTextWithTooltip'

const getTableColumns = (isSharedReport, settings, staticColumns) => {
  const compareBy = settings.selectedCompareBy
  const { SCHOOL, TEACHER } = compareByKeys
  const columnByCompareBy = next(tableColumnsData, (_columns) => {
    const compareByIdx = _columns.findIndex(
      (col) => col.key === sortKeys.COMPARE_BY
    )
    _columns[compareByIdx].title = compareBy.title
    _columns[compareByIdx].dataIndex = 'dimensionId'
    _columns[compareByIdx].render = (data, record) => {
      const url = isSharedReport
        ? null
        : buildDrillDownUrl({
            key: record.dimensionId,
            selectedCompareBy: compareBy.key,
            reportFilters: {
              ...settings.requestFilters,
              ...{ testIds: record.testId },
            },
            reportUrl: window.location.pathname,
          })
      if ([SCHOOL, TEACHER].includes(compareBy.key)) {
        return (
          <LinkCell
            value={{ _id: record.dimensionId, name: record.dimensionName }}
            url={url}
            showLink
          />
        )
      }
      return (
        <EllipsisTextWithTooltip
          toolTipMsg={record.dimensionName}
          text={record.dimensionName}
        />
      )
    }
  })
  staticColumns[1] = columnByCompareBy[0]
  return staticColumns
}

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
}) => {
  const isAnalyseByPercent = analyseBy.key === 'percentage'

  const getCellValue = (value, total) => {
    let totalValue = value || 0
    if (isAnalyseByPercent) {
      totalValue = Math.round((totalValue * 100) / total)
    }
    return `${totalValue || 0}${isAnalyseByPercent ? '%' : ''}`
  }

  const overAllData = {
    testId: 'overall_tid',
    testName: 'Overall',
    testType: '',
    assigned: tableData?.[0]?.totalAssigned || 0,
    inProgress: tableData?.[0]?.totalInProgress || 0,
    submitted: tableData?.[0]?.totalSubmitted || 0,
    absent: tableData?.[0]?.totalAbsent || 0,
    notStarted: tableData?.[0]?.totalNotStarted || 0,
    graded: tableData?.[0]?.totalGraded || 0,
    dimensionName: '',
    dimensionId: '',
  }
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
    }

    if (compareByKeysToFilterKeys[compareBy.key]) {
      params[compareByKeysToFilterKeys[compareBy.key]] = record.dimensionId
    }
    getCsvData(params)
  }
  const staticColumns = [
    {
      title: 'Test Name',
      dataIndex: 'testName',
      key: 'testName',
      sorter: true,
      fixed: 'left',
      width: 250,
      render: (text, record) => {
        let path = '/author/assignments'
        if ([roleuser.DISTRICT_ADMIN, roleuser.SCHOOL_ADMIN].includes(role)) {
          path = `${path}/${districtId}/${record.testId}`
        }
        const testName = record.index === 0 ? record.testName : ''
        return testName !== 'Overall' && !isSharedReport ? (
          <LinkCell value={{ _id: record.testId, name: testName }} url={path} />
        ) : (
          <p
            style={{
              color: testName === 'Overall' ? greyThemeDark4 : themeColor,
            }}
          >
            {testName}
          </p>
        )
      },
    },
    {},
    {
      title: '# Assigned',
      dataIndex: 'assigned',
      key: 'assigned',
      sorter: true,
      align: 'center',
      render: (value, record, index) => (
        <StatusCsvDownload
          record={record}
          handleDownloadCsv={handleDownloadCsv}
          csvDownloadLoadingState={csvDownloadLoadingState}
          progressStatus={utastatus.ASSIGNED}
          progressName={sortKey.ASSIGNED}
          index={index}
        >
          {value}
        </StatusCsvDownload>
      ),
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent',
      sorter: !isAnalyseByPercent,
      className: 'absent',
      align: 'center',
      render: (value, record, index) => (
        <StatusCsvDownload
          record={record}
          handleDownloadCsv={handleDownloadCsv}
          csvDownloadLoadingState={csvDownloadLoadingState}
          progressStatus={utastatus.ABSENT}
          progressName={sortKey.ABSENT}
          index={index}
        >
          {getCellValue(value, record?.assigned)}
        </StatusCsvDownload>
      ),
    },
    {
      title: 'Not started',
      dataIndex: 'notStarted',
      key: 'notStarted',
      className: 'absent',
      sorter: !isAnalyseByPercent,
      align: 'center',
      render: (value, record, index) => (
        <StatusCsvDownload
          record={record}
          handleDownloadCsv={handleDownloadCsv}
          csvDownloadLoadingState={csvDownloadLoadingState}
          progressStatus={utastatus.NOT_STARTED}
          progressName={sortKey.NOT_STARTED}
          index={index}
        >
          {getCellValue(value, record?.assigned)}
        </StatusCsvDownload>
      ),
    },
    {
      title: 'In progress',
      dataIndex: 'inProgress',
      key: 'inProgress',
      sorter: !isAnalyseByPercent,
      align: 'center',
      render: (value, record, index) => (
        <StatusCsvDownload
          record={record}
          handleDownloadCsv={handleDownloadCsv}
          csvDownloadLoadingState={csvDownloadLoadingState}
          progressStatus={utastatus.IN_PROGRESS}
          progressName={sortKey.IN_PROGRESS}
          index={index}
        >
          {getCellValue(value, record?.assigned)}
        </StatusCsvDownload>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
      sorter: !isAnalyseByPercent,
      align: 'center',
      render: (value, record, index) => (
        <StatusCsvDownload
          record={record}
          handleDownloadCsv={handleDownloadCsv}
          csvDownloadLoadingState={csvDownloadLoadingState}
          progressStatus={utastatus.SUBMITTED}
          progressName={sortKey.SUBMITTED}
          index={index}
        >
          {getCellValue(value, record?.assigned)}
        </StatusCsvDownload>
      ),
    },
    {
      title: 'GRADED',
      dataIndex: 'graded',
      key: 'graded',
      sorter: !isAnalyseByPercent,
      align: 'center',
      render: (value, record, index) => (
        <StatusCsvDownload
          record={record}
          handleDownloadCsv={handleDownloadCsv}
          csvDownloadLoadingState={csvDownloadLoadingState}
          progressStatus={utastatus.GRADED}
          progressName={sortKey.GRADED}
          index={index}
        >
          {getCellValue(value, record?.assigned)}
        </StatusCsvDownload>
      ),
    },
    {
      title: 'VIEW PERFORMANCE',
      key: 'performance',
      align: 'center',
      render: (text, record) => {
        const reportPath =
          record.testName === 'Overall'
            ? 'performance-over-time'
            : 'peer-performance/test/'
        return (
          <Link
            to={`/author/reports/${reportPath}${getCompletionReportPathForAssignment(
              record.testId,
              {},
              [record],
              settings?.requestFilters,
              compareBy
            )}`}
            target="_blank"
          >
            <IconEye color={themeColor} width={18} height={18} />
          </Link>
        )
      },
    },
    {
      title: 'Copy REPORT LINK TO SHARE',
      key: 'copyReportLink',
      align: 'center',
      render: (text, record) => {
        return (
          <CopyReportLink
            report={record}
            filterSettings={settings?.requestFilters || {}}
            compareBy={compareBy}
          />
        )
      },
    },
  ]

  const dataSource = getTableDataSource(
    tableData.length ? [overAllData, ...tableData] : []
  )

  const columns = useMemo(
    () => getTableColumns(isSharedReport, settings, staticColumns),
    [tableData, settings, isAnalyseByPercent, csvDownloadLoadingState]
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

  useEffect(() => {
    if (isCsvDownloading && childrenRef.current) {
      const { csvRawData } = convertTableToCSV(childrenRef.current)
      const finalCsvData = csvRawData
        .map((row) => row.slice(0, row.length - 2).join(','))
        .join('\n')
      onCsvConvert(finalCsvData)
    }
  }, [isCsvDownloading])
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
        loading={isTableDataLoading}
        onChange={handleTableChange}
        columns={columns}
        dataSource={dataSource}
        pagination={
          dataSource.length > pageFilters.pageSize || pageFilters.page > 1
            ? {
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
