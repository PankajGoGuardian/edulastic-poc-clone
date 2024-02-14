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
import { SpinLoader } from '@edulastic/common'
import { tableToDBSortOrderMap } from '@edulastic/constants/reportUtils/common'
import {
  compareByOptions,
  compareByOptionsMapByKey,
} from '../../../common/utils/constants'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { convertTableToCSV } from '../../../../../common/util'

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
  // { title: 'Network Name', dataIndex: 'networkName', key: 'networkName' },
  {
    title: '# Assigned',
    dataIndex: 'assigned',
    key: 'assigned',
    render: (value, record) => <ActionContainer>{value}</ActionContainer>,
  },
  {
    title: 'Absent',
    dataIndex: 'absent',
    key: 'absent',
    sorter: true,
    className: 'absent',
    render: (value, record) => <ActionContainer>{value}</ActionContainer>,
  },
  {
    title: 'Not started',
    dataIndex: 'notStarted',
    key: 'notStarted',
    className: 'absent',
    sorter: true,
    render: (value, record) => <ActionContainer>{value}</ActionContainer>,
  },
  {
    title: 'In progress',
    dataIndex: 'inProgress',
    key: 'inProgress',
    sorter: true,
    render: (value, record) => <ActionContainer>{value}</ActionContainer>,
  },
  {
    title: 'Submitted',
    dataIndex: 'submitted',
    key: 'submitted',
    sorter: true,
    render: (value, record) => <ActionContainer>{value}</ActionContainer>,
  },
  {
    title: 'GRADED',
    dataIndex: 'graded',
    key: 'graded',
    sorter: true,
    render: (value, record) => <ActionContainer>{value}</ActionContainer>,
  },
  {
    title: 'VIEW PERFORMANCE',
    key: 'performance',
    render: (text, record) => {
      return (
        <ActionContainer onClick={() => console.log(record)}>
          <IconEye color={themeColor} width={18} height={18} />
        </ActionContainer>
      )
    },
  },
  {
    title: 'COPY REPORT LINK',
    key: 'copyReportLink',
    render: (text, record) => {
      return <CopyReportLink report={record} />
    },
  },
]
const getTableColumns = (isSharedReport, settings) => {
  const compareBy =
    compareByOptionsMapByKey[settings.requestFilters.selectedCompareBy]
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
          openNewTab
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
}) => {
  console.log({ tableData })
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

  const dataSource = getTableDataSource([overAllData, ...tableData])

  const columns = useMemo(() => getTableColumns(false, settings), [
    tableData,
    settings,
  ])

  if (isTableDataLoading) {
    return (
      <SpinLoader
        tip="Loading completion table data..."
        position="relative"
        height="70%"
      />
    )
  }

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
  return (
    <TableContainer ref={childrenRef}>
      <TableHeader
        settings={settings}
        setMARSettings={setMARSettings}
        location={location}
        setAnalyseBy={setAnalyseBy}
        analyseBy={analyseBy}
      />

      <StyledTable
        onChange={handleTableChange}
        columns={columns}
        dataSource={dataSource}
      />
    </TableContainer>
  )
}

export default CompletionReportTable
