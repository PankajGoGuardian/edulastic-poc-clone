import React from 'react'
import next from 'immer'
import { flatMap, isEmpty, maxBy, sumBy } from 'lodash'
import {
  downloadCSV,
  percentage,
  dbToTableSortOrderMap,
} from '@edulastic/constants/reportUtils/common'
import { IconExternalLink } from '@edulastic/icons'
import { Link } from 'react-router-dom'
import { tableFilterTypes } from '../../utils'
import HorizontalBar from '../../../../../common/components/HorizontalBar'
import CompareByTitle from './CompareByTitle'
import AvgScoreTitle from './AvgScoreTitle'
import { DW_MAR_REPORT_URL } from '../../../../../common/constants/dataWarehouseReports'

const tableColumnsData = [
  {
    dataIndex: 'dimension',
    key: 'dimension',
    align: 'center',
    fixed: 'left',
    width: 250,
    sorter: true,
  },
  {
    dataIndex: 'avgAttendance',
    key: 'avgAttendance',
    title: 'AVG. ATTENDANCE',
    align: 'center',
    width: 200,
    className: 'avg-attendance-column-header',
    render: (value) => `${value}%`,
    sorter: true,
  },
  // next up are dynamic columns for each assessment type
]

export const onCsvConvert = (data) =>
  downloadCSV(`Data Warehouse - Dashboard Report.csv`, data)

const getHorizontalBarData = (data, selectedPerformanceBand) => {
  if (isEmpty(data) || isEmpty(selectedPerformanceBand)) return []

  const totalStudents = sumBy(data, 'totalStudents')
  return data.map((d) => {
    const band = selectedPerformanceBand.find(
      (pb) => pb.threshold === d.bandScore
    )
    return {
      value: percentage(d.totalStudents, totalStudents, true),
      color: band?.color,
    }
  })
}
export const getTableColumns = ({
  metricInfo,
  tableFilters,
  getTableDrillDownUrl,
  selectedPerformanceBand,
}) => {
  const columnSortOrder = dbToTableSortOrderMap[tableFilters.sortOrder]

  const rowWithMaxTestTypes = maxBy(
    metricInfo,
    (row) => Object.keys(row.performance).length
  )
  const availableTestTypes = Object.keys(rowWithMaxTestTypes?.performance || {})

  const tableColumns = next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex((col) => col.key === 'dimension')
    _columns[compareByIdx].title =
      tableFilters[tableFilterTypes.COMPARE_BY].title
    _columns[compareByIdx].render = (value) => (
      <CompareByTitle
        tableFilters={tableFilters}
        value={value}
        getTableDrillDownUrl={getTableDrillDownUrl}
      />
    )
    _columns[compareByIdx].sortOrder =
      tableFilters.sortKey === tableFilters[tableFilterTypes.COMPARE_BY].key &&
      columnSortOrder

    // avg attendance Column
    const avgAttendanceIdx = _columns.findIndex(
      (col) => col.key === 'avgAttendance'
    )
    _columns[avgAttendanceIdx].sortOrder =
      tableFilters.sortKey === 'avgAttendance' && columnSortOrder

    // dynamic columns
    const testTypesBasedColumns = flatMap(availableTestTypes, (testType) => {
      return [
        {
          key: `avgScore${testType}`,
          title: <AvgScoreTitle testType={testType} />,
          dataIndex: 'performance',
          align: 'center',
          width: 150,
          visibleOn: ['browser'],
          render: (value) =>
            value[testType] ? `${value[testType].avg}%` : '-',
          sorter: true,
          sortOrder:
            tableFilters.sortKey === `avgScore${testType}` && columnSortOrder,
        },
        {
          key: `performance${testType}`,
          title: <div>PERFORMANCE DISTRIBUTION</div>,
          dataIndex: 'performance',
          align: 'center',
          visibleOn: ['browser'],
          className: 'performance-distribution-column-header',
          render: (value) => (
            <HorizontalBar
              data={getHorizontalBarData(
                value[testType]?.distribution,
                selectedPerformanceBand
              )}
            />
          ),
        },
      ]
    })
    _columns.push(...testTypesBasedColumns)
  })

  // external link column
  const externalLinkColumn = {
    dataIndex: 'dimension',
    key: 'link',
    title: 'PERFORMANCE TRENDS',
    align: 'center',
    fixed: 'right',
    width: 200,
    render: (value) => (
      <Link
        to={getTableDrillDownUrl(value._id, DW_MAR_REPORT_URL)}
        target="_blank"
      >
        <IconExternalLink />
      </Link>
    ),
  }

  tableColumns.push(externalLinkColumn)
  return tableColumns
}
