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
  DB_SORT_ORDER_TYPES,
  tableToDBSortOrderMap,
  downloadCSV,
  curateApiFiltersQuery,
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

const getColumnSorter = (tableFilters, setTableFilters, sortKey, sortOrder) => {
  const sortOrderForFilter =
    tableToDBSortOrderMap[sortOrder] || DB_SORT_ORDER_TYPES.DESCEND
  setTableFilters((_tableFilters) => {
    if (
      _tableFilters.sortKey === sortKey &&
      _tableFilters.sortOrder === sortOrderForFilter
    )
      return _tableFilters
    return {
      ..._tableFilters,
      sortKey,
      sortOrder: sortOrderForFilter,
    }
  })
}

export const getTableColumnsFE = ({
  t,
  filters,
  scaleInfo,
  isSharedReport,
  navigationItems,
  summaryMetricInfoWithSkillInfo,
  tableFilters,
  setTableFilters,
  handleOnClickStandard,
}) => {
  const tableColumns = getTableColumns({
    summaryMetricInfoWithSkillInfo,
    scaleInfo,
    compareByKey: tableFilters.compareByKey,
    analyseByKey: tableFilters.analyseByKey,
  })

  // update compare by column
  const compareByColumn = tableColumns.find((c) => c.key === 'dimension')
  compareByColumn.render = (data) => {
    const name = data.name || t('common.anonymous')
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
  }
  compareByColumn.sorter = (a, b, sortOrder) => {
    getColumnSorter(
      tableFilters,
      setTableFilters,
      tableFilters.compareByKey,
      sortOrder
    )
  }

  // update average standard performance column
  const avgStandardPerformanceColumn = tableColumns.find(
    (c) => c.key === 'performance'
  )
  avgStandardPerformanceColumn.title = <AvgStandardPerformanceTitle />
  avgStandardPerformanceColumn.sorter = (a, b, sortOrder) => {
    getColumnSorter(tableFilters, setTableFilters, 'performance', sortOrder)
  }

  // update standard columns
  summaryMetricInfoWithSkillInfo.forEach(
    ({ standardId, standard, performance: standardOverallData }) => {
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

      standardColumn.title = standardsProgressNav ? (
        <Link to={standardsProgressNav}>
          <StandardTitle
            standardName={standard}
            standardOverallPerformance={
              standardOverallPerformance[tableFilters.analyseByKey]
            }
          />
        </Link>
      ) : (
        <StandardTitle
          standardName={standard}
          standardOverallPerformance={
            standardOverallPerformance[tableFilters.analyseByKey]
          }
        />
      )
      standardColumn.render = (data, record) => (
        <StandardColumnCell
          data={data}
          record={record}
          t={t}
          standardId={standardId}
          standardName={standard}
          compareByKey={tableFilters.compareByKey}
          analyseByKey={tableFilters.analyseByKey}
          handleOnClickStandard={handleOnClickStandard}
        />
      )
      standardColumn.sorter = (a, b, sortOrder) =>
        getColumnSorter(tableFilters, setTableFilters, standardId, sortOrder)
    }
  )

  return tableColumns
}

export const onCsvConvert = (data) =>
  downloadCSV(`Standard Grade Book.csv`, data)
