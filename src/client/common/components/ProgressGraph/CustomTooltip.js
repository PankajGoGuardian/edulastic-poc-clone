import React from 'react'
import { Row, Col } from 'antd'
import { get, head } from 'lodash'

export const CustomTooltip = (props) => {
  const { label, payload, className } = props
  const firstItem = head(payload) || {}
  const timeSpent = get(firstItem, 'payload.avgTimeSpent')

  return (
    <>
      {payload && payload.length >= 4 ? (
        <div className={className}>
          <div className="classboard-tooltip-title">{label}</div>
          <Row type="flex" justify="start">
            <Col className="classboard-tooltip-key">Correct Attempts: </Col>
            <Col className="classboard-tooltip-value">{payload[0].value}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="classboard-tooltip-key">Incorrect Attempts: </Col>
            <Col className="classboard-tooltip-value">{payload[1].value}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="classboard-tooltip-key">Partial Attempts: </Col>
            <Col className="classboard-tooltip-value">{payload[2].value}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="classboard-tooltip-key">
              Average Time Spent (seconds):{' '}
            </Col>
            <Col className="classboard-tooltip-value">
              {timeSpent ? (timeSpent / 1000).toFixed(1) : 0}
            </Col>
          </Row>
        </div>
      ) : null}
    </>
  )
}
