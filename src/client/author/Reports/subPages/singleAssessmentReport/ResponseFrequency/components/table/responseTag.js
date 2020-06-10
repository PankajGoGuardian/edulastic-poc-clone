import React, { Component } from "react";
import next from "immer";

import styled from "styled-components";
import { get, isNaN } from "lodash";
import { Row, Col, Tag } from "antd";

import { darkGrey, themeColorLighter, incorrect, yellow1 } from "@edulastic/colors";
import { StyledResponseTagContainer } from "../styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";

export class ResponseTag extends Component {
  tooltipText = data => () => {
    const { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = data.record;
    const sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
    let skip = (skip_cnt / sum) * 100;
    if (isNaN(skip)) skip = 0;
    skip = `${Math.round(skip)}%`;

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

  getPrintableTag = (exisitingStyle, name, value) => {
    const { data, incorrectFrequencyThreshold } = this.props;
    const modifiedStyle = next(exisitingStyle, styleDraft => {
      if (data.isCorrect) {
        styleDraft.color = themeColorLighter;
      } else if (value > incorrectFrequencyThreshold) {
        styleDraft.color = yellow1;
      }

      styleDraft.backgroundColor = "transparent";
    });

    return (
      <Tag style={modifiedStyle}>
        {name} - {value}%
      </Tag>
    );
  };

  getCellContents = () => {
    const { data, incorrectFrequencyThreshold, isPrinting } = this.props;
    const name = get(data, "name", "");
    const value = Number(get(data, "value", 0));

    const style = data.isCorrect
      ? { borderColor: themeColorLighter, color: themeColorLighter }
      : value > incorrectFrequencyThreshold
      ? { borderColor: yellow1, color: yellow1 }
      : { borderColor: incorrect };

    if (isPrinting) {
      return this.getPrintableTag(style, name, value);
    }

    return (
      <StyledTag style={style}>
        <p>{name}</p>
        <p>{value}%</p>
      </StyledTag>
    );
  };

  render() {
    const data = get(this.props, "data", "");
    console.log(data.key);
    return (
      <StyledResponseTagContainer>
        <CustomTableTooltip placement="top" title={this.tooltipText(data)} getCellContents={this.getCellContents} />
      </StyledResponseTagContainer>
    );
  }
}

const StyledTag = styled.div`
  min-height: 40px;
  border: solid 2px ${darkGrey};
  border-radius: 40px;
  margin: 2px 5px;
  text-align: center;
  padding: 0px 10px;
  display: flex;
  flex-direction: column;
  p {
    &:nth-child(1) {
      flex-grow: 0;
    }
    &:nth-child(2) {
      flex-grow: 1;
    }
  }
`;
