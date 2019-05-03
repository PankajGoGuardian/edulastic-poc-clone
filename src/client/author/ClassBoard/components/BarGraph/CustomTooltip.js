import React, { Component } from "react";
import { Row, Col, Card } from "antd";
import { get, head } from "lodash";
import { TooltipContainer } from "./styled";

export const CustomTooltip = props => {
  const { label, payload, className } = props;
  const firstItem = head(payload) || {};
  const timeSpent = get(firstItem, "payload.avgTimeSpent");

  return (
    <>
      {payload && payload.length === 3 ? (
        <div className={className}>
          <div className="classboard-tooltip-title">{label}</div>
          <Row type="flex" justify="start">
            <Col className="classboard-tooltip-key">Correct Attemps: </Col>
            <Col className="classboard-tooltip-value">{payload[0].value}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="classboard-tooltip-key">Incorrect Attemps: </Col>
            <Col className="classboard-tooltip-value">{payload[1].value}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="classboard-tooltip-key">Average Time Spent (seconds): </Col>
            <Col className="classboard-tooltip-value">{timeSpent ? (timeSpent / 1000).toFixed(1) : 0}</Col>
          </Row>
        </div>
      ) : null}
    </>
  );
};
