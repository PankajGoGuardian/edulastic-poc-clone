import React from 'react'
import next from 'immer'
import { reportUtils } from '@edulastic/constants'

import {
  compareByKeysToFilterKeys,
  nextCompareByKeys,
} from '../../common/utils'
import { compareByEnums, compareByToPluralName, sortKeys } from './constants'

import LinkCell from '../../common/components/LinkCell'
import { DW_WLR_REPORT_URL } from '../../../../common/constants/dataWarehouseReports'
import {
  StudentBand,
  HorizontalStackedBarChart,
} from '../HorizontalStackedChart'

const { downloadCSV } = reportUtils.common

const tableColumnsData = [
  {
    key: sortKeys.DIMENSION,
    dataIndex: 'dimension.name',
    align: 'left',
    sorter: true,
  },
  {
    title: 'NO. OF STUDENTS',
    key: sortKeys.STUDENTS,
    align: 'center',
    dataIndex: 'students',
    sorter: true,
  },
  {
    title: 'AVG ATTENDANCE',
    key: sortKeys.AVG_ATTENDANCE,
    align: 'center',
    dataIndex: 'avgAttendance',
    render: (text) => `${Math.round(text)}%`,
    sorter: true,
  },
  {
    title: 'TOTAL ATTENDANCE / TOTAL EVENTS',
    key: sortKeys.ATTENDANCE_EVENTS,
    align: 'center',
    dataIndex: 'totalEvents',
    sorter: true,
    render: (_, record) => {
      return `${record.totalAttendance} / ${record.totalEvents}`
    },
  },
  {
    title: 'AVG ABSENCE/STUDENT',
    key: sortKeys.AVG_ABSENCE,
    align: 'center',
    dataIndex: 'avgAbsence',
    render: (text) => Math.round(text),
    sorter: true,
  },
  {
    title: 'TOTAL ABSENCES',
    key: sortKeys.TOTAL_ABSENCE,
    align: 'center',
    dataIndex: 'totalAbsence',
    sorter: true,
  },
  {
    title: 'ATTENDANCE DISRUPTIONS',
    key: sortKeys.ATTENDANCE_DISRUPTIONS,
    align: 'center',
    dataIndex: 'attendanceDisruptionsCount',
    sorter: true,
  },
  {
    title: 'ATTENDANCE DISTRIBUTION',
    key: 'attendanceDistribution',
    align: 'center',
    dataIndex: 'attendanceDistribution',
    render: (attendanceDistribution) => {
      return <HorizontalStackedBarChart data={attendanceDistribution} />
    },
  },
  {
    title: 'ATTENDANCE BAND',
    key: 'studentBand',
    align: 'center',
    dataIndex: 'studentBand',
    render: (studentBand) => {
      return <StudentBand data={studentBand} />
    },
  },
]

export const onCsvConvert = (data) =>
  downloadCSV(`Attendance Summary.csv`, data)

export const getTableColumns = (sortOrder, sortKey, compareBy, showAbsents) => {
  let tableColumns = next(tableColumnsData, (_columns) => {
    const dimensionColumn = _columns.find(
      (col) => col.key === sortKeys.DIMENSION
    )
    Object.assign(dimensionColumn, {
      title: compareByToPluralName[compareBy],
      render: (value, record) => {
        const disableDrillDown =
          compareBy === compareByEnums.TEACHER && record.students > 100
        let url = null
        const isStudentCompareBy = compareBy === compareByEnums.STUDENT
        if (!disableDrillDown) {
          if (isStudentCompareBy) {
            const { search } = window.location
            Object.assign(search, {
              courseIds: search.courseId,
              testTypes: search.assessmentTypes,
              performanceBandProfileId: search.profileId,
            })
            url = new URL(
              `${window.location.origin}${DW_WLR_REPORT_URL}${record.dimension._id}${search}`
            )
          } else {
            const filterField = compareByKeysToFilterKeys[compareBy]
            url = new URL(window.location.href)
            url.searchParams.set(filterField, record.dimension._id)
            url.searchParams.set(
              'selectedCompareBy',
              nextCompareByKeys[compareBy]
            )
          }
        }
        return (
          <LinkCell
            value={{ _id: record.dimension._id, name: value }}
            url={url}
            openNewTab={isStudentCompareBy}
          />
        )
      },
    })
  })

  if (showAbsents) {
    tableColumns = tableColumns.filter((col) =>
      [sortKeys.AVG_ATTENDANCE, sortKeys.ATTENDANCE_EVENTS].every(
        (colKey) => colKey !== col.key
      )
    )
  } else {
    tableColumns = tableColumns.filter((col) =>
      [sortKeys.AVG_ABSENCE, sortKeys.TOTAL_ABSENCE].every(
        (colKey) => colKey !== col.key
      )
    )
  }

  if (compareBy === compareByEnums.STUDENT) {
    tableColumns = tableColumns.filter((col) =>
      [sortKeys.STUDENTS, sortKeys.AVG_ABSENCE, 'attendanceDistribution'].every(
        (colKey) => colKey !== col.key
      )
    )
  } else {
    tableColumns = tableColumns.filter((col) => col.key !== 'studentBand')
  }

  return tableColumns.map((item) => {
    if (item.key === sortKey) {
      item.sortOrder = sortOrder
    }
    return item
  })
}
