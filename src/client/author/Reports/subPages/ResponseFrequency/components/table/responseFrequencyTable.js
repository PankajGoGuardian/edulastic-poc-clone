import React from "react";
import { Component } from "react";
import { StyledCard, StyledTable } from "../styled";
import { CustomTableTooltip } from "../../../../common/components/customTableTooltip";
import { Row, Col } from "antd";
import { find } from "lodash";
import { ResponseTag } from "./responseTag";
import { getHSLFromRange1 } from "../../../../common/util";

export class ResponseFrequencyTable extends Component {
  constructor(props) {
    super(props);
    this.init();
  }

  init() {
    this.columns = this.props.columns;

    this.columns[0].sorter = this.sortQuestionColumn.bind(null, "qLabel");

    // README: below line might work if antd version is upgraded to 3.15.0
    // this.columns[0].sortDirections = ["descend"];
    this.columns[2].render = (data, record) => {
      if (data && Array.isArray(data)) {
        return data.join(", ");
      } else if (typeof data == "string") {
        return data;
      }
      return "";
    };
    this.columns[4].sorter = this.sortCorrectColumn.bind(null, "corr_cnt");

    // README: below line might work if antd version is upgraded to 3.15.0
    // this.columns[4].sortDirections = ["descend"];
    this.columns[4].render = (data, record) => {
      const tooltipText = record => () => {
        let { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = record;
        let sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
        return (
          <div>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Assessment Name: </Col>
              <Col className="custom-table-tooltip-value">{this.props.assessment.testName}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Question: </Col>
              <Col className="custom-table-tooltip-value">{record.qLabel}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Question Type: </Col>
              <Col className="custom-table-tooltip-value">{record.qType}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Standards: </Col>
              <Col className="custom-table-tooltip-value">{record.standards}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Max Score: </Col>
              <Col className="custom-table-tooltip-value">{record.maxScore}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Performance: </Col>
              <Col className="custom-table-tooltip-value">{Math.round((corr_cnt / sum) * 100)}%</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Students Skipped: </Col>
              <Col className="custom-table-tooltip-value">{skip_cnt}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Students Correct: </Col>
              <Col className="custom-table-tooltip-value">{corr_cnt}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Total Students: </Col>
              <Col className="custom-table-tooltip-value">{sum}</Col>
            </Row>
          </div>
        );
      };

      const getCellContents = props => {
        let { correct, correctThreshold } = props;
        return (
          <div style={{ width: "100%", height: "100%" }}>
            {correct < correctThreshold ? (
              <div className="response-frequency-table-correct-td" style={{ backgroundColor: getHSLFromRange1(0) }}>
                {correct}%
              </div>
            ) : (
              <div className="response-frequency-table-correct-td">{correct}%</div>
            )}
          </div>
        );
      };

      let { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = record;
      let sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
      let correct = ((corr_cnt / sum) * 100).toFixed(0);
      if (isNaN(correct)) correct = 0;

      return (
        <CustomTableTooltip
          correct={correct}
          correctThreshold={this.props.correctThreshold}
          placement="top"
          title={tooltipText(record)}
          getCellContents={getCellContents}
        />
      );
    };

    this.columns[5].render = (data, record) => {
      let { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = record;
      let sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
      let skip = (skip_cnt / sum) * 100;
      if (isNaN(skip)) skip = 0;
      return Math.round(skip) + "%";
    };

    this.columns[6].render = (data, record) => {
      let arr = [];
      let { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = record;
      let sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
      if (sum == 0) sum = 1;
      if (!data || Object.keys(data).length === 0) {
        arr.push({ value: ((corr_cnt / sum) * 100).toFixed(0), name: "Correct", key: "corr_cnt", isCorrect: true });
        arr.push({
          value: ((incorr_cnt / sum) * 100).toFixed(0),
          name: "Incorrect",
          key: "incorr_cnt",
          isCorrect: false
        });
        arr.push({
          value: ((part_cnt / sum) * 100).toFixed(0),
          name: "Partially Correct",
          key: "part_cnt",
          isCorrect: false
        });
      } else {
        let numToAlp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        arr = Object.keys(data).map((comboKey, i) => {
          let validMap = {};

          let slittedKeyArr = comboKey.split(",");
          let str = "";
          let isCorrect = true;
          for (let key of slittedKeyArr) {
            for (let i = 0; i < record.options.length; i++) {
              // IMPORTANT: double == instead of === cuz we need to compare number keys with string keys
              if (record.options[i].value == key) {
                str = str + numToAlp[i];
                let tmp = find(record.validation, vstr => {
                  return key == vstr;
                });
                isCorrect = isCorrect && (tmp ? true : false);
              }
            }
          }

          return {
            value: Math.round((data[comboKey] / sum) * 100),
            name: str,
            key: str,
            isCorrect: isCorrect
          };
        });
      }

      return (
        <Row type="flex" justify="start" className="table-tag-container">
          {arr.map((data, i) => {
            return (
              <ResponseTag key={i} data={data} incorrectFrequencyThreshold={this.props.incorrectFrequencyThreshold} />
            );
          })}
        </Row>
      );
    };
  }

  sortCorrectColumn(key, a, b) {
    let _a = a[key] || 0;
    let _b = b[key] || 0;

    return _a - _b;
  }

  sortQuestionColumn(key, a, b) {
    let _a = Number(a[key].substring(1));
    let _b = Number(b[key].substring(1));
    return _a - _b;
  }

  render() {
    return (
      <StyledCard className="response-frequency-table">
        <StyledTable columns={this.columns} dataSource={this.props.data} rowKey="uid" />
      </StyledCard>
    );
  }
}
