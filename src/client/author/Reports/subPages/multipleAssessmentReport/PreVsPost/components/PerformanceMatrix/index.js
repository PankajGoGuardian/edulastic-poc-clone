import React, { useMemo } from 'react'
import { Row, Typography } from 'antd'
import { sortBy } from 'lodash'

import { darkGrey } from '@edulastic/colors'
import {
  PerformanceMatrixContainer,
  StyledRow,
  TestTypeTag,
} from '../../common/styledComponents'
import PerformanceMatrixColumnHeader from './PerformanceMatrixColumnHeader'
import PerformanceMatrixRowHeader from './PerformanceMatrixRowHeader'
import PerformanceMatrixCell from './PerformanceMatrixCell'

import {
  getPerformanceMatrixColors,
  getPerformanceMatrixData,
} from '../../utils'
import { DashedLine } from '../../../../../common/styled'

const PerformanceMatrix = ({
  preTestName,
  postTestName,
  totalStudentCount = 0,
  summaryMetricInfo = [],
  selectedPerformanceBand = [],
  onMatrixCellClick,
}) => {
  const performanceMatrixRenderData = useMemo(() => {
    // sort performance band by threshold for display in performance matrix
    const _selectedPerformanceBand = sortBy(
      selectedPerformanceBand,
      'threshold'
    )
    const performanceMatrixData = getPerformanceMatrixData(
      summaryMetricInfo,
      _selectedPerformanceBand,
      totalStudentCount
    )
    const matrixSize = performanceMatrixData.length
    const performanceMatrixColors = getPerformanceMatrixColors(matrixSize)
    // column headers render for post test
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
    // row render for each pre vs post test data
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
            onClick={onMatrixCellClick(d2.preThreshold, d2.postThreshold)}
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
    return { matrixSize, postTestColumnHeaders, preVsPostRows }
  }, [summaryMetricInfo, selectedPerformanceBand, totalStudentCount])

  return (
    <>
      <StyledRow type="flex">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Performance Band Movement
        </Typography.Title>
        <DashedLine dashColor={darkGrey} />
      </StyledRow>
      <PerformanceMatrixContainer
        matrixSize={performanceMatrixRenderData.matrixSize}
      >
        <Row type="flex" justify="center">
          <div className="section-post-test">
            <TestTypeTag className="section-post-test-tag">POST</TestTypeTag>
            <span className="section-post-test-name">{postTestName}</span>
          </div>
        </Row>
        <Row type="flex" justify="center">
          <div style={{ position: 'relative' }}>
            <div className="section-pre-test">
              <TestTypeTag className="section-pre-test-tag">PRE</TestTypeTag>
              <span className="section-pre-test-name">{preTestName}</span>
            </div>
            <div className="section-matrix-grid">
              {/* empty div required to complete the matrix */}
              <div />
              {performanceMatrixRenderData.postTestColumnHeaders}
              {performanceMatrixRenderData.preVsPostRows}
            </div>
          </div>
        </Row>
      </PerformanceMatrixContainer>
    </>
  )
}

export default PerformanceMatrix
