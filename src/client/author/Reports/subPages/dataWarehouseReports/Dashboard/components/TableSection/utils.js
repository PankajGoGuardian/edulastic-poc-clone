import React from 'react'
import next from 'immer'
import { isEmpty, map, maxBy, sumBy } from 'lodash'
import {
  downloadCSV,
  percentage,
  dbToTableSortOrderMap,
} from '@edulastic/constants/reportUtils/common'
import { Link } from 'react-router-dom'
import { IoMdLink } from 'react-icons/io'
import { EduIf } from '@edulastic/common'
import { getScoreLabel } from '@edulastic/constants/const/dataWarehouse'
import { districtAvgDimension, tableFilterTypes } from '../../utils'
import TestColumnTitle from './TestColumnTitle'
import { DW_MAR_REPORT_URL } from '../../../../../common/constants/dataWarehouseReports'
import { StyledDiv } from '../common/styledComponents'
import LinkCell from '../../../common/components/LinkCell'
import PerformanceDistribution from './PerformanceDistribution'

const tableColumnKeys = {
  DIMENSION: 'dimension',
  AVG_ATTENDANCE: 'avgAttendance',
  TOTAL_ABSENCE: 'totalAbsence',
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
  {
    dataIndex: 'totalAbsence',
    key: tableColumnKeys.TOTAL_ABSENCE,
    title: 'TOTAL ABSENCE',
    align: 'center',
    width: 200,
    className: 'avg-attendance',
    render: (value) => value || '-',
    sorter: true,
  },
  // next up are dynamic columns for each assessment type
]

export const onCsvConvert = (data) =>
  downloadCSV(`Data Warehouse - Dashboard Report.csv`, data)

export const getHorizontalBarData = (
  data,
  selectedPerformanceBand,
  bandKey
) => {
  if (isEmpty(data) || isEmpty(selectedPerformanceBand)) return []

  const totalStudents = sumBy(data, 'totalStudents')
  const barData = data
    .map((d) => {
      const band = selectedPerformanceBand.find(
        (pb) => pb[bandKey] === d.bandScore
      )
      return {
        value: percentage(d.totalStudents, totalStudents, true),
        color: band?.color,
        rank: band?.[bandKey],
      }
    })
    .sort((a, b) => a.rank - b.rank)
  return barData
}
export const getTableColumns = ({
  metricInfo,
  tableFilters,
  isStudentCompareBy,
  getTableDrillDownUrl,
  selectedPerformanceBand,
  availableTestTypes,
  useAttendanceAbsence,
}) => {
  if (isEmpty(metricInfo)) return []
  const columnSortOrder = dbToTableSortOrderMap[tableFilters.sortOrder]

  const rowWithMaxTestTypes = maxBy(
    metricInfo,
    (row) => Object.keys(row.performance).length
  )
  const testTypesWithData = Object.keys(rowWithMaxTestTypes?.performance || {})
  const orderedTestTypesWithData = availableTestTypes.filter(({ key }) =>
    testTypesWithData.includes(key)
  )

  const PerformanceColumnTitle = isStudentCompareBy
    ? 'PERFORMANCE BAND'
    : 'PERFORMANCE DISTRIBUTION'
  const externalLinkColumnTitle = isStudentCompareBy
    ? 'WHOLE LEARNER'
    : 'PERFORMANCE TRENDS'

  let tableColumns = next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex(
      (col) => col.key === tableColumnKeys.DIMENSION
    )
    _columns[compareByIdx].title =
      tableFilters[tableFilterTypes.COMPARE_BY].title
    _columns[compareByIdx].align = 'left'
    _columns[compareByIdx].render = (value) => {
      const url =
        value !== districtAvgDimension ? getTableDrillDownUrl(value._id) : null
      return (
        <LinkCell value={value} url={url} openNewTab={isStudentCompareBy} />
      )
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

    const totalAbsenceIdx = _columns.findIndex(
      (col) => col.key === tableColumnKeys.TOTAL_ABSENCE
    )
    _columns[totalAbsenceIdx].sortOrder =
      tableFilters.sortKey === tableColumnKeys.TOTAL_ABSENCE && columnSortOrder

    // dynamic columns
    const testTypesBasedColumns = map(
      orderedTestTypesWithData,
      ({
        key: testTypeKey,
        title: testTypeTitle,
        bands: columnPerformanceBand,
        externalTestType,
      }) => {
        const isExternal = !!externalTestType
        const testBand = isExternal
          ? columnPerformanceBand
          : selectedPerformanceBand

        return {
          title: (
            <TestColumnTitle testType={testTypeTitle} isExternal={isExternal} />
          ),
          align: 'left',
          className: 'test-type',
          children: [
            {
              key: `avgScore__${testTypeKey}`,
              title: 'Avg. Score',
              dataIndex: 'performance',
              align: 'center',
              width: 150,
              visibleOn: ['browser'],
              className: 'avg-score',
              render: (value) => {
                const scoreLabel = value[testTypeKey]
                  ? getScoreLabel(value[testTypeKey].avgScore, {
                      externalTestType,
                    })
                  : '-'
                return scoreLabel
              },
              sorter: true,
              sortOrder:
                tableFilters.sortKey === `avgScore__${testTypeKey}` &&
                columnSortOrder,
            },
            {
              key: `performance__${testTypeKey}`,
              title: PerformanceColumnTitle,
              dataIndex: 'performance',
              align: 'left',
              visibleOn: ['browser'],
              className: 'performance-distribution',
              render: (value, record) => {
                const isDistrictAvgDimension =
                  record[tableColumnKeys.DIMENSION] === districtAvgDimension
                return (
                  <PerformanceDistribution
                    value={value}
                    testType={testTypeKey}
                    isStudentCompareBy={isStudentCompareBy}
                    isDistrictAvgDimension={isDistrictAvgDimension}
                    selectedPerformanceBand={testBand}
                    isExternal={isExternal}
                  />
                )
              },
            },
          ],
        }
      }
    )
    _columns.push(...testTypesBasedColumns)
  })

  // external link column
  const externalLinkColumn = {
    dataIndex: 'dimension',
    key: 'link',
    title: externalLinkColumnTitle,
    align: 'center',
    className: 'external-link',
    width: 200,
    render: (value) => {
      const isDistrictAvgDimension = value === districtAvgDimension
      const url = getTableDrillDownUrl(
        value._id,
        DW_MAR_REPORT_URL,
        isDistrictAvgDimension
      )
      return (
        <EduIf condition={!!url}>
          <Link to={url} target="_blank">
            <StyledDiv>
              <IoMdLink className="link" />
            </StyledDiv>
          </Link>
        </EduIf>
      )
    },
  }
  tableColumns.push(externalLinkColumn)
  if (useAttendanceAbsence) {
    tableColumns = tableColumns.filter(
      (col) => col.key !== tableColumnKeys.AVG_ATTENDANCE
    )
  } else {
    tableColumns = tableColumns.filter(
      (col) => col.key !== tableColumnKeys.TOTAL_ABSENCE
    )
  }
  return tableColumns
}
