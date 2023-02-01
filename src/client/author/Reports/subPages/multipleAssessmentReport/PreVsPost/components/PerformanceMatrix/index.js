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
import PerformanceMatrixDisplayToggle from './PerformanceMatrixDisplayToggle'

import {
  DECIMAL_BASE,
  getPerformanceMatrixColors,
  getPerformanceMatrixData,
  matrixDisplayOptions,
  matrixDisplayOptionTypes,
} from '../../utils'
import { DashedLine } from '../../../../../common/styled'

const PerformanceMatrix = ({
  preTestName,
  postTestName,
  totalStudentCount = 0,
  summaryMetricInfo = [],
  selectedPerformanceBand = [],
  tableFilters,
  onMatrixCellClick,
  matrixDisplayKey,
  setMatrixDisplayKey,
}) => {
  const {
    performanceMatrixData,
    matrixSize,
    postTestColumnHeaders,
  } = useMemo(() => {
    // sort performance band by threshold for display in performance matrix
    const _selectedPerformanceBand = sortBy(
      selectedPerformanceBand,
      'threshold'
    )
    const _performanceMatrixData = getPerformanceMatrixData(
      summaryMetricInfo,
      _selectedPerformanceBand,
      totalStudentCount
    )
    const _matrixSize = _performanceMatrixData.length
    // column headers render for post test
    const _postTestColumnHeaders = _performanceMatrixData.map((d) => {
      const studentsCountDiff = d.postStudentsCount - d.preStudentsCount
      const studentsCountDiffText =
        studentsCountDiff > 0 ? `+${studentsCountDiff}` : studentsCountDiff
      const studentsPercentageDiff =
        d.postStudentsPercentage - d.preStudentsPercentage
      const studentsPercentageDiffText =
        studentsPercentageDiff > 0
          ? `+${studentsPercentageDiff}`
          : studentsPercentageDiff
      const columnText =
        matrixDisplayKey === matrixDisplayOptionTypes.NUMBER
          ? `${d.postStudentsCount} (${studentsCountDiffText})`
          : `${d.postStudentsPercentage}% (${studentsPercentageDiffText}%)`
      return <PerformanceMatrixColumnHeader text={columnText} color={d.color} />
    })
    return {
      performanceMatrixData: _performanceMatrixData,
      matrixSize: _matrixSize,
      postTestColumnHeaders: _postTestColumnHeaders,
    }
  }, [
    summaryMetricInfo,
    selectedPerformanceBand,
    totalStudentCount,
    matrixDisplayKey,
  ])

  const preVsPostRows = useMemo(() => {
    const hasCellClicked =
      tableFilters.preBandScore && tableFilters.postBandScore
    const selectedPreThreshold = parseInt(
      tableFilters.preBandScore,
      DECIMAL_BASE
    )
    const selectedPostThreshold = parseInt(
      tableFilters.postBandScore,
      DECIMAL_BASE
    )
    // generate colors to fill for performance matrix
    const performanceMatrixColors = getPerformanceMatrixColors(matrixSize)
    // row render for each pre vs post test data
    const _preVsPostRows = performanceMatrixData.map((d1, ri) => {
      const text =
        matrixDisplayKey === matrixDisplayOptionTypes.NUMBER
          ? d1.preStudentsCount
          : `${d1.preStudentsPercentage}%`
      const preVsPostCells = (d1.preVsPostCellsData || []).map((d2, ci) => {
        const className1 =
          ri === 0 ? 'top' : ri === matrixSize - 1 ? 'bottom' : ''
        const className2 =
          ci === 0 ? 'left' : ci === matrixSize - 1 ? 'right' : ''
        const isClicked =
          d2.preThreshold === selectedPreThreshold &&
          d2.postThreshold === selectedPostThreshold
        const cellText =
          matrixDisplayKey === matrixDisplayOptionTypes.NUMBER
            ? d2.preVsPostCellStudentCount
            : `${d2.preVsPostCellStudentPercentage}%`
        return (
          <PerformanceMatrixCell
            className={`${className1} ${className2}`}
            text={cellText}
            color={performanceMatrixColors[ri][ci]}
            selected={!hasCellClicked || isClicked}
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
    return _preVsPostRows
  }, [
    performanceMatrixData,
    matrixSize,
    tableFilters.preBandScore,
    tableFilters.postBandScore,
    matrixDisplayKey,
  ])

  return (
    <>
      <StyledRow type="flex">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Performance Band Movement
        </Typography.Title>
        <DashedLine margin="15px 24px" dashColor={darkGrey} />
      </StyledRow>
      <PerformanceMatrixContainer matrixSize={matrixSize}>
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
              {postTestColumnHeaders}
              {preVsPostRows}
            </div>
            <div className="section-matrix-display-toggle">
              <PerformanceMatrixDisplayToggle
                selected={matrixDisplayKey}
                selectCB={setMatrixDisplayKey}
                data={matrixDisplayOptions}
              />
            </div>
          </div>
        </Row>
      </PerformanceMatrixContainer>
    </>
  )
}

export default PerformanceMatrix
