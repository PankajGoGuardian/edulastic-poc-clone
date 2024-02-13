import React, { useMemo } from 'react'
import next from 'immer'
import { IconEye } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { groupBy } from 'lodash'
import TableHeader from './TableHeader'
import { ActionContainer, StyledTable, TableContainer } from './styled'

import CopyReportLink from './CopyReportLink'
import { compareByMap, sortKeys, tableColumnsData } from '../../utils'
import { buildDrillDownUrl } from '../../../../dataWarehouseReports/common/utils'
import LinkCell from '../../../../dataWarehouseReports/common/components/LinkCell'

const staticColumns = [
  {
    title: 'Test Name',
    dataIndex: 'testName',
    key: 'testName',
    sorter: (a, b) => a.name.length - b.name.length,
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
  { title: '# Assigned', dataIndex: 'assigned', key: 'assigned' },
  {
    title: 'Absent',
    dataIndex: 'absent',
    key: 'absent',
    className: 'absent',
  },
  {
    title: 'Not started',
    dataIndex: 'notStarted',
    key: 'notStarted',
    className: 'absent',
  },
  {
    title: 'In progress',
    dataIndex: 'inProgress',
    key: 'inProgress',
  },
  {
    title: 'Submitted',
    dataIndex: 'submitted',
    key: 'submitted',
  },
  { title: 'GRADED', dataIndex: 'graded', key: 'graded' },
  {
    title: 'VIEW PERFORMANCE',
    key: 'performance',
    render: (text, record) => {
      console.log({ record })
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
const getTableColumns = (isSharedReport, settings, isPrinting, sortFilters) => {
  const compareBy = { key: 'school', title: 'School' }
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

const CompletionReportTable = ({ settings, setMARSettings }) => {
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
  const groupedData = groupBy(_data, 'testId')
  const dataSource = Object.values(groupedData).flatMap((tests) => {
    const rowSpan = tests.length
    return tests.map((test, index) => ({ index, rowSpan, ...test }))
  })

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
  const columns = getTableColumns(false, settings, false, {})

  return (
    <TableContainer>
      <TableHeader settings={settings} setMARSettings={setMARSettings} />
      {/* Table component */}
      <StyledTable columns={columns} dataSource={dataSource} />
    </TableContainer>
  )
}

export default CompletionReportTable
