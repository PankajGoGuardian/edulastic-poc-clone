import React from "react";
import { Row, Col } from "antd";

const TooltipRow = ({ title = "", value = "" }) => {
  return (
    <Row type="flex" justify="start">
      <Col className="custom-table-tooltip-key">{title}</Col>
      <Col className="custom-table-tooltip-value">{value}</Col>
    </Row>
  );
};

export default TooltipRow;
