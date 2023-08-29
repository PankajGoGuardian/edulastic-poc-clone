import React from 'react'
import { isEmpty } from 'lodash'
import qs from 'qs'
import { Link } from 'react-router-dom'

import { reportUtils } from '@edulastic/constants'
import TableTooltipRow from '../../../../common/components/tooltip/TableTooltipRow'
import { CustomTableTooltip } from '../../../../common/components/customTableTooltip'
import { ColoredCell } from '../../../../common/styled'
import { getSelectedStandardId } from '../../utils'

const { curateApiFiltersQuery } = reportUtils.common
const {
  SortKeys,
  SortOrdersMap,
  CompareByKeys,
  AnalyseByKeys,
  SharedSummaryFields,
  FilterSummaryFields,
  SharedDetailsFields,
  FilterDetailsFields,
  getTableColumns,
  getMasteryScoreColor,
  getAnalyzeByRenderData,
} = reportUtils.standardsProgress

/**
 * Function to get standard id and testIds
 * @param {Object} skillInfoMetrics - contains standards info.
 * @param {Object} requestFilters - contains popup / page level filter details.
 * @param {Object[]} paginatedTestInfoMetrics - paginated test info metrics for which the report data is to be fetched.
 * @returns {Object} { standardId, testIds }
 */
const getCommonParams = (
  skillInfoMetrics,
  requestFilters,
  paginatedTestInfoMetrics
) => {
  const standardId = getSelectedStandardId(skillInfoMetrics, requestFilters)
  const testIds = paginatedTestInfoMetrics.map(({ testId }) => testId).join(',')
  return {
    standardId,
    testIds,
  }
}

export const getSkillInfoApiQuery = (requestFilters) => {
  const { query } = curateApiFiltersQuery(
    {
      ...requestFilters,
    },
    FilterSummaryFields,
    SharedSummaryFields
  )
  return query
}

export const getTestInfoApiQuery = (
  requestFilters,
  ddRequestFilters,
  skillInfoMetrics
) => {
  if (isEmpty(skillInfoMetrics)) return {}
  const standardId = getSelectedStandardId(skillInfoMetrics, requestFilters)
  const { query } = curateApiFiltersQuery(
    {
      ...requestFilters,
      ...ddRequestFilters,
      standardId,
    },
    FilterSummaryFields,
    SharedSummaryFields
  )
  return query
}

export const getSummaryApiQuery = (
  requestFilters,
  ddRequestFilters,
  skillInfoMetrics,
  paginatedTestInfoMetrics
) => {
  if (isEmpty(paginatedTestInfoMetrics)) return {}
  const { standardId, testIds } = getCommonParams(
    skillInfoMetrics,
    requestFilters,
    paginatedTestInfoMetrics
  )
  const { query } = curateApiFiltersQuery(
    {
      ...requestFilters,
      ...ddRequestFilters,
      testIds,
      standardId,
    },
    FilterSummaryFields,
    SharedSummaryFields
  )
  return query
}

export const getDetailsApiQuery = (
  requestFilters,
  ddRequestFilters,
  tableFilters,
  skillInfoMetrics,
  paginatedTestInfoMetrics
) => {
  if (isEmpty(paginatedTestInfoMetrics)) return {}
  const { rowPage, rowPageSize, compareBy, analyseBy } = tableFilters
  const { standardId, testIds } = getCommonParams(
    skillInfoMetrics,
    requestFilters,
    paginatedTestInfoMetrics
  )
  const { query } = curateApiFiltersQuery(
    {
      ...requestFilters,
      ...ddRequestFilters,
      testIds,
      rowPage,
      rowPageSize,
      compareBy: compareBy.key,
      analyzeBy: analyseBy.key,
      sortKey: tableFilters.sortKey,
      sortOrder: SortOrdersMap[tableFilters.sortOrder],
      standardId,
      requireTotalCount: true,
    },
    FilterDetailsFields,
    SharedDetailsFields
  )
  return query
}

/**
 * Generates table columns for rendering table in the UI
 * @param {Object[]} chartMetrics - contains chart metrics curated from test info and summary
 * @param {Object} masteryScale - contains selected scale info
 * @param {Object} tableFilters - contains table filters
 * @param {Object} filters - contains report popup filters
 * @param {Boolean} isSharedReport - whether the report is shared report or not
 * @returns {Object[]} Table columns strucutred as per antd Table
 */
export const getTableColumnsFE = (
  chartMetrics,
  masteryScale,
  tableFilters,
  filters,
  isSharedReport
) => {
  const { key: compareByKey, title: compareByTitle } = tableFilters.compareBy
  const { key: analyseByKey, title: analyseByTitle } = tableFilters.analyseBy
  const tableColumns = getTableColumns(
    chartMetrics,
    masteryScale,
    compareByKey,
    analyseByKey
  )

  const dimensionCol = tableColumns.find((c) => c.key === SortKeys.DIMENSION)
  dimensionCol.render = (data) => {
    const { name } = data
    const { termId, grades, subjects, classIds, courseId } = filters
    const queryStr = qs.stringify({
      termId,
      grades,
      subjects,
      classIds,
      courseIds: courseId,
    })
    const renderName = name || '-'
    return !isSharedReport && compareByKey === CompareByKeys.STUDENT ? (
      <Link
        to={`/author/reports/student-progress-profile/student/${data._id}?${queryStr}`}
      >
        {renderName}
      </Link>
    ) : (
      renderName
    )
  }

  chartMetrics.forEach((test) => {
    const testColumn = tableColumns.find(({ key }) => key == test.testId)
    testColumn.title = (
      <>
        <span>{test.testName}</span>
        <br />
        <span>{getAnalyzeByRenderData(test, analyseByKey, masteryScale)}</span>
      </>
    )
    testColumn.render = (data, record) => {
      const renderData = getAnalyzeByRenderData(
        data,
        analyseByKey,
        masteryScale
      )
      const bgColor =
        analyseByKey === AnalyseByKeys.MASTERY_SCORE ||
        analyseByKey === AnalyseByKeys.MASTERY_LEVEL
          ? getMasteryScoreColor(data, masteryScale)
          : null
      const toolTipText = (
        <div>
          <TableTooltipRow
            title={`${compareByTitle}: `}
            value={record.dimension.name || '-'}
          />
          <TableTooltipRow title="Test: " value={test.testName} />
          <TableTooltipRow title={`${analyseByTitle}: `} value={renderData} />
        </div>
      )
      return (
        <CustomTableTooltip
          placement="top"
          title={toolTipText}
          getCellContents={() =>
            renderData !== 'N/A' ? (
              <ColoredCell bgColor={bgColor}>{renderData}</ColoredCell>
            ) : (
              renderData
            )
          }
        />
      )
    }
  })

  tableColumns.forEach((item) => {
    if (item.key === tableFilters.sortKey) {
      Object.assign(item, { sortOrder: tableFilters.sortOrder })
    }
  })

  return tableColumns
}

/**
 * Checks and returns if the report data is empty or not
 * @param {Object[]} skillInfoMetrics - The standards details for the selected curriculum
 * @param {Object[]} testInfoMetrics - The test details for all the tests / selected tests as per selected filters for the report.
 * @param {Object[]} summary - The metrics info to be rendered in chart
 * @param {Object[]} details - The metrics info to be rendered in table
 * @returns {Boolean} Whether report data is empty or not
 */
export const getIsReportDataEmpty = (
  skillInfoMetrics,
  testInfoMetrics,
  summary,
  details
) => {
  const isSkillInfoEmpty = isEmpty(skillInfoMetrics)
  const isSummaryEmpty = isEmpty(summary) || isEmpty(summary.metrics)
  const isDetailsEmpty = isEmpty(details) || isEmpty(details.metrics)
  const isTestInfoEmpty = isEmpty(testInfoMetrics)
  return [
    isSkillInfoEmpty,
    isSummaryEmpty,
    isDetailsEmpty,
    isTestInfoEmpty,
  ].some(Boolean)
}

/**
 * Generates and returns backend csv download API params
 * @param {Object} settings - The selected filters for the report.
 * @param {Object} ddRequestFilters - The selected demographic filters for the report.
 * @param {Object} tableFilters - The pagination and page level filters for table.
 * @param {Object[]} skillInfoMetrics - The standards details for the selected curriculum
 * @param {Object} reportTypes - The report names / routes constants
 * @returns {Object} The params for backend download csv API
 */
export const getGenerateCsvParams = (
  settings,
  ddRequestFilters,
  tableFilters,
  skillInfoMetrics,
  reportTypes
) => {
  const standardId = getSelectedStandardId(
    skillInfoMetrics,
    settings.requestFilters
  )
  const { compareBy, analyseBy, sortKey, sortOrder } = tableFilters
  const { query } = curateApiFiltersQuery(
    {
      ...settings.requestFilters,
      ...ddRequestFilters,
      standardId,
      compareBy: compareBy.key,
      analyzeBy: analyseBy.key,
      sortKey,
      sortOrder: SortOrdersMap[sortOrder],
      requireTotalCount: true,
    },
    FilterDetailsFields,
    SharedDetailsFields
  )
  return {
    reportType: reportTypes.reportNavType.STANDARDS_PROGRESS,
    reportFilters: query,
  }
}

/**
 * Generates paginated test info required for summary and details API
 * @param {Object[]} testInfoMetrics - The test details for all the tests / selected tests as per selected filters for the report.
 * @param {Object[]} chartFilters - The chart pagination filters.
 * @returns {Object[]} Paginated test details based on chart page and chart page size.
 */
export const getPaginatedTestInfoMetrics = (testInfoMetrics, chartFilters) => {
  const { barPage, barPageSize } = chartFilters
  const testOffset = (barPage - 1) * barPageSize
  return barPage
    ? testInfoMetrics.slice(testOffset, testOffset + barPageSize)
    : []
}
