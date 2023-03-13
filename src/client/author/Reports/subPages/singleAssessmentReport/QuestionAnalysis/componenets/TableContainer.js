import React from 'react'
import { Pagination, Col } from 'antd'
import { EduIf, SpinLoader } from '@edulastic/common'

import { QuestionAnalysisTable } from './table/questionAnalysisTable'
import { compareByToPluralName } from '../constants'

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
