import React from 'react'
import qs from 'qs'
import { get } from 'lodash'
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'

import { reportUtils, report as reportConstants } from '@edulastic/constants'

import { CustomTableTooltip } from '../../../../common/components/customTableTooltip'
import { ColoredCell } from '../../../../common/styled'
import StudentSummaryProfileLink from '../components/table/StudentSummaryProfileLink'
import AvgStandardPerformanceTitle from '../components/table/AvgStandardPerformanceTitle'
import StandardTitle from '../components/table/StandardTitle'

const { downloadCSV } = reportUtils.common
const { reportNavType } = reportConstants

const {
  compareByKeys,
  compareByKeyToNameMap,
  analyseByKeys,
  analyseByKeyToNameMap,
  getAllAnalyseByPerformanceData,
  getTableColumns,
} = reportUtils.standardsGradebook

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

const getStandardColumnRender = ({
  t,
  standardId,
  standardName,
  compareByKey,
  analyseByKey,
  handleOnClickStandard,
}) => (data, record) => {
  const { dimension } = record
  const dimensionId = dimension._id
  const dimensionName = dimension.name || t('common.anonymous')
  let onClick = null
  const valueToRender = get(data, analyseByKey)
  if (compareByKey === compareByKeys.STUDENT && valueToRender) {
    onClick = () =>
      handleOnClickStandard({
        standardId,
        standardName,
        studentId: dimensionId,
        studentName: dimensionName,
      })
  }
  const cellColor =
    analyseByKey === analyseByKeys.MASTERY_SCORE ||
    analyseByKey === analyseByKeys.MASTERY_LEVEL
      ? get(data, 'color')
      : ''
  return (
    <CustomTableTooltip
      placement="top"
      title={
        <div>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">
              {compareByKeyToNameMap[compareByKey]}:{' '}
            </Col>
            <Col className="custom-table-tooltip-value">{dimensionName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Standard: </Col>
            <Col className="custom-table-tooltip-value">{standardName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">
              {analyseByKeyToNameMap[analyseByKey]}:{' '}
            </Col>
            <Col className="custom-table-tooltip-value">
              {get(data, analyseByKey) || 'N/A'}
            </Col>
          </Row>
        </div>
      }
      getCellContents={() => (
        <ColoredCell bgColor={cellColor} onClick={onClick}>
          {get(data, analyseByKey) || 'N/A'}
        </ColoredCell>
      )}
    />
  )
}

const getColumnSorter = (tableFilters, setTableFilters, sortKey, sortOrder) => {
  const sortOrderForFilter = sortOrder === 'ascend' ? 'asc' : 'desc'
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
      standardColumn.render = getStandardColumnRender({
        t,
        standardId,
        standardName: standard,
        compareByKey: tableFilters.compareByKey,
        analyseByKey: tableFilters.analyseByKey,
        handleOnClickStandard,
      })
      standardColumn.sorter = (a, b, sortOrder) =>
        getColumnSorter(tableFilters, setTableFilters, standardId, sortOrder)
    }
  )

  return tableColumns
}

export const onCsvConvert = (data) =>
  downloadCSV(`Standard Grade Book.csv`, data)
