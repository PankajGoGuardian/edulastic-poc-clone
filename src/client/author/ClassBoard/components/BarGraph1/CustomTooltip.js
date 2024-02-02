import React from 'react'
import { Row, Col } from 'antd'

export const CustomTooltip = (props) => {
  const { label, payload, className } = props
  const showToolTip = payload && payload.length >= 3
  if (!showToolTip) {
    return null
  }
  return (
    <div className={className}>
      <div className="classboard-tooltip-title">
        {label} : difficulty levels for students by head count
      </div>
      <Row type="flex" justify="start">
        <Col className="classboard-tooltip-key">Easy: </Col>
        <Col className="classboard-tooltip-value">{payload[0].value}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="classboard-tooltip-key">Medium: </Col>
        <Col className="classboard-tooltip-value">{payload[1].value}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="classboard-tooltip-key">Difficult: </Col>
        <Col className="classboard-tooltip-value">{payload[2].value}</Col>
      </Row>
    </div>
  )
}
