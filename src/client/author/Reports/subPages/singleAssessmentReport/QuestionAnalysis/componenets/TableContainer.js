import { EduIf, SpinLoader } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import { Col, Pagination } from 'antd'
import React from 'react'

import { QuestionAnalysisTable } from './table/questionAnalysisTable'

const { compareByToPluralName } = reportUtils.questionAnalysis

const TableContainer = ({
  performanceByDimensionLoading,
  compareBy,
  isCsvDownloading,
  chartFilter,
  userRole,
  sortKey,
  visibleIndices,
  setSortOrder,
  performanceByDimension,
  pageSize,
  qSummary,
  setpageNo,
  pageNo,
  isSharedReport,
}) => {
  return (
    <Col className="bottom-table-container">
      <EduIf condition={performanceByDimensionLoading}>
        <SpinLoader tip={`Loading ${compareByToPluralName[compareBy]} data`} />
      </EduIf>
      <EduIf condition={!performanceByDimensionLoading}>
        <QuestionAnalysisTable
          isCsvDownloading={isCsvDownloading}
          qSummary={qSummary}
          performanceByDimension={performanceByDimension}
          compareBy={compareBy}
          filter={chartFilter}
          role={userRole}
          sortKey={sortKey}
          visibleIndices={visibleIndices}
          setSortByDimension={setSortOrder}
          isSharedReport={isSharedReport}
        />
        <EduIf condition={performanceByDimension?.totalRows > pageSize}>
          <Pagination
            style={{ marginTop: '10px' }}
            onChange={setpageNo}
            current={pageNo}
            pageSize={pageSize}
            total={performanceByDimension?.totalRows}
          />
        </EduIf>
      </EduIf>
    </Col>
  )
}

export default TableContainer
