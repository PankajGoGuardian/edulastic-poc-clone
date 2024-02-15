import React, { useRef, useMemo, useEffect } from 'react'
import next from 'immer'
import { IconEye } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { groupBy } from 'lodash'
import TableHeader from './TableHeader'
import { ActionContainer, StyledTable, TableContainer } from './styled'

import CopyReportLink from './CopyReportLink'
import {
  compareByMap,
  getTableDataSource,
  sortKeys,
  tableColumnsData,
} from '../../utils'
import { buildDrillDownUrl } from '../../../../dataWarehouseReports/common/utils'
import LinkCell from '../../../../dataWarehouseReports/common/components/LinkCell'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { tableToDBSortOrderMap } from '@edulastic/constants/reportUtils/common'
import {
  compareByOptions,
  compareByOptionsMapByKey,
  utastatus,
  statusMap,
  sortKey,
} from '../../../common/utils/constants'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { convertTableToCSV } from '../../../../../common/util'
import { Link } from 'react-router-dom'
import { getCompletionReportPathForAssignment } from '../../../../../../Assignments/components/ActionMenu/ActionMenu'
import qs from 'qs'
import { Empty } from 'antd'

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
  sharedReport,
}) => {
  const isAnalyseByPercent = analyseBy.key === 'percentage'
  const getValue = (value) => {
    const renderedValue = value?.toString()?.replace(/\.00$/, '')
    return `${renderedValue || 0}${isAnalyseByPercent ? '%' : ''}`
  }
  const search = qs.parse(location.search, {
    ignoreQueryPrefix: true,
    indices: true,
  })
  const urlCompareBy = compareByOptions.find(
    (option) => option.key === search.selectedCompareBy
  )
  const overAllData = {
    testId: 'overall_tid',
    testName: 'Overall',
    testType: '',
    assigned: tableData?.[0]?.totalAssigned || 0,
    inProgress:
      tableData?.[0]?.[
        `${isAnalyseByPercent ? 'totalInProgressP' : 'totalInProgress'}`
      ] || 0,
    submitted:
      tableData?.[0]?.[
        `${isAnalyseByPercent ? 'totalSubmittedP' : 'totalSubmitted'}`
      ] || 0,
    absent:
      tableData?.[0]?.[
        `${isAnalyseByPercent ? 'totalAbsentP' : 'totalAbsent'}`
      ] || 0,
    notStarted:
      tableData?.[0]?.[
        `${isAnalyseByPercent ? 'totalNotStartedP' : 'totalNotStarted'}`
      ] || 0,
    graded:
      tableData?.[0]?.[
        `${isAnalyseByPercent ? 'totalGradedP' : 'totalGraded'}`
      ] || 0,
    dimensionName: '',
    dimensionId: '',
  }
  const handleDownloadCsv = (record, progressStatus, progressName) => {
    getCsvData({
      ...settings.requestFilters,
      analyseBy,
      progressStatus,
      testName: record.testName,
      progressName,
      testId: record.testId,
    })
  }
  const staticColumns = [
    {
      title: 'Test Name',
      dataIndex: 'testName',
      key: 'testName',
      sorter: true,
      render: (text, record) => {
        return {
          children: record.index === 0 ? record.testName : '',
          // props: {
          //   rowSpan: record.index === 0 ? record.rowSpan : 0,
          // },
        }
      },
    },
    {},
    {
      title: '# Assigned',
      dataIndex: 'assigned',
      key: 'assigned',
      sorter: true,
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
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, utastatus.ABSENT, sortKey.ABSENT)
          }
        >
          {getValue(value)}
        </ActionContainer>
      ),
    },
    {
      title: 'Not started',
      dataIndex: 'notStarted',
      key: 'notStarted',
      className: 'absent',
      sorter: true,
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
          {getValue(value)}
        </ActionContainer>
      ),
    },
    {
      title: 'In progress',
      dataIndex: 'inProgress',
      key: 'inProgress',
      sorter: true,
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
          {getValue(value)}
        </ActionContainer>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
      sorter: true,
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, utastatus.SUBMITTED, sortKey.SUBMITTED)
          }
        >
          {getValue(value)}
        </ActionContainer>
      ),
    },
    {
      title: 'GRADED',
      dataIndex: 'graded',
      key: 'graded',
      sorter: true,
      render: (value, record) => (
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, utastatus.GRADED, sortKey.GRADED)
          }
        >
          {getValue(value)}
        </ActionContainer>
      ),
    },
    {
      title: 'VIEW PERFORMANCE',
      key: 'performance',
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
      title: 'COPY REPORT LINK',
      key: 'copyReportLink',
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

  console.log({ sharedReport })
  const columns = useMemo(
    () => getTableColumns(false, settings, staticColumns),
    [tableData, settings]
  )

  // if (isTableDataLoading) {
  //   return (
  //     <SpinLoader
  //       tip="Loading completion table data..."
  //       position="relative"
  //       height="70%"
  //     />
  //   )
  // }

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
  // const tableColumns = useMemo(
  //   () =>
  //     getTableColumns(
  //       overallAssessmentsData,
  //       isSharedReport,
  //       settings,
  //       isPrinting,
  //       sortFilters
  //     ),
  //   [overallAssessmentsData, isSharedReport, settings, isPrinting, sortFilters]
  // )
  const onCsvConvert = (data) => downloadCSV(`Completion Report.csv`, data)
  const childrenRef = useRef(null)

  useEffect(() => {
    if (isCsvDownloading && childrenRef.current) {
      const { csvText, csvRawData } = convertTableToCSV(childrenRef.current)
      onCsvConvert(csvText, csvRawData)
    }
  }, [isCsvDownloading])

  const handleTablePageChange = (page) => {
    setPageFilters({
      ...pageFilters,
      page,
    })
  }

  const totalPageSize = parseInt(dataSource?.[0].totalRows, 10)

  return (
    <TableContainer ref={childrenRef}>
      <EduIf condition={tableData.length}>
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
        {/* Table component */}
        <StyledTable
          loading={isTableDataLoading}
          onChange={handleTableChange}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            total: totalPageSize,
            onChange: handleTablePageChange,
          }}
        />
      </EduIf>
    </TableContainer>
  )
}

export default CompletionReportTable
