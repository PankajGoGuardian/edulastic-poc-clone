import React from 'react'
import { Row, Col } from 'antd'
import { comparedByToToolTipLabel } from '../../constants'

export const TooltipText = (
  compareByType,
  record,
  { questionId, questionLabel }
) => {
  return (
    <div>
      <Row type="flex" justify="center">
        <Col className="custom-table-tooltip-value">{questionLabel}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].name}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">{record.dimension}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].type}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">
          {record.scorePercentByQId?.[questionId]}
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].all}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">
          {record.averageScoreByQId?.[questionId]}
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">District (% Score):</Col>
        <Col className="custom-table-tooltip-value">
          {record.districtAverage?.[questionId]}
        </Col>
      </Row>
    </div>
  )
}
