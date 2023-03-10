import React from 'react'
import qs from 'qs'
import { get } from 'lodash'
import { Link } from 'react-router-dom'
import { Tooltip, Row, Col } from 'antd'

import { IconInfo } from '@edulastic/icons'
import { reportUtils } from '@edulastic/constants'
import { CustomTableTooltip } from '../../../../common/components/customTableTooltip'
import { ColoredCell } from '../../../../common/styled'

const { downloadCSV } = reportUtils.common

const {
  compareByKeys,
  compareByKeyToNameMap,
  analyseByKeyToNameMap,
  getAllAnalyseByPerformanceData,
  getTableColumns,
} = reportUtils.standardsGradebook

// table utils

const getStandardProgressNav = (navigationItems, standardId, compareByKey) => {
  const standardsProgressNavLink = navigationItems.find(
    (n) => n.key === 'standards-progress'
  )?.location
  if (standardId && standardsProgressNavLink) {
    const [
      standardsProgressNavPrefix,
      standardsProgressNavQuery,
    ] = standardsProgressNavLink.split('?')
    const standardsProgressNavObj = qs.parse(standardsProgressNavQuery, {
      ignoreQueryPrefix: true,
    })
    const gradebookToProgressCompareByKey = {
      schoolId: 'school',
      teacherId: 'teacher',
      studentId: 'student',
      groupId: 'class',
    }
    const _standardsProgressNavObj = { ...standardsProgressNavObj, standardId }
    const _standardsProgressNavQuery = qs.stringify(_standardsProgressNavObj)
    return {
      pathname: standardsProgressNavPrefix,
      search: `?${_standardsProgressNavQuery}`,
      state: {
        standardId,
        compareByKey:
          gradebookToProgressCompareByKey[compareByKey] || compareByKey,
      },
    }
  }
  return null
}

const AvgStandardPerformanceTitle = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <span>Avg. Standard Performance</span>
    <Tooltip title="This is the average performance across all the standards assessed">
      <IconInfo height={10} />
    </Tooltip>
  </div>
)

const StudentSummaryProfileLink = ({ termId, studentId, studentName }) => (
  <Link
    to={`/author/reports/student-profile-summary/student/${studentId}?termId=${termId}`}
  >
    {studentName}
  </Link>
)

const StandardTitle = ({ standardName, standardOverallPerformance }) => (
  <>
    <span>{standardName}</span>
    <br />
    <span>{standardOverallPerformance}</span>
  </>
)

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
    analyseByKey === 'masteryLevel' || analyseByKey === 'masteryScore'
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
  chartDataWithStandardInfo,
  tableFilters,
  setTableFilters,
  handleOnClickStandard,
}) => {
  const tableColumns = getTableColumns({
    chartDataWithStandardInfo,
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
  chartDataWithStandardInfo.forEach(
    ({ standardId, standard, performance: standardOverallData }) => {
      const standardColumn = tableColumns.find((c) => c.key == standardId)
      const standardOverallPerformance = getAllAnalyseByPerformanceData({
        ...standardOverallData,
        scaleInfo,
        useAbbreviation: true,
      })
      const standardProgressNav = !isSharedReport
        ? getStandardProgressNav(
            navigationItems,
            standardId,
            tableFilters.compareByKey
          )
        : null

      standardColumn.title = standardProgressNav ? (
        <Link to={standardProgressNav}>
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
