import React from "react";
import { Component } from "react";
import styled from "styled-components";
import { get } from "lodash";
import { Row, Col, Tag } from "antd";

import { getHSLFromRange1, getHSLFromRange2 } from "../../../../../common/util";
import { StyledResponseTagContainer } from "../styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import { darkGrey } from "@edulastic/colors";

export class ResponseTag extends Component {
  constructor(props) {
    super(props);
  }

  tooltipText = data => () => {
    let { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = data.record;
    let sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
    let skip = (skip_cnt / sum) * 100;
    if (isNaN(skip)) skip = 0;
    skip = Math.round(skip) + "%";

    return (
      <div>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Response: </Col>
          <Col className="custom-table-tooltip-value">{data.name}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Question Type: </Col>
          <Col className="custom-table-tooltip-value">{data.record.qType}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Skips: </Col>
          <Col className="custom-table-tooltip-value">{skip}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Question: </Col>
          <Col className="custom-table-tooltip-value">{data.record.qLabel}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Response: </Col>
          <Col className="custom-table-tooltip-value">{data.value}%</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Response Count: </Col>
          <Col className="custom-table-tooltip-value">{data.count}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Performance: </Col>
          <Col className="custom-table-tooltip-value">{Math.round((corr_cnt / sum) * 100)}%</Col>
        </Row>
      </div>
    );
  };

  getCellContents = () => {
    let name = get(this.props, "data.name", "");
    let value = Number(get(this.props, "data.value", 0));

    let TagToRender = (
      <StyledTag
        style={
          this.props.data.isCorrect
            ? { borderColor: getHSLFromRange1(100) }
            : value > this.props.incorrectFrequencyThreshold
            ? { borderColor: getHSLFromRange2(100 - value) }
            : { borderColor: "#cccccc" }
        }
      >
        {<p>{name}</p>}
        <p>{value}%</p>
      </StyledTag>
    );

    if (this.props.isPrinting) {
      TagToRender = (
        <Tag
          style={
            this.props.data.isCorrect
              ? { borderColor: getHSLFromRange1(100), color: getHSLFromRange1(100, 60), backgroundColor: "transparent" }
              : value > this.props.incorrectFrequencyThreshold
              ? {
                  borderColor: getHSLFromRange2(100 - value),
                  color: getHSLFromRange2(100 - value, 30),
                  backgroundColor: "transparent"
                }
              : { borderColor: "#cccccc" }
          }
        >
          {name} - {value}%
        </Tag>
      );
    }

    return TagToRender;
  };

  render() {
    let data = get(this.props, "data", "");

    return (
      <StyledResponseTagContainer>
        <CustomTableTooltip placement="top" title={this.tooltipText(data)} getCellContents={this.getCellContents} />
      </StyledResponseTagContainer>
    );
  }
}

const StyledTag = styled.div`
  border: solid 2px ${darkGrey};
  border-radius: 40px;
  margin: 2px 5px;
  text-align: center;
  padding: 3px 10px;
  min-width: 100px;
  p {
    margin: 2px;
  }
`;
