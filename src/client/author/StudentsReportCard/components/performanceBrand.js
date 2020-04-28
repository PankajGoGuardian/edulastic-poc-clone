import React from "react";
import Moment from "moment";
import { Row, Col } from "antd";

import { StyledCard } from "../../Reports/common/styled";
import {
  PerformanceBrandWrapper,
  StyledTitle,
  Container,
  Color,
  StyledPerformancePercent,
  PerformanceTitle
} from "./styles";

const PerformanceBrand = (props, ref) => {
  const { testData = {}, data = {}, className, showPerformanceBand } = props;
  const { chartData, classResponse, totalScore, obtainedScore, feedback, classTitle } = data;
  const perfomancePercentage = (data.obtainedScore / data.totalScore) * 100;
  let mastery = null;

  //finding the mestry
  for (let i = 0; i < chartData.length; i++) {
    const data = chartData[i];
    if (perfomancePercentage >= data.threshold) {
      mastery = data;
      break;
    }
  }

  if (!mastery) {
    mastery = chartData.find(m => m.score === 1);
  }

  return (
    <div ref={props.performanceRef} className={className}>
      <PerformanceBrandWrapper bordered={false}>
        <Row className="top-container" type="flex" justify="space-between">
          <div>
            <StyledTitle>
              <b>
                <Color>Edu</Color>
              </b>
              lastic
            </StyledTitle>
          </div>
          <div className="test-name">
            <p>{testData.title}</p>
          </div>
        </Row>
        <Container className="student-report-card-chart-container">
          <Row type="flex" justify="start">
            <Col className="student-report-card-description-area">
              <Row className="student-report-card-details student-name" type="flex" justify="start">
                <Col className="student-report-card-value">{data.studentName}</Col>
              </Row>
              <Row className="student-report-card-details" type="flex" justify="start">
                <Col className="student-report-card-key">Class: </Col>
                <Col className="student-report-card-value">{classTitle}</Col>
              </Row>
              <Row className="student-report-card-details" type="flex" justify="start">
                <Col className="student-report-card-key">Date: </Col>
                <Col className="student-report-card-value">{Moment(testData.createdDate).format("MMM DD, YYYY")}</Col>
              </Row>
              <Row
                className="student-report-card-details student-report-card-details-subject"
                type="flex"
                justify="start"
              >
                <Col className="student-report-card-key">Subject: </Col>
                <Col className="student-report-card-value">{classResponse?.subjects?.join(", ")}</Col>
              </Row>
              {feedback && (
                <Row className="student-report-card-details">
                  <p className="student-report-card-key">Overall Feedback </p>
                  <p className="student-report-card-value">{feedback.text}</p>
                </Row>
              )}
            </Col>
            <Col className="student-report-card-score-wrapper">
              <div style={{ display: "flex" }}>
                <StyledCard>
                  <Row className={"student-report-card-total-score"} type="flex">
                    <Col>{obtainedScore.toFixed(2)}</Col>
                    <Col style={{ fontSize: "35px" }}>{totalScore}</Col>
                    <Col style={{ marginTop: "12px" }}>
                      <p>SCORE</p>
                    </Col>
                  </Row>
                </StyledCard>
                <StyledPerformancePercent
                  className="student-report-card-chart-area"
                  backGroundcolor={mastery?.fill}
                  color={mastery?.color}
                >
                  <div className="student-report-card-chart-area-score">{Math.round(perfomancePercentage)}%</div>
                </StyledPerformancePercent>
              </div>
              {showPerformanceBand && (
                <PerformanceTitle>
                  PERFORMANCE: <span style={{ color: mastery?.fill }}>{mastery.masteryLevel}</span>
                </PerformanceTitle>
              )}
            </Col>
          </Row>
        </Container>
      </PerformanceBrandWrapper>
    </div>
  );
};

export default PerformanceBrand;
