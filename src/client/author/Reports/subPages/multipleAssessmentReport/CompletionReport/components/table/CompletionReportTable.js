import React, { useMemo } from 'react'
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
  tableData,
}) => {
  const _data = [
    {
      assessmentDate: '1696567790009',
      testId: '651f954bfec3ee0008dd9278',
      testName: 'test 12',
      testType: 'common assessment',
      assigned: '3',
      inProgress: '0',
      submitted: '1',
      absent: '0',
      notStarted: '0',
      graded: '2',
      dimensionName: 'Keerthi School',
      dimensionId: '64676f832dceab00089c43fc',
    },
    {
      assessmentDate: '1696567790009',
      testId: '651f954bfec3ee0008dd9278',
      testName: 'test 13',
      testType: 'common assessment',
      assigned: '31',
      inProgress: '10',
      submitted: '11',
      absent: '10',
      notStarted: '10',
      graded: '12',
      dimensionName: 'Keerthi School',
      dimensionId: '64676f832dceab00089c43fc',
    },
    {
      assessmentDate: '1696512172897',
      testId: '651eb89174074399ff8715fc',
      testName: 'abc 123',
      testType: 'common assessment',
      assigned: '3',
      inProgress: '0',
      submitted: '1',
      absent: '0',
      notStarted: '2',
      graded: '0',
      dimensionName: 'Keerthi School',
      dimensionId: '64676f832dceab00089c43fc',
    },
  ]

  const dataSource = getTableDataSource(_data)

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
  return (
    <TableContainer>
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
