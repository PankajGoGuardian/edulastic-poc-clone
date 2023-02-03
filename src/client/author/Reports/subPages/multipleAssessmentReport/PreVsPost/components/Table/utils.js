import React from 'react'
import next from 'immer'
import { flatMap, isEmpty, map } from 'lodash'
import { downloadCSV } from '../../../../../common/util'
import { compareByKeys } from '../../utils'
import HorizontalStackedBarChart from './HorizontalStackedBarChart'
import AvgPerformance from './columns/AvgPerformance'
import PerformanceChange from './columns/PerformanceChange'
import TestNamesCell from './columns/TestNamesCell'

const genericColumnsForTable = [
  {
    title: 'compareBy',
    key: 'compareBy',
    dataIndex: 'compareByColumnTitle',
    width: 150,
    align: 'left',
  },
  {
    title: 'Students',
    key: 'students',
    width: 188,
    align: 'center',
    dataIndex: 'studentsCount',
  },
  {
    title: 'Test',
    width: 200,
    key: 'test',
    align: 'center',
    dataIndex: 'testName',
    visibleOn: ['browser'],
  },
  {
    title: 'Avg. Performance',
    key: 'avgPerformance',
    dataIndex: 'avgScore',
    width: 188,
    align: 'center',
    visibleOn: ['browser'],
  },
  {
    title: 'Avg (Pre)',
    key: 'AvgPre',
    dataIndex: 'preAvgScorePercentage',
    align: 'center',
    visibleOn: ['csv'],
  },
  {
    title: 'Avg (Pre)',
    key: 'AvgPost',
    dataIndex: 'postAvgScorePercentage',
    align: 'center',
    visibleOn: ['csv'],
  },
  {
    title: 'Change',
    width: 188,
    key: 'change',
    align: 'center',
    dataIndex: '',
  },
  {
    title: 'Performance Band',
    width: 188,
    key: 'performanceBand',
    align: 'center',
    dataIndex: '',
    visibleOn: ['browser'],
  },
]

const compareByStudentColumns = [
  {
    title: 'compareBy',
    key: 'compareBy',
    dataIndex: 'compareByColumnTitle',
    align: 'left',
    width: 100,
  },
  {
    title: 'School',
    key: 'school',
    width: 150,
    align: 'center',
    dataIndex: 'schoolName',
  },
  {
    title: 'Teacher',
    key: 'teacher',
    width: 90,
    align: 'center',
    dataIndex: 'teacherName',
  },
  {
    title: 'Class',
    key: 'class',
    width: 90,
    dataIndex: 'className',
  },
  {
    title: 'Test',
    width: 90,
    key: 'test',
    align: 'center',
    dataIndex: 'testName',
    visibleOn: ['browser'],
  },
  {
    title: 'Avg. Performance',
    key: 'avgPerformance',
    dataIndex: 'avgScore',
    width: 120,
    align: 'center',
    visibleOn: ['browser'],
  },
  {
    title: 'Change',
    key: 'change',
    width: 70,
    align: 'center',
    dataIndex: '',
  },
]

export const onCsvConvert = (data) =>
  downloadCSV(`Pre Vs Post Test Comparison.csv`, data)

export const getTableColumns = (
  compareBy,
  analyseBy,
  selectedPerformanceBand,
  dataSource
) => {
  const tableColumnsData =
    compareBy === compareByKeys.STUDENT
      ? compareByStudentColumns
      : genericColumnsForTable

  const tableColumns = next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByColumnIdx = _columns.findIndex(
      (col) => col.key === 'compareBy'
    )
    _columns[compareByColumnIdx].title = compareBy
    _columns[compareByColumnIdx].render = (_, record) => {
      const value = record.compareByColumnTitle
      if (isEmpty(value)) return '-'
      return value
    }

    // Test names column
    const testColumnIdx = _columns.findIndex((col) => col.key === 'test')
    _columns[testColumnIdx].render = (_, record) => (
      <TestNamesCell record={record} />
    )

    // Avg Peformance column
    const avgPerformanceColumnIdx = _columns.findIndex(
      (col) => col.key === 'avgPerformance'
    )
    _columns[avgPerformanceColumnIdx].render = (_, record) => (
      <AvgPerformance record={record} analyseBy={analyseBy} />
    )

    // Performance change column
    const changeColumnIdx = _columns.findIndex((col) => col.key === 'change')
    _columns[changeColumnIdx].render = (_, record) => (
      <PerformanceChange record={record} />
    )

    // Performance band column
    if (compareBy !== compareByKeys.STUDENT) {
      const performanceBandColumnIdx = _columns.findIndex(
        (col) => col.key === 'performanceBand'
      )
      _columns[performanceBandColumnIdx].render = (_, record) => {
        const { preBandProfile, postBandProfile, studentsCount } = record
        return (
          <div>
            <HorizontalStackedBarChart
              data={[preBandProfile]}
              studentsCount={studentsCount}
              selectedPerformanceBand={selectedPerformanceBand}
            />
            <HorizontalStackedBarChart
              data={[postBandProfile]}
              studentsCount={studentsCount}
              selectedPerformanceBand={selectedPerformanceBand}
            />
          </div>
        )
      }
    }
  })

  // additional columns required only for download csv
  const performanceBandColumns = flatMap(dataSource, (d) => {
    const { preBandProfile, postBandProfile } = d
    const preBandColumns = map(Object.keys(preBandProfile), (key) => ({
      title: key,
      dataIndex: '',
      align: 'center',
      visibleOn: ['csv'],
      render: (_, record) => record.preBandProfile[key],
    }))
    const postBandColumns = map(Object.keys(postBandProfile), (key) => ({
      title: key,
      dataIndex: '',
      align: 'center',
      visibleOn: ['csv'],
      render: (_, record) => record.postBandProfile[key],
    }))

    return [...preBandColumns, ...postBandColumns]
  })
  if (compareBy === compareByKeys.STUDENT)
    tableColumns.push(...performanceBandColumns)

  return tableColumns
}
