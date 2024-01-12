import React from 'react'

import { Col, Row } from 'antd'
import { EduIf } from '@edulastic/common'

import {
  CustomTableTooltip,
  CustomWhiteBackgroundTooltip,
} from '../../../../../common/components/customTableTooltip'
import { getHSLFromRange1 } from '../../../../../common/util'
import { ColoredCell } from '../../../../../common/styled'
import { StyledIconInfo } from '../styled'
import { NOT_AVAILABLE_LABEL } from '../../utils'

export function PerformanceColumn({ t, record, correctThreshold, assessment }) {
  const tooltipText = (rec) => () => {
    const {
      corr_cnt = 0,
      incorr_cnt = 0,
      skip_cnt = 0,
      part_cnt = 0,
      total_score = 0,
      total_max_score = 0,
      children = null,
    } = rec
    const sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt
    const averagePerformance = total_max_score
      ? `${Math.round((total_score / total_max_score) * 100)}%`
      : NOT_AVAILABLE_LABEL
    return (
      <div>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Assessment Name: </Col>
          <Col className="custom-table-tooltip-value">
            {assessment.testName}
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Question: </Col>
          <Col className="custom-table-tooltip-value">{rec.qLabel}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Question Type: </Col>
          <Col className="custom-table-tooltip-value">{rec.qType}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Standards: </Col>
          <Col className="custom-table-tooltip-value">{rec.standards}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Max Score: </Col>
          <Col className="custom-table-tooltip-value">{rec.maxScore}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Performance: </Col>
          <Col className="custom-table-tooltip-value">{averagePerformance}</Col>
        </Row>
        <EduIf condition={!children}>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Students Skipped: </Col>
            <Col className="custom-table-tooltip-value">{skip_cnt}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Students Correct: </Col>
            <Col className="custom-table-tooltip-value">{corr_cnt}</Col>
          </Row>
        </EduIf>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Total Students: </Col>
          <Col className="custom-table-tooltip-value">{sum}</Col>
        </Row>
      </div>
    )
  }

  const getCellContents = (cellData) => {
    const {
      correct,
      correctThreshold: _correctThreshold,
      showInfoIcon,
    } = cellData
    const performanceLabel = showInfoIcon ? correct : `${correct}%`
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {correct < _correctThreshold ? (
          <ColoredCell
            className="response-frequency-table-correct-td"
            bgColor={getHSLFromRange1(0)}
          >
            {performanceLabel}
          </ColoredCell>
        ) : (
          <div className="response-frequency-table-correct-td">
            {performanceLabel}
            <EduIf condition={showInfoIcon}>
              <CustomWhiteBackgroundTooltip
                data={t('responseFrequency.performanceColumnTooltip')}
                str={<StyledIconInfo />}
              />
            </EduIf>
          </div>
        )}
      </div>
    )
  }

  const { total_score = 0, total_max_score = 0 } = record
  const averagePerformance = total_max_score
    ? Math.round((total_score / total_max_score) * 100)
    : NOT_AVAILABLE_LABEL
  return (
    <CustomTableTooltip
      correct={averagePerformance}
      correctThreshold={correctThreshold}
      placement="top"
      title={record.total_max_score ? tooltipText(record) : null}
      getCellContents={getCellContents}
      showInfoIcon={!total_max_score}
    />
  )
}
