import React from 'react'
import PerformanceMatrixColumnHeader from '../../../../multipleAssessmentReport/PreVsPost/components/PerformanceMatrix/PerformanceMatrixColumnHeader'
import { matrixDisplayOptionTypes } from '../../../../multipleAssessmentReport/PreVsPost/utils'
import { StyledPerformanceMatrixCell } from '../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import PerformanceMatrixRowHeader from '../../../../multipleAssessmentReport/PreVsPost/components/PerformanceMatrix/PerformanceMatrixRowHeader'

export const getPerformanceMatrixColumnHeadersRender = ({
  performanceMatrixColumnHeaders,
  isSamePerformanceBand,
  performanceMatrixRowsData,
  matrixDisplayKey,
}) =>
  performanceMatrixColumnHeaders.map((d) => {
    let change = null
    if (isSamePerformanceBand) {
      const currentColumn =
        performanceMatrixRowsData.find((rd) => rd.threshold === d.threshold) ||
        {}
      const { studentsCount = 0, studentsPercentage = 0 } = currentColumn
      const studentsCountDiff = d.studentsCount - studentsCount
      const studentsPercentageDiff = d.studentsPercentage - studentsPercentage
      const studentsCountDiffText =
        studentsCountDiff > 0 ? `+${studentsCountDiff}` : studentsCountDiff
      const studentsPercentageDiffText =
        studentsPercentageDiff > 0
          ? `+${studentsPercentageDiff}`
          : studentsPercentageDiff
      change =
        matrixDisplayKey === matrixDisplayOptionTypes.NUMBER
          ? `(${studentsCountDiffText})`
          : `(${studentsPercentageDiffText}%)`
    }
    const value =
      matrixDisplayKey === matrixDisplayOptionTypes.NUMBER
        ? d.studentsCount
        : `${d.studentsPercentage}%`
    return (
      <PerformanceMatrixColumnHeader
        value={value}
        change={change}
        isSamePerformanceBand={isSamePerformanceBand}
        color={d.color}
      />
    )
  })

const getPreVsPostCellsRender = ({
  d,
  ri,
  matrixRowSize,
  matrixColumnSize,
  selectedPreThreshold,
  selectedPostThreshold,
  matrixDisplayKey,
  isSamePerformanceBand,
  performanceMatrixColors,
  onMatrixCellClick,
}) =>
  (d.preVsPostCellsData || []).map((d2, ci) => {
    const cellYPosition =
      ri === 0 ? 'top' : ri === matrixRowSize - 1 ? 'bottom' : ''
    const cellXposition =
      ci === 0 ? 'left' : ci === matrixColumnSize - 1 ? 'right' : ''
    const isClicked =
      d2.preThreshold === selectedPreThreshold &&
      d2.postThreshold === selectedPostThreshold
    const cellStatus = isClicked ? 'active' : 'inactive'
    const cellText =
      matrixDisplayKey === matrixDisplayOptionTypes.NUMBER
        ? d2.preVsPostCellStudentCount
        : `${d2.preVsPostCellStudentPercentage}%`

    const cellColor = isSamePerformanceBand
      ? performanceMatrixColors[ri][ci]
      : ''

    return (
      <StyledPerformanceMatrixCell
        className={`${cellYPosition} ${cellXposition} ${cellStatus}`}
        text={cellText}
        color={cellColor}
        onClick={onMatrixCellClick(d2.preThreshold, d2.postThreshold)}
        $dynamicColor
      />
    )
  })

export const getPreVsPostRowsRender = ({
  performanceMatrixData,
  matrixRowSize,
  matrixColumnSize,
  selectedPreThreshold,
  selectedPostThreshold,
  matrixDisplayKey,
  isSamePerformanceBand,
  performanceMatrixColors,
  onMatrixCellClick,
}) =>
  performanceMatrixData.map((d, ri) => {
    const text =
      matrixDisplayKey === matrixDisplayOptionTypes.NUMBER
        ? d.studentsCount
        : `${d.studentsPercentage}%`
    const preVsPostCells = getPreVsPostCellsRender({
      d,
      ri,
      matrixRowSize,
      matrixColumnSize,
      selectedPreThreshold,
      selectedPostThreshold,
      matrixDisplayKey,
      isSamePerformanceBand,
      performanceMatrixColors,
      onMatrixCellClick,
    })
    return (
      <React.Fragment key={`section-matrix-row-${ri}`}>
        <PerformanceMatrixRowHeader text={text} color={d.color} dynamicColor />
        {preVsPostCells}
      </React.Fragment>
    )
  })
