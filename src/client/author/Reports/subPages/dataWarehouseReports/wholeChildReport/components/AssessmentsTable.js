import React, { useMemo } from 'react'
import next from 'immer'
import { Link } from 'react-router-dom'

import { Row } from 'antd'
import CsvTable from '../../../../common/components/tables/CsvTable'
import {
  StyledTag,
  CustomStyledTable,
  AssementNameContainer,
  TableContainer,
} from '../common/styled'

import { tableColumnsData } from '../utils'
import LargeTag from './LargeTag'

const getTableColumns = (isSharedReport) => {
  return next(tableColumnsData, (_columns) => {
    // link to LCB for testName
    const testNameIdx = _columns.findIndex((col) => col.key === 'testName')
    _columns[testNameIdx].render = (testName, record) => (
      <AssementNameContainer>
        <span>
          {!isSharedReport && !record.externalTestType ? (
            <Link
              to={`/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`}
              data-testid="testName"
            >
              {testName}
            </Link>
          ) : (
            testName
          )}
        </span>
        {record.externalTestType ? (
          <StyledTag color="black">{record.externalTestType}</StyledTag>
        ) : null}
      </AssementNameContainer>
    )
    // render rectangular tag for performance
    const averageScoreIdx = _columns.findIndex(
      (col) => col.key === 'averageScore'
    )
    _columns[averageScoreIdx].render = (averageScore, record) =>
      !record.externalTestType ? (
        <Row type="flex" justify="center">
          <LargeTag
            tooltipPlacement="topLeft"
            tooltipText={record.band.name}
            leftText={record.band.name}
            rightText={`${Math.round(averageScore)}%`}
            background={record.band.color}
          />
        </Row>
      ) : (
        record.totalScore
      )
    // render performance level in CSV
    const performanceLevelIdx = _columns.findIndex(
      (col) => col.key === 'performanceLevel'
    )
    _columns[performanceLevelIdx].render = (_, record) =>
      // TODO: replace dash with correct band label for performance in external test
      !record.externalTestType ? record.band.name : '-'
    // render performance score in CSV
    const performanceScoreIdx = _columns.findIndex(
      (col) => col.key === 'performanceScore'
    )
    _columns[performanceScoreIdx].render = (_, record) =>
      !record.externalTestType
        ? `${Math.round(record.averageScore)}%`
        : record.totalScore
    // render value with percentage for averages of internal tests
    const districtAvgIdx = _columns.findIndex(
      (col) => col.key === 'districtAvg'
    )
    _columns[districtAvgIdx].render = (districtAvg, record) =>
      !record.externalTestType ? `${districtAvg}%` : districtAvg
    const schoolAvgIdx = _columns.findIndex((col) => col.key === 'schoolAvg')
    _columns[schoolAvgIdx].render = (schoolAvg, record) =>
      !record.externalTestType ? `${schoolAvg}%` : schoolAvg
    const groupAvgIdx = _columns.findIndex((col) => col.key === 'groupAvg')
    _columns[groupAvgIdx].render = (groupAvg, record) =>
      !record.externalTestType ? `${groupAvg}%` : groupAvg
    // render array of rectangular tags for claims
    const claimsInfoIdx = _columns.findIndex((col) => col.key === 'claimsInfo')
    _columns[claimsInfoIdx].render = (claimsInfo) => (
      <Row
        type="flex"
        justify="center"
        style={{ gap: '8px', flexWrap: 'nowrap' }}
      >
        {(claimsInfo || []).map((claim) => (
          <LargeTag
            leftText={claim.name}
            rightText={claim.value}
            background={claim.color}
            key={claim.id}
          />
        ))}
      </Row>
    )
  })
}

const AssessmentsTable = ({
  tableData,
  onCsvConvert,
  isCsvDownloading,
  isSharedReport,
}) => {
  const tableColumns = useMemo(() => getTableColumns(isSharedReport), [
    isSharedReport,
  ])
  return (
    <TableContainer>
      <CsvTable
        dataSource={tableData}
        columns={tableColumns}
        tableToRender={CustomStyledTable}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
      />
    </TableContainer>
  )
}

export default AssessmentsTable
