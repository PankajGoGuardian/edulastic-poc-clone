import React from 'react'
import { Row, Tag } from 'antd'

import { PerformanceMatrixContainer } from '../../common/styled'
import PerformanceMatrixColumnHeader from './PerformanceMatrixColumnHeader'
import PerformanceMatrixRowHeader from './PerformanceMatrixRowHeader'
import PerformanceMatrixCell from './PerformanceMatrixCell'

import {
  getPerformanceMatrixColors,
  getPerformanceMatrixData,
} from '../../utils'

const PerformanceMatrix = ({
  preTestName,
  postTestName,
  totalStudentCount = 0,
  summaryMetricInfo = [],
  selectedPerformanceBand = [],
  onMatrixCellClick,
}) => {
  const performanceMatrixData = getPerformanceMatrixData(
    summaryMetricInfo,
    selectedPerformanceBand,
    totalStudentCount
  )

  const matrixSize = performanceMatrixData.length

  const performanceMatrixColors = getPerformanceMatrixColors(matrixSize)

  const postTestColumnHeaders = performanceMatrixData.map((d, ri) => {
    const text = `${d.postStudentsPercentage}% (${
      d.postStudentsPercentage - d.preStudentsPercentange
    }%)`
    return (
      <PerformanceMatrixColumnHeader
        key={`section-matrix-col-${ri}`}
        text={text}
        color={d.color}
      />
    )
  })

  const preVsPostRows = performanceMatrixData.map((d1, ri) => {
    const text = `${d1.preStudentsPercentange}%`
    const preVsPostCells = (d1.preVsPostCellsData || []).map((d2, ci) => {
      const className1 =
        ri === 0 ? 'top' : ri === matrixSize - 1 ? 'bottom' : ''
      const className2 =
        ci === 0 ? 'left' : ci === matrixSize - 1 ? 'right' : ''
      return (
        <PerformanceMatrixCell
          key={`section-matrix-cell-${ri}-${ci}`}
          className={`${className1} ${className2}`}
          text={
            <>
              {d2.preVsPostCellStudentPercentage}%
              <br />({d2.preVsPostCellStudentCount})
            </>
          }
          color={performanceMatrixColors[ri][ci]}
          onClick={onMatrixCellClick(d2.threshold, d1.threshold)}
        />
      )
    })
    return (
      <React.Fragment key={`section-matrix-row-${ri}`}>
        <PerformanceMatrixRowHeader text={text} color={d1.color} />
        {preVsPostCells}
      </React.Fragment>
    )
  })

  return (
    <PerformanceMatrixContainer matrixSize={matrixSize}>
      <Row type="flex" justify="center">
        <div className="section-post-test">
          <Tag className="section-post-test-tag">POST</Tag>
          <span className="section-post-test-name">{postTestName}</span>
        </div>
      </Row>
      <Row type="flex" justify="center">
        <div style={{ position: 'relative' }}>
          <div className="section-pre-test">
            <Tag className="section-pre-test-tag">PRE</Tag>
            <span className="section-pre-test-name">{preTestName}</span>
          </div>
          <div className="section-matrix-grid">
            {/* empty div required to complete the matrix */}
            <div />
            {postTestColumnHeaders}
            {preVsPostRows}
          </div>
        </div>
      </Row>
    </PerformanceMatrixContainer>
  )
}

export default PerformanceMatrix
