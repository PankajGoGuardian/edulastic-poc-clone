import React from 'react'
import qs from 'qs'
import { get } from 'lodash'
import { Link } from 'react-router-dom'

import { reportUtils, report as reportConstants } from '@edulastic/constants'

import StudentSummaryProfileLink from '../components/table/StudentSummaryProfileLink'
import AvgStandardPerformanceTitle from '../components/table/AvgStandardPerformanceTitle'
import StandardTitle from '../components/table/StandardTitle'
import StandardColumnCell from '../components/table/StandardColumnCell'

const {
  downloadCSV,
  curateApiFiltersQuery,
  dbToTableSortOrderMap,
} = reportUtils.common
const { reportNavType } = reportConstants

const {
  filterSummaryFields,
  sharedSummaryFields,
  filterDetailsFields,
  sharedDetailsFields,
  compareByKeys,
  getAllAnalyseByPerformanceData,
  getTableColumns,
} = reportUtils.standardsGradebook

// common utils
/**
 * @param {string} name
 * @param {string} compareByKey
 * @param {*} t
 * @returns {string}
 */
export function getDimensionName(name, compareByKey, t) {
  const emptyDimensionName = [compareByKeys.STUDENT].includes(compareByKey)
    ? t('common.anonymous')
    : '-'
  return name || emptyDimensionName
}

export const getScaleInfo = ({
  settings,
  sharedReportFilters,
  standardsFilters,
}) => {
  const masteryScales = get(standardsFilters, 'data.result.scaleInfo', [])
  const scaleInfo =
    (
      masteryScales.find(
        (s) =>
          s._id === (sharedReportFilters || settings.requestFilters).profileId
      ) || masteryScales[0]
    )?.scale || []
  return scaleInfo
}

export const getSkillInfoApiQuery = ({ settings }) => {
  const { query } = curateApiFiltersQuery(
    {
      ...settings.requestFilters,
    },
    filterSummaryFields,
    sharedSummaryFields
  )
  return query
}

export const getSummaryApiQuery = ({
  settings,
  ddRequestFilters,
  chartFilters,
}) => {
  const { page: stdPage, pageSize: stdPageSize } = chartFilters
  const { query } = curateApiFiltersQuery(
    {
      ...settings.requestFilters,
      ...ddRequestFilters,
      stdPage,
      stdPageSize,
    },
    filterSummaryFields,
    sharedSummaryFields
  )
  return query
}

export const getDetailsApiQuery = ({
  settings,
  ddRequestFilters,
  chartFilters,
  tableFilters,
}) => {
  const { page: stdPage, pageSize: stdPageSize } = chartFilters
  const {
    compareByKey: compareBy,
    analyseByKey: analyzeBy,
    page: rowPage,
    pageSize: rowPageSize,
    sortKey,
    sortOrder,
  } = tableFilters
  const { query } = curateApiFiltersQuery(
    {
      ...settings.requestFilters,
      ...ddRequestFilters,
      stdPage,
      stdPageSize,
      rowPage,
      rowPageSize,
      compareBy,
      analyzeBy,
      sortKey,
      sortOrder,
      requireTotalCount: rowPage === 1,
    },
    filterDetailsFields,
    sharedDetailsFields
  )
  return query
}

// table utils

const getStandardsProgressNav = (navigationItems, standardId, compareByKey) => {
  const standardsProgressNavLink = navigationItems.find(
    (n) => n.key === reportNavType.STANDARDS_PROGRESS
  )?.location
  if (standardId && standardsProgressNavLink) {
    const [
      standardsProgressNavPrefix,
      standardsProgressNavQuery,
    ] = standardsProgressNavLink.split('?')
    const standardsProgressNavObj = qs.parse(standardsProgressNavQuery, {
      ignoreQueryPrefix: true,
    })
    const _standardsProgressNavObj = { ...standardsProgressNavObj, standardId }
    const _standardsProgressNavQuery = qs.stringify(_standardsProgressNavObj)
    return {
      pathname: standardsProgressNavPrefix,
      search: `?${_standardsProgressNavQuery}`,
      state: {
        standardId,
        compareByKey,
      },
    }
  }
  return null
}

export const getTableColumnsFE = ({
  t,
  filters,
  scaleInfo,
  isSharedReport,
  navigationItems,
  summaryMetricInfoWithSkillInfo,
  tableFilters,
  handleOnClickStandard,
}) => {
  const tableColumns = getTableColumns({
    summaryMetricInfoWithSkillInfo,
    scaleInfo,
    compareByKey: tableFilters.compareByKey,
    analyseByKey: tableFilters.analyseByKey,
  })
  const columnSortOrder = dbToTableSortOrderMap[tableFilters.sortOrder]

  Object.assign(
    tableColumns.find((c) => c.key === 'dimension'),
    {
      render: (data) => {
        const name = getDimensionName(data.name, tableFilters.compareByKey, t)
        return tableFilters.compareByKey === compareByKeys.STUDENT &&
          !isSharedReport ? (
          <StudentSummaryProfileLink
            termId={filters.termId}
            studentId={data._id}
            studentName={name}
          />
        ) : (
          name
        )
      },
      sorter: true,
      sortOrder:
        tableFilters.sortKey === tableFilters.compareByKey && columnSortOrder,
    }
  )

  Object.assign(
    tableColumns.find((c) => c.key === 'performance'),
    {
      title: <AvgStandardPerformanceTitle />,
      sorter: true,
      sortOrder: tableFilters.sortKey === 'performance' && columnSortOrder,
    }
  )

  summaryMetricInfoWithSkillInfo.forEach(
    ({
      standardId,
      standard,
      standardName: standardDesc,
      performance: standardOverallData,
    }) => {
      const standardColumn = tableColumns.find((c) => c.key == standardId)
      const standardOverallPerformance = getAllAnalyseByPerformanceData({
        ...standardOverallData,
        scaleInfo,
        useAbbreviation: true,
      })
      const standardsProgressNav = !isSharedReport
        ? getStandardsProgressNav(
            navigationItems,
            standardId,
            tableFilters.compareByKey
          )
        : null
      Object.assign(standardColumn, {
        title: standardsProgressNav ? (
          <Link to={standardsProgressNav}>
            <StandardTitle
              standardName={standard}
              standardDesc={standardDesc}
              standardOverallPerformance={
                standardOverallPerformance[tableFilters.analyseByKey]
              }
            />
          </Link>
        ) : (
          <StandardTitle
            standardName={standard}
            standardDesc={standardDesc}
            standardOverallPerformance={
              standardOverallPerformance[tableFilters.analyseByKey]
            }
          />
        ),
        render: (data, record) => (
          <StandardColumnCell
            data={data}
            record={record}
            t={t}
            standardId={standardId}
            standardName={standard}
            standardDesc={standardDesc}
            compareByKey={tableFilters.compareByKey}
            analyseByKey={tableFilters.analyseByKey}
            handleOnClickStandard={handleOnClickStandard}
          />
        ),
        sorter: true,
        sortOrder: tableFilters.sortKey === standardId && columnSortOrder,
      })
    }
  )

  return tableColumns
}

export const onCsvConvert = (data) =>
  downloadCSV(`Standard Grade Book.csv`, data)
