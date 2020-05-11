import React from "react";
import Moment from "moment";
import { Row, Col } from "antd";
import { round } from "lodash";
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
  const { testData = {}, data = {}, className, showPerformanceBand, performanceBandsData } = props;
  const {
    chartData,
    classResponse = {},
    totalScore,
    obtainedScore,
    feedback,
    classTitle,
    studentActivityStartDate
  } = data;
  const perfomancePercentage = (data.obtainedScore / data.totalScore) * 100;

  //finding matching performance band wrt scored percentange from selected performance band group
  const { performanceBand } = classResponse;
  const selectedBandsData = performanceBandsData.find(o => o._id === performanceBand._id) ||
    performanceBandsData[0] || { performanceBand: [] };
  const selectedPerformanceBand =
    selectedBandsData.performanceBand.find(pb => perfomancePercentage >= pb.to && pb.from >= perfomancePercentage) ||
    {};

  //finding the mestry
  let mastery = null;
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
          <div data-cy="report-test-name" className="test-name">
            <p>{testData.title}</p>
          </div>
        </Row>
        <Container className="student-report-card-chart-container">
          <Row type="flex" justify="start">
            <Col className="student-report-card-description-area">
              <Row className="student-report-card-details student-name" type="flex" justify="start">
                <Col data-cy="report-student-name" className="student-report-card-value">
                  {data.studentName}
                </Col>
              </Row>
              <Row className="student-report-card-details" type="flex" justify="start">
                <Col className="student-report-card-key">Class: </Col>
                <Col data-cy="report-class-name" className="student-report-card-value">
                  {classTitle}
                </Col>
              </Row>
              <Row className="student-report-card-details" type="flex" justify="start">
                <Col className="student-report-card-key">Date: </Col>
                <Col data-cy="report-test-date" className="student-report-card-value">
                  {Moment(studentActivityStartDate).format("MMM DD, YYYY")}
                </Col>
              </Row>
              <Row
                className="student-report-card-details student-report-card-details-subject"
                type="flex"
                justify="start"
              >
                <Col className="student-report-card-key">Subject: </Col>
                <Col data-cy="report-subject" className="student-report-card-value">
                  {classResponse?.subjects?.join(", ")}
                </Col>
              </Row>
              <Row className="student-report-card-details" type="flex" justify="start">
                <Col className="student-report-card-key">Teacher: </Col>
                <Col className="student-report-card-value">{testData.createdBy?.name || ""}</Col>
              </Row>
              {feedback && (
                <Row className="student-report-card-details">
                  <p className="student-report-card-key">Overall Feedback </p>
                  <p data-cy="report-feedback" className="student-report-card-value">
                    {feedback.text}
                  </p>
                </Row>
              )}
            </Col>
            <Col className="student-report-card-score-wrapper">
              <div style={{ display: "flex" }}>
                <StyledCard>
                  <Row className={"student-report-card-total-score"} type="flex">
                    <Col data-cy="report-score"> {round(obtainedScore, 2) || 0}</Col>
                    <Col data-cy="report-max-score" style={{ fontSize: "35px" }}>
                      {round(totalScore, 2) || 0}
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      <p>SCORE</p>
                    </Col>
                  </Row>
                </StyledCard>
                <StyledPerformancePercent
                  data-cy="report-overall-performance"
                  className="student-report-card-chart-area"
                  backGroundcolor={mastery?.fill}
                  color={mastery?.color}
                >
                  <div className="student-report-card-chart-area-score">{Math.round(perfomancePercentage)}%</div>
                </StyledPerformancePercent>
              </div>
              {showPerformanceBand && (
                <PerformanceTitle>
                  PERFORMANCE:{" "}
                  <span data-cy="report-performance-band" style={{ color: selectedPerformanceBand?.color || "black" }}>
                    {selectedPerformanceBand?.name || ""}
                  </span>
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
