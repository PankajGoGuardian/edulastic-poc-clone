import React, { useRef, useMemo, useEffect } from 'react'
import next from 'immer'
import { IconEye } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { EduIf, EduThen } from '@edulastic/common'
import {
  tableToDBSortOrderMap,
  downloadCSV,
} from '@edulastic/constants/reportUtils/common'
import { Link } from 'react-router-dom'
import qs from 'qs'
import { roleuser } from '@edulastic/constants'
import TableHeader from './TableHeader'
import { ActionContainer, StyledTable, TableContainer } from './styled'

import CopyReportLink from './CopyReportLink'
import { getTableDataSource, sortKeys, tableColumnsData } from '../../utils'
import { buildDrillDownUrl } from '../../../../dataWarehouseReports/common/utils'
import LinkCell from '../../../../dataWarehouseReports/common/components/LinkCell'
import {
  compareByOptions,
  utastatus,
  sortKey,
  compareByKeysToFilterKeys,
} from '../../../common/utils/constants'

import { convertTableToCSV } from '../../../../../common/util'
import { getCompletionReportPathForAssignment } from '../../../../../../Assignments/components/ActionMenu/ActionMenu'

const getTableColumns = (isSharedReport, settings, staticColumns) => {
  const compareBy = settings.selectedCompareBy
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
            reportFilters: settings.requestFilters,
            reportUrl: window.location.pathname,
          })

      return (
        <LinkCell
          value={{ _id: record.dimensionId, name: record.dimensionName }}
          url={url}
          showLink
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
}) => {
  const isAnalyseByPercent = analyseBy.key === 'percentage'
  const search = qs.parse(location.search, {
    ignoreQueryPrefix: true,
    indices: true,
  })
  const urlCompareBy = compareByOptions.find(
    (option) => option.key === search.selectedCompareBy
  )
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
  const handleDownloadCsv = (record, progressStatus, progressName) => {
    const params = {
      ...settings.requestFilters,
      analyseBy,
      progressStatus,
      testName: record.testName,
      progressName,
      testId: record.testId,
      dimensionVal: record.dimensionId,
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
        return (
          <LinkCell value={{ _id: record.testId, name: testName }} url={path} />
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
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, utastatus.ASSIGNED, sortKey.ASSIGNED)
          }
        >
          {value}
        </ActionContainer>
      ),
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent',
      sorter: true,
      className: 'absent',
      align: 'center',
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, utastatus.ABSENT, sortKey.ABSENT)
          }
        >
          {getCellValue(value, record?.assigned)}
        </ActionContainer>
      ),
    },
    {
      title: 'Not started',
      dataIndex: 'notStarted',
      key: 'notStarted',
      className: 'absent',
      sorter: true,
      align: 'center',
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(
              record,
              utastatus.NOT_STARTED,
              sortKey.NOT_STARTED
            )
          }
        >
          {getCellValue(value, record?.assigned)}
        </ActionContainer>
      ),
    },
    {
      title: 'In progress',
      dataIndex: 'inProgress',
      key: 'inProgress',
      sorter: true,
      align: 'center',
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(
              record,
              utastatus.IN_PROGRESS,
              sortKey.IN_PROGRESS
            )
          }
        >
          {getCellValue(value, record?.assigned)}
        </ActionContainer>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
      sorter: true,
      align: 'center',
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, utastatus.SUBMITTED, sortKey.SUBMITTED)
          }
        >
          {getCellValue(value, record?.assigned)}
        </ActionContainer>
      ),
    },
    {
      title: 'GRADED',
      dataIndex: 'graded',
      key: 'graded',
      sorter: true,
      align: 'center',
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, utastatus.GRADED, sortKey.GRADED)
          }
        >
          {getCellValue(value, record?.assigned)}
        </ActionContainer>
      ),
    },
    {
      title: 'VIEW PERFORMANCE',
      key: 'performance',
      align: 'center',
      render: (text, record) => {
        return (
          <Link
            to={`/author/reports/performance-over-time${getCompletionReportPathForAssignment(
              record.testId,
              {},
              [record]
            )}`}
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
          />
        )
      },
    },
  ]

  const dataSource = getTableDataSource([overAllData, ...tableData])

  const columns = useMemo(
    () => getTableColumns(false, settings, staticColumns),
    [tableData, settings, isAnalyseByPercent]
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
      const { csvText, csvRawData } = convertTableToCSV(childrenRef.current)
      onCsvConvert(csvText, csvRawData)
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
      <EduIf condition={tableData.length}>
        <EduThen>
          <TableHeader
            urlCompareBy={urlCompareBy}
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
            pagination={{
              total: totalPageSize,
              onChange: handleTablePageChange,
              pageSize: pageFilters.pageSize + 1,
            }}
            rowClassName={getRowClassName}
            scroll={{ x: 'max-content' }}
          />
        </EduThen>
      </EduIf>
    </TableContainer>
  )
}

export default CompletionReportTable
