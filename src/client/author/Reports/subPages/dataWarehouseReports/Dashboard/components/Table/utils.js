import React from 'react'
import next from 'immer'
import { flatMap, isEmpty, maxBy, sumBy } from 'lodash'
import {
  downloadCSV,
  percentage,
  dbToTableSortOrderMap,
} from '@edulastic/constants/reportUtils/common'
import { Link } from 'react-router-dom'
import { IoMdLink } from 'react-icons/io'
import { compareByKeys } from '@edulastic/constants/reportUtils/standardsMasteryReport/standardsGradebook'
import { tableFilterTypes } from '../../utils'
import AvgScoreTitle from './AvgScoreTitle'
import {
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
} from '../../../../../common/constants/dataWarehouseReports'
import { StyledDiv } from '../common/styledComponents'
import LinkCell from '../../../common/components/LinkCell'
import PerformanceDistribution from './PerformanceDistribution'

const tableColumnKeys = {
  DIMENSION: 'dimension',
  AVG_ATTENDANCE: 'avgAttendance',
}

const tableColumnsData = [
  {
    dataIndex: 'dimension',
    key: tableColumnKeys.DIMENSION,
    align: 'left',
    fixed: 'left',
    width: 250,
    sorter: true,
    className: 'dimension',
  },
  {
    dataIndex: 'avgAttendance',
    key: tableColumnKeys.AVG_ATTENDANCE,
    title: 'AVG. ATTENDANCE',
    align: 'center',
    width: 200,
    className: 'avg-attendance',
    render: (value) => (typeof value === 'number' ? `${value}%` : '-'),
    sorter: true,
  },
  // next up are dynamic columns for each assessment type
]

export const onCsvConvert = (data) =>
  downloadCSV(`Data Warehouse - Dashboard Report.csv`, data)

export const getHorizontalBarData = (data, selectedPerformanceBand) => {
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
  isStudentCompareBy,
  getTableDrillDownUrl,
  selectedPerformanceBand,
}) => {
  const columnSortOrder = dbToTableSortOrderMap[tableFilters.sortOrder]

  const rowWithMaxTestTypes = maxBy(
    metricInfo,
    (row) => Object.keys(row.performance).length
  )
  const availableTestTypes = Object.keys(rowWithMaxTestTypes?.performance || {})
  const selectedCompareBy = tableFilters[tableFilterTypes.COMPARE_BY].key

  const PerformanceColumnTitle = isStudentCompareBy
    ? 'PERFORMANCE BAND'
    : 'PERFORMANCE DISTRIBUTION'
  const externalLinkColumnTitle = isStudentCompareBy
    ? 'WHOLE LEARNER'
    : 'PERFORMANCE TRENDS'

  const tableColumns = next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex(
      (col) => col.key === tableColumnKeys.DIMENSION
    )
    _columns[compareByIdx].title =
      tableFilters[tableFilterTypes.COMPARE_BY].title
    _columns[compareByIdx].align = 'left'
    _columns[compareByIdx].render = (value) => {
      const url = [
        compareByKeys.SCHOOL,
        compareByKeys.TEACHER,
        compareByKeys.CLASS,
      ].includes(selectedCompareBy)
        ? getTableDrillDownUrl(value._id)
        : null
      return <LinkCell value={value} url={url} />
    }
    _columns[compareByIdx].sortOrder =
      tableFilters.sortKey === tableFilters[tableFilterTypes.COMPARE_BY].key &&
      columnSortOrder

    // avg attendance Column
    const avgAttendanceIdx = _columns.findIndex(
      (col) => col.key === tableColumnKeys.AVG_ATTENDANCE
    )
    _columns[avgAttendanceIdx].sortOrder =
      tableFilters.sortKey === tableColumnKeys.AVG_ATTENDANCE && columnSortOrder

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
          className: 'avg-score',
          render: (value) =>
            value[testType] ? `${value[testType].avg}%` : '-',
          sorter: true,
          sortOrder:
            tableFilters.sortKey === `avgScore${testType}` && columnSortOrder,
        },
        {
          key: `performance${testType}`,
          title: PerformanceColumnTitle,
          dataIndex: 'performance',
          align: 'left',
          visibleOn: ['browser'],
          className: 'performance-distribution',
          render: (value) => (
            <PerformanceDistribution
              value={value}
              testType={testType}
              isStudentCompareBy={isStudentCompareBy}
              selectedPerformanceBand={selectedPerformanceBand}
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
    title: externalLinkColumnTitle,
    align: 'center',
    fixed: 'right',
    className: 'external-link',
    width: 200,
    render: (value) => {
      const reportUrl =
        selectedCompareBy === compareByKeys.STUDENT
          ? DW_WLR_REPORT_URL
          : DW_MAR_REPORT_URL
      const url = getTableDrillDownUrl(value._id, reportUrl)
      return (
        <Link to={url} target={url}>
          <StyledDiv>
            <IoMdLink className="link" />
          </StyledDiv>
        </Link>
      )
    },
  }

  tableColumns.push(externalLinkColumn)
  return tableColumns
}
