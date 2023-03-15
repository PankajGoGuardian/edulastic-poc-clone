import React from 'react'
import next from 'immer'
import { flatMap, sumBy } from 'lodash'
import {
  downloadCSV,
  percentage,
} from '@edulastic/constants/reportUtils/common'
import { IconExternalLink } from '@edulastic/icons'
import { availableTestTypes } from '../../utils'
import HorizontalBar from '../../../../../common/components/HorizontalBar'
import CompareByTitle from './CompareByTitle'
import AvgScoreTitle from './AvgScoreTitle'

const tableColumnsData = [
  {
    dataIndex: 'dimension',
    key: 'dimension',
    align: 'center',
    fixed: 'left',
    width: 250,
  },
  {
    dataIndex: 'avgAttendance',
    key: 'avgAttendance',
    title: 'AVG. ATTENDANCE',
    align: 'center',
    width: 200,
    className: 'avg-attendance-column-header',
    render: (value) => `${value}%`,
  },
  // next up are dynamic columns for each assessment type
]

export const onCsvConvert = (data) =>
  downloadCSV(`Data Warehouse - Dashboard Report.csv`, data)

const getHorizontalBarData = (data, selectedPerformanceBand) => {
  const totalStudents = sumBy(data, 'totalStudents')
  return data.map((d) => {
    const band = selectedPerformanceBand.find(
      (pb) => pb.threshold === d.bandScore
    )
    return {
      value: percentage(d.totalStudents, totalStudents, true),
      color: band.color,
    }
  })
}

export const getTableColumns = (compareBy, selectedPerformanceBand) => {
  const tableColumns = next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex((col) => col.key === 'dimension')
    _columns[compareByIdx].title = compareBy.title
    _columns[compareByIdx].render = (value) => <CompareByTitle value={value} />
    _columns[compareByIdx].defaultSortOrder = 'ascend'

    // dynamic columns
    const testTypesBasedColumns = flatMap(availableTestTypes, (testType) => {
      return [
        {
          key: 'avgScore',
          title: <AvgScoreTitle testType={testType.key} />,
          dataIndex: 'performance',
          align: 'center',
          width: 150,
          visibleOn: ['browser'],
          render: (value) =>
            value[testType.key] ? `${value[testType.key].avg}%` : '-',
        },
        {
          key: 'performance',
          title: <div>PERFORMANCE DISTRIBUTION</div>,
          dataIndex: 'performance',
          align: 'center',
          visibleOn: ['browser'],
          className: 'performance-distribution-column-header',
          render: (value) => (
            <HorizontalBar
              data={getHorizontalBarData(
                value[testType.key]?.distribution,
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
    dataIndex: 'link',
    key: 'link',
    title: 'PERFORMANCE TRENDS',
    align: 'center',
    fixed: 'right',
    width: 200,
    render: () => <IconExternalLink />,
  }

  tableColumns.push(externalLinkColumn)
  return tableColumns
}
