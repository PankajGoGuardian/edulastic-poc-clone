import React, { useMemo } from 'react'
import next from 'immer'
import { Link } from 'react-router-dom'

import { Row, Tooltip } from 'antd'
import { isEmpty, uniq } from 'lodash'
import { themeColor } from '@edulastic/colors'
import CsvTable from '../../../../common/components/tables/CsvTable'
import {
  StyledTag,
  CustomStyledTable,
  TableContainer,
  AssessmentName,
} from '../../common/components/styledComponents'

import { tableColumnsData } from '../utils'
import LargeTag from '../../common/components/LargeTag'
import { AssessmentNameContainer } from '../common/styled'
import SectionLabel from '../../../../common/components/SectionLabel'

const getTableColumns = (isSharedReport) => {
  return next(tableColumnsData, (_columns) => {
    // link to LCB for testName
    const testNameIdx = _columns.findIndex((col) => col.key === 'testName')
    _columns[testNameIdx].render = (testName, record) => {
      const testTitle = testName || '-'
      // space is added after test title so that for external test,
      // there is a space between test title and test tag
      const testTitleElement = (
        <Tooltip placement="right" title={testTitle}>
          {`${testTitle} `}
        </Tooltip>
      )
      return (
        <AssessmentNameContainer>
          <div className="test-name-container">
            {!isSharedReport && !record.externalTestType ? (
              <Link
                to={`/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`}
                data-testid="testName"
              >
                <AssessmentName color={themeColor}>
                  {testTitleElement}
                </AssessmentName>
              </Link>
            ) : (
              testTitleElement
            )}
          </div>
          {record.externalTestType ? (
            <StyledTag color="black">{record.externalTestType}</StyledTag>
          ) : null}
        </AssessmentNameContainer>
      )
    }
    // render rectangular tag for performance
    const averageScoreIdx = _columns.findIndex(
      (col) => col.key === 'averageScore'
    )
    _columns[averageScoreIdx].render = (averageScore, record) => (
      <Row type="flex" justify="center">
        {!record.externalTestType ? (
          <LargeTag
            tooltipPlacement="topLeft"
            tooltipText={record.band.name}
            leftText={record.band.name}
            rightText={`${Math.round(averageScore)}%`}
            background={record.band.color}
          />
        ) : record.totalScore != null && record.achievementLevelInfo ? (
          <LargeTag
            tooltipPlacement="topLeft"
            tooltipText={record.achievementLevelInfo?.name || ''}
            leftText={record.achievementLevelInfo?.name || ''}
            rightText={
              Number.isInteger(record.totalScore)
                ? new Intl.NumberFormat().format(record.totalScore)
                : record.totalScore
            }
            background={record.achievementLevelInfo?.color || ''}
          />
        ) : (
          '-'
        )}
      </Row>
    )
    // render performance level in CSV
    const performanceLevelIdx = _columns.findIndex(
      (col) => col.key === 'performanceLevel'
    )
    _columns[performanceLevelIdx].render = (_, record) =>
      (!record.externalTestType
        ? record.band.name
        : record.achievementLevelInfo?.name) || '-'
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
      !record.externalTestType ? `${groupAvg}%` : groupAvg ?? '-'
    const totalTestItemsIdx = _columns.findIndex(
      (col) => col.key === 'totalTestItems'
    )
    _columns[totalTestItemsIdx].render = (totalTestItems) =>
      totalTestItems ?? '-'
    // render array of rectangular tags for claims
    const claimsInfoIdx = _columns.findIndex((col) => col.key === 'claimsInfo')
    _columns[claimsInfoIdx].render = (claimsInfo) => (
      <Row
        type="flex"
        justify="flex-start"
        style={{ gap: '8px', flexWrap: 'nowrap' }}
      >
        {!isEmpty(claimsInfo)
          ? Object.values(claimsInfo).map((claim) => (
              <LargeTag
                tooltipText={
                  <>
                    {claim.name}
                    <br />
                    {claim.value || '-'}
                  </>
                }
                leftText={claim.name}
                rightText={claim.value || '-'}
                background={claim.color}
                key={`${claim.name}:${claim.value}`}
              />
            ))
          : '-'}
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
  const claimNames = useMemo(
    () =>
      uniq(
        tableData.flatMap((row) =>
          row.externalTestType ? Object.keys(row.claimsInfo) : []
        )
      ),
    [tableData]
  )
  const tableColumns = useMemo(() => {
    const initialColumns = getTableColumns(isSharedReport)
    const claimsColumnsForCSV = claimNames.map((claimName) => ({
      title: claimName,
      dataIndex: `claimsInfo['${claimName}'].value`,
      visibleOn: ['csv'],
    }))
    return [...initialColumns, ...claimsColumnsForCSV]
  }, [isSharedReport, claimNames])
  return (
    <TableContainer>
      <SectionLabel style={{ fontSize: '18px' }}>
        Performance deep-dive across Assessments
      </SectionLabel>
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
