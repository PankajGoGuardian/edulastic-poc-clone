import React from 'react'
import Row from "antd/es/row";
import Col from "antd/es/col";

const TooltipRow = ({
  title = '',
  value = '',
  classNamePrefix = 'custom-table-tooltip',
}) => {
  return (
    <Row type="flex" justify="start">
      <Col className={`${classNamePrefix}-key`}>{title}</Col>
      <Col className={`${classNamePrefix}-value`}>{value}</Col>
    </Row>
  )
}

export default TooltipRow
