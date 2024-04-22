import React from 'react'
import { Link } from 'react-router-dom'
import { groupBy, mapValues, keyBy, omit } from 'lodash'
import { roleuser, reportUtils } from '@edulastic/constants'
import { IconEye } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import EllipsisTextWithTooltip from '../common/components/EllipsisTextWithTooltip'
import LinkCell from '../../dataWarehouseReports/common/components/LinkCell'
import StatusCsvDownload from './components/table/StatusCsvDownload'
import CopyReportLink from './components/table/CopyReportLink'
import { getCompletionReportPathForAssignment } from '../../../../Assignments/components/ActionMenu/ActionMenu'
import { buildDrillDownUrl } from '../../dataWarehouseReports/common/utils'

import { sortKey, utastatus } from '../common/utils/constants'

const {
  getCellValue,
  getTableColumnsBE,
  isAnalyseByPercentage,
} = reportUtils.completionReport

export const sortKeys = {
  COMPARE_BY: 'compareBy',
}

export const tableColumnsData = [
  {
    dataIndex: sortKeys.COMPARE_BY,
    key: sortKeys.COMPARE_BY,
    fixed: 'left',
    width: 250,
  },
]
export const compareByKeys = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
}

const compareByOptionsInfo = {
  [compareByKeys.SCHOOL]: { key: 'schoolId', name: 'schoolName' },
  [compareByKeys.TEACHER]: { key: 'teacherId', name: 'teacherName' },
  [compareByKeys.CLASS]: { key: 'groupId', name: 'groupName' },
}

export const compareByMap = mapValues(compareByOptionsInfo, ({ name }) => name)

export const getTableDataSource = (data) => {
  const groupedData = groupBy(data, 'testId')
  return Object.values(groupedData).flatMap((tests) => {
    const rowSpan = tests.length
    return tests.map((test, index) => ({ index, rowSpan, ...test }))
  })
}

// Table utils
const getShowStatusCellHyperLink = (value) =>
  !(value === '0' || value === 0 || value === '0%')
export const getTableColumnFE = ({
  compareBy,
  districtId,
  isSharedReport,
  role,
  handleDownloadCsv,
  csvDownloadLoadingState,
  analyseBy,
  settings,
}) => {
  const columns = getTableColumnsBE(compareBy)
  const columnsMap = keyBy(columns, 'key')
  const { SCHOOL, TEACHER } = compareByKeys

  // ****** Test name column start *****
  const testNameColumn = columnsMap.testName
  testNameColumn.sorter = true
  testNameColumn.render = (text, record) => {
    let path = '/author/assignments'
    if ([roleuser.DISTRICT_ADMIN, roleuser.SCHOOL_ADMIN].includes(role)) {
      path = `${path}/${districtId}/${record.testId}`
    }
    const testName = record.index === 0 ? record.testName : ''
    return testName !== 'Overall' && !isSharedReport ? (
      <LinkCell value={{ _id: record.testId, name: testName }} url={path} />
    ) : (
      <EllipsisTextWithTooltip toolTipMsg={testName} text={testName} />
    )
  }
  // ****** Test name column end *****

  // ******* Compare By Column start ********
  const compareByColumn = columnsMap.compareBy
  compareByColumn.render = (data, record) => {
    const url = isSharedReport
      ? null
      : buildDrillDownUrl({
          key: record.dimensionId,
          selectedCompareBy: compareBy.key,
          reportFilters: {
            ...settings.requestFilters,
            ...{ testIds: record.testId },
          },
          reportUrl: window.location.pathname,
        })
    if ([SCHOOL, TEACHER].includes(compareBy.key) && !isSharedReport) {
      return (
        <LinkCell
          value={{ _id: record.dimensionId, name: record.dimensionName }}
          url={url}
          showLink
        />
      )
    }
    return (
      <EllipsisTextWithTooltip
        toolTipMsg={record.dimensionName}
        text={record.dimensionName}
      />
    )
  }

  // ******* Compare By Column end ********
  const modifyColumnByStatus = (key, progressStatus, progressName) => {
    const column = columnsMap[key]
    const isAnalyseByPercent = isAnalyseByPercentage(analyseBy)
    column.sorter = key === 'assigned' || !isAnalyseByPercent
    column.render = (value, record, index) => {
      const cellValue =
        key === 'assigned'
          ? value
          : getCellValue(value, record?.assigned, analyseBy)
      return (
        <StatusCsvDownload
          record={record}
          handleDownloadCsv={handleDownloadCsv}
          csvDownloadLoadingState={csvDownloadLoadingState}
          progressStatus={progressStatus}
          progressName={progressName}
          index={index}
          showStatusCellHyperLink={getShowStatusCellHyperLink(cellValue)}
        >
          {cellValue}
        </StatusCsvDownload>
      )
    }
  }

  modifyColumnByStatus('assigned', utastatus.ASSIGNED, sortKey.ASSIGNED)
  modifyColumnByStatus('notOpen', utastatus.NOT_OPEN, sortKey.NOT_OPEN)
  modifyColumnByStatus('absent', utastatus.ABSENT, sortKey.ABSENT)
  modifyColumnByStatus('notStarted', utastatus.NOT_STARTED, sortKey.NOT_STARTED)
  modifyColumnByStatus('inProgress', utastatus.IN_PROGRESS, sortKey.IN_PROGRESS)
  modifyColumnByStatus('submitted', utastatus.SUBMITTED, sortKey.SUBMITTED)
  modifyColumnByStatus('graded', utastatus.GRADED, sortKey.GRADED)

  // View performance column
  const viewPerformance = {
    title: 'VIEW PERFORMANCE',
    key: 'performance',
    align: 'center',
    render: (text, record) => {
      const reportPath =
        record.testName === 'Overall'
          ? 'performance-over-time'
          : `peer-performance/test/${record.testId}`
      return (
        <Link
          to={`/author/reports/${reportPath}${getCompletionReportPathForAssignment(
            record.testId,
            {},
            [record],
            settings?.requestFilters,
            compareBy
          )}`}
          target="_blank"
        >
          <IconEye color={themeColor} width={18} height={18} />
        </Link>
      )
    },
  }

  // ********** Copy Link *********
  const copyLink = {
    title: 'Copy REPORT LINK TO SHARE',
    key: 'copyReportLink',
    align: 'center',
    render: (text, record) => {
      const filtersSetting = isSharedReport
        ? omit(settings?.requestFilters, ['reportId', 'showApply'])
        : settings?.requestFilters
      return (
        <CopyReportLink
          report={record}
          filterSettings={filtersSetting || {}}
          compareBy={compareBy}
        />
      )
    },
  }

  return [...columns, viewPerformance, copyLink]
}
