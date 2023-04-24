import React, { useMemo, useState } from 'react'
import { Row, Typography, Tooltip } from 'antd'

import { darkGrey } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'

import { DashedLine } from '../../../../../common/styled'
import PerformanceMatrixDisplayToggle from '../../../../multipleAssessmentReport/PreVsPost/components/PerformanceMatrix/PerformanceMatrixDisplayToggle'
import {
  StyledRow,
  TestTypeTag,
} from '../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import {
  getPerformanceMatrixColors,
  matrixDisplayOptions,
  matrixDisplayOptionTypes,
} from '../../../../multipleAssessmentReport/PreVsPost/utils'
import { PerformanceMatrixContainer } from '../../common/styledComponents'
import {
  getPerformanceMatrixColumnHeadersRender,
  getPreVsPostRowsRender,
} from './utils'

const { DECIMAL_BASE } = reportUtils.common

const PerformanceMatrix = ({
  totalStudentCount = 0,
  performanceMatrixColumnHeaders,
  performanceMatrixRowsData,
  testInfo,
  isSamePerformanceBand = true,
  prePerformanceBand = [],
  postPerformanceBand = [],
  tableFilters,
  setTableFilters,
}) => {
  const [matrixDisplayKey, setMatrixDisplayKey] = useState(
    matrixDisplayOptionTypes.NUMBER
  )

  const onMatrixCellClick = (preBandScore = '', postBandScore = '') => () => {
    const _tableFilters = {
      ...tableFilters,
      preBandScore: `${preBandScore}`,
      postBandScore: `${postBandScore}`,
    }
    if (
      tableFilters.preBandScore === _tableFilters.preBandScore &&
      tableFilters.postBandScore === _tableFilters.postBandScore
    ) {
      _tableFilters.preBandScore = ''
      _tableFilters.postBandScore = ''
    }
    setTableFilters(_tableFilters)
  }

  const { preTestInfo, postTestInfo } = testInfo
  const { performanceMatrixData, postTestColumnHeaders } = useMemo(() => {
    // column headers render for post test
    const _postTestColumnHeaders = getPerformanceMatrixColumnHeadersRender({
      performanceMatrixColumnHeaders,
      isSamePerformanceBand,
      performanceMatrixRowsData,
      matrixDisplayKey,
    })
    return {
      performanceMatrixData: performanceMatrixRowsData,
      postTestColumnHeaders: _postTestColumnHeaders,
    }
  }, [
    performanceMatrixColumnHeaders,
    performanceMatrixRowsData,
    prePerformanceBand,
    postPerformanceBand,
    totalStudentCount,
    matrixDisplayKey,
  ])

  const matrixRowSize = prePerformanceBand?.length
  const matrixColumnSize = postPerformanceBand?.length

  const preVsPostRows = useMemo(() => {
    const selectedPreThreshold = parseInt(
      tableFilters.preBandScore,
      DECIMAL_BASE
    )
    const selectedPostThreshold = parseInt(
      tableFilters.postBandScore,
      DECIMAL_BASE
    )
    // generate colors to fill for performance matrix
    const performanceMatrixColors = isSamePerformanceBand
      ? getPerformanceMatrixColors(matrixColumnSize)
      : []
    // row render for each pre vs post test data
    const _preVsPostRows = getPreVsPostRowsRender({
      performanceMatrixData,
      matrixRowSize,
      matrixColumnSize,
      selectedPreThreshold,
      selectedPostThreshold,
      matrixDisplayKey,
      isSamePerformanceBand,
      performanceMatrixColors,
      onMatrixCellClick,
    })
    return _preVsPostRows
  }, [
    performanceMatrixData,
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
      <PerformanceMatrixContainer
        matrixRowSize={matrixRowSize}
        matrixColumnSize={matrixColumnSize}
        isSamePerformanceBand={isSamePerformanceBand}
      >
        <Row type="flex" justify="center">
          <div className="section-test post-test">
            <TestTypeTag className="test-tag">POST</TestTypeTag>
            <Tooltip title={postTestInfo.name}>
              <span className="test-name">{postTestInfo.name}</span>
            </Tooltip>
          </div>
        </Row>
        <Row type="flex" justify="center">
          <div style={{ position: 'relative' }}>
            <div className="section-test pre-test">
              <TestTypeTag className="test-tag">PRE</TestTypeTag>
              <Tooltip title={preTestInfo.name}>
                <span className="test-name">{preTestInfo.name}</span>
              </Tooltip>
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
