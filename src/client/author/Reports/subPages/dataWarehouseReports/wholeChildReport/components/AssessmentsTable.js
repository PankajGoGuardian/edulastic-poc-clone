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

const getTableColumns = () => {
  return next(tableColumnsData, (_columns) => {
    // link to LCB for testName
    const testNameIdx = _columns.findIndex((col) => col.key === 'testName')
    _columns[testNameIdx].render = (testName, record) => (
      <AssementNameContainer>
        {!record.isShareReport && !record.externalTestType ? (
          <Link
            to={`/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`}
            data-testid="testName"
          >
            <h4>{testName}</h4>
          </Link>
        ) : (
          <h4>{testName}</h4>
        )}
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
            leftText={record.band.name}
            rightText={`${Math.round(averageScore)}${
              record.externalTestType ? '%' : ''
            }`}
            background={record.band.color}
          />
        </Row>
      ) : (
        record.totalScore
      )
    // render array of rectangular tags for claims
    const claimsInfoIdx = _columns.findIndex((col) => col.key === 'claimsInfo')
    _columns[claimsInfoIdx].render = (claimsInfo) => (
      <Row type="flex" justify="center" style={{ gap: '8px' }}>
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

const AssessmentsTable = ({ tableData, onCsvConvert, isCsvDownloading }) => {
  const tableColumns = useMemo(() => getTableColumns())
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
