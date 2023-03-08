import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Tooltip } from 'antd'
import next from 'immer'
import { get } from 'lodash'

import { withNamespaces } from '@edulastic/localization'
import { reportUtils } from '@edulastic/constants'
import { IconInfo } from '@edulastic/icons'

import { GradebookTable } from '../styled'
import { ColoredCell } from '../../../../../common/styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import CsvTable from '../../../../../common/components/tables/CsvTable'

const { downloadCSV } = reportUtils.common

const {
  compareByKeys,
  compareByKeyToNameMap,
  analyseByKeyToNameMap,
  getAllAnalyseByPerformanceData,
  getStandardProgressNav,
} = reportUtils.standardsGradebook

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
  if (compareByKey === compareByKeys.STUDENT) {
    onClick = () =>
      handleOnClickStandard({
        standardId,
        standardName,
        studentId: dimensionId,
        studentName: dimensionName,
      })
  }
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
        <ColoredCell bgColor={get(data, 'color')} onClick={onClick}>
          {get(data, analyseByKey) || 'N/A'}
        </ColoredCell>
      )}
    />
  )
}

const StandardsGradebookTable = ({
  t,
  tableData,
  tableColumns,
  filters,
  scaleInfo,
  skillInfo,
  isSharedReport,
  isCsvDownloading,
  navigationItems,
  summaryMetricInfo,
  compareByKey,
  analyseByKey,
  handleOnClickStandard,
}) => {
  const standardIdToIdentifierMap = skillInfo.reduce((res, ele) => {
    res[ele.standardId] = ele.standard
    return res
  }, {})

  const columns = next(tableColumns, (_columns) => {
    // update compare by column
    const compareByColumn = _columns.find((c) => c.key === 'dimension')
    compareByColumn.render = (data) => {
      const name = data.name || t('common.anonymous')
      return compareByKey === compareByKeys.STUDENT && !isSharedReport ? (
        <StudentSummaryProfileLink
          termId={filters.termId}
          studentId={data._id}
          studentName={name}
        />
      ) : (
        name
      )
    }

    // update average standard performance column
    const avgStandardPerformanceColumn = _columns.find(
      (c) => c.key === 'performance'
    )
    avgStandardPerformanceColumn.title = <AvgStandardPerformanceTitle />

    // update standard columns
    summaryMetricInfo.forEach(
      ({ _id: standardId, performance: standardOverallData }) => {
        const standardColumn = _columns.find((c) => c.key == standardId)
        const standardIdentifier = standardIdToIdentifierMap[standardId]
        const standardOverallPerformance = getAllAnalyseByPerformanceData({
          ...standardOverallData,
          scaleInfo,
          useAbbreviation: true,
        })
        const standardProgressNav = !isSharedReport
          ? getStandardProgressNav(navigationItems, standardId, compareByKey)
          : null

        standardColumn.title = standardProgressNav ? (
          <Link to={standardProgressNav}>
            <StandardTitle
              standardName={standardIdentifier}
              standardOverallPerformance={
                standardOverallPerformance[analyseByKey]
              }
            />
          </Link>
        ) : (
          <StandardTitle
            standardName={standardIdentifier}
            standardOverallPerformance={
              standardOverallPerformance[analyseByKey]
            }
          />
        )

        standardColumn.render = getStandardColumnRender({
          t,
          standardId,
          standardName: standardIdentifier,
          compareByKey,
          analyseByKey,
          handleOnClickStandard,
        })
      }
    )
  })

  // x-axis scroll length for visible columns
  const scrollX =
    columns.reduce((count, col) => count + (col.visibleOn ? 0 : 1), 0) * 180 ||
    '100%'

  const onCsvConvert = (data) => downloadCSV(`Standard Grade Book.csv`, data)

  return (
    <CsvTable
      columns={columns}
      dataSource={tableData}
      rowKey={compareByKey}
      tableToRender={GradebookTable}
      onCsvConvert={onCsvConvert}
      isCsvDownloading={isCsvDownloading}
      scroll={{ x: scrollX }}
      pagination={false}
    />
  )
}

export default withNamespaces('student')(StandardsGradebookTable)
