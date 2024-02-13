import React, { useMemo } from 'react'
import next from 'immer'
import { IconEye } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import TableHeader from './TableHeader'
import { ActionContainer, StyledTable, TableContainer } from './styled'

import CopyReportLink from './CopyReportLink'
import { compareByMap, sortKeys, tableColumnsData } from '../../utils'
import { buildDrillDownUrl } from '../../../../dataWarehouseReports/common/utils'
import LinkCell from '../../../../dataWarehouseReports/common/components/LinkCell'

// const getTableColumns = (
//   overallAssessmentsData,
//   isSharedReport,
//   settings,
//   isPrinting,
//   sortFilters
// ) => {
//   const compareBy = settings.selectedCompareBy

//   return next(tableColumnsData, (_columns) => {
//     // compareBy column
//     const compareByIdx = _columns.findIndex(
//       (col) => col.key === sortKeys.COMPARE_BY
//     )
//     _columns[compareByIdx].title = compareBy.title
//     _columns[compareByIdx].dataIndex = compareByMap[compareBy.key]
//     _columns[compareByIdx].sortOrder =
//       sortFilters.sortKey === sortKeys.COMPARE_BY && sortFilters.sortOrder
//     _columns[compareByIdx].render = (data, record) => {
//       const url = isSharedReport
//         ? null
//         : buildDrillDownUrl({
//             key: record.id,
//             selectedCompareBy: compareBy.key,
//             reportFilters: settings.requestFilters,
//             reportUrl: window.location.pathname,
//           })
//       return (
//         <LinkCell value={{ _id: record.id, name: data }} url={url} openNewTab />
//       )
//     }
//     _columns[compareByIdx].sorter = (a, b) => {
//       const dataIndex = compareByMap[compareBy.key]
//       return (a[dataIndex] || '')
//         .toLowerCase()
//         .localeCompare((b[dataIndex] || '').toLowerCase())
//     }
//     _columns[compareByIdx].defaultSortOrder = 'ascend'
//     _columns.push(...staticColumns)

//     // render rectangular tag for assessment performance
//   })
// }
const CompletionReportTable = ({ settings, setMARSettings }) => {
  const data = [
    {
      testId: 1,
      testName: 'test1',
      networks: [
        {
          networkName: 'Network A',
          graded: '1',
          assigned: '5',
          notStarted: '7',
          absent: '3',
          inProgress: '1',
          submitted: '1',
        },
        {
          networkName: 'Network B',
          graded: '2',
          submitted: '1',
          assigned: '3',
          notStarted: '79',
          absent: '4',
          inProgress: '13',
        },
        {
          networkName: 'Network C',
          graded: '1',
          submitted: '1',
          assigned: '5',
          notStarted: '89',
          absent: '3',
          inProgress: '12',
        },
        {
          networkName: 'Network D',
          graded: '1',
          submitted: '1',
          assigned: '5',
          notStarted: '89',
          absent: '3',
          inProgress: '12',
        },
      ],
    },
    {
      testId: 2,
      testName: 'test2',
      networks: [
        {
          networkName: 'Network E',
          graded: '1',
          submitted: '1',
          assigned: '5',
          notStarted: '89',
          absent: '3',
          inProgress: '12',
        },
        {
          networkName: 'Network F',
          graded: '1',
          submitted: '1',
          assigned: '5',
          notStarted: '89',
          absent: '3',
          inProgress: '12',
        },
        {
          networkName: 'Network G',
          graded: '1',
          submitted: '1',
          assigned: '5',
          notStarted: '89',
          absent: '3',
          inProgress: '12',
        },
      ],
    },
  ]
  const staticColumns = [
    {
      title: 'Test Name',
      dataIndex: 'testName',
      key: 'testName',
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text, record) => {
        return {
          children: record.test.index === 0 ? record.test.testName : '',
          // props: {
          //   rowSpan: record.test.index === 0 ? record.test.rowSpan : 0,
          // },
        }
      },
    },
    { title: 'Network Name', dataIndex: 'networkName', key: 'networkName' },
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

  const flattenData = data.flatMap(({ testId, testName, networks }) => {
    const flattenedNetworks = networks.map((network, index) => ({
      test: { testName, rowSpan: networks.length, index, testId },
      ...network,
    }))
    return flattenedNetworks
  })

  // const tableColumns = columns

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

  return (
    <TableContainer>
      <TableHeader settings={settings} setMARSettings={setMARSettings} />
      {/* Table component */}
      <StyledTable columns={staticColumns} dataSource={flattenData} />
    </TableContainer>
  )
}

export default CompletionReportTable
