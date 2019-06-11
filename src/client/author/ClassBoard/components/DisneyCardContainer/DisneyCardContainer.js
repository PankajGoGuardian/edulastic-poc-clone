import React, { Component } from "react";
import PropTypes from "prop-types";
import { round } from "lodash";
import { Col, Row } from "antd";
import { greenSecondary, yellow, red } from "@edulastic/colors";

import CardCheckbox from "./CardCheckbox/CardCheckbox";

import {
  StyledCardContiner,
  StyledFlexDiv,
  PerfomanceSection,
  StyledCard,
  PagInfo,
  GSpan,
  PaginationInfoF,
  PaginationInfoS,
  PaginationInfoT,
  CircularDiv,
  SquareColorDivGreen,
  SquareColorDivGray,
  SquareColorBlue,
  SquareColorDisabled,
  SquareColorDivPink,
  SquareColorDivYellow,
  StyledParaF,
  StyledParaS,
  StyledColorParaS,
  StyledParaFF,
  StyledName,
  StyledParaSS,
  StyledParaSSS,
  RightAlignedCol
} from "./styled";
import { getAvatarName, getFirstName } from "../../Transformer";
export default class DisneyCardContainer extends Component {
  static propTypes = {
    selectedStudents: PropTypes.object.isRequired,
    studentSelect: PropTypes.func.isRequired,
    studentUnselect: PropTypes.func.isRequired,
    viewResponses: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      testActivity: []
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      testActivity: props.testActivity,
      assignmentId: props.assignmentId,
      classId: props.classId
    };
  }

  render() {
    const { testActivity } = this.state;
    const { selectedStudents, studentSelect, studentUnselect, viewResponses } = this.props;
    const styledCard = [];

    if (testActivity.length > 0) {
      testActivity.map((student, index) => {
        const status = {
          color: "",
          status: ""
        };
        if (student.status === "notStarted") {
          status.status = "NOT STARTED";
          status.color = red;
        } else if (student.status === "inProgress") {
          status.status = "IN PROGRESS";
          status.color = yellow;
        } else if (student.status === "submitted") {
          if (student.graded) {
            status.status = "GRADED";
          } else {
            status.status = "SUBMITTED";
          }
          status.color = greenSecondary;
        } else if (student.status === "redirected") {
          status.status = "REDIRECTED";
          status.color = greenSecondary;
        }

        let correctAnswers = 0;
        const questions = student.questionActivities.length;
        student.questionActivities.map(questionAct => {
          if (questionAct.correct) {
            correctAnswers++;
          }
          return null;
        });

        const stu_per = round((parseFloat(correctAnswers) / parseFloat(questions)) * 100, 2);

        const studentData = (
          <StyledCard data-cy={`student-card-${student.studentName}`} bordered={false} key={index}>
            <PaginationInfoF>
              <CircularDiv>{getAvatarName(student.studentName)}</CircularDiv>
              <StyledName>
                <StyledParaF data-cy="studentName" title={student.email}>
                  {student.studentName ? student.studentName : "-"}
                </StyledParaF>
                {student.present ? (
                  <StyledParaS data-cy="studentStatus" color={status.color}>
                    {status.status}
                  </StyledParaS>
                ) : (
                  <StyledColorParaS>ABSENT</StyledColorParaS>
                )}
              </StyledName>
              <RightAlignedCol>
                <Row>
                  <Col>
                    <CardCheckbox
                      checked={selectedStudents[student.studentId]}
                      onChange={e => {
                        if (e.target.checked) {
                          studentSelect(student.studentId);
                        } else {
                          studentUnselect(student.studentId);
                        }
                      }}
                      studentId={student.studentId}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {student.redirected && (
                      <i
                        data-cy="redirected"
                        title="Assessment is redirected to the student. The most recent response will be shown"
                        className="fa fa-external-link"
                        aria-hidden="true"
                      />
                    )}
                  </Col>
                </Row>
              </RightAlignedCol>
            </PaginationInfoF>
            <PaginationInfoS>
              <StyledParaFF>Performance</StyledParaFF>
              <PerfomanceSection>
                <StyledFlexDiv>
                  <StyledParaSS data-cy="studentScore">
                    {round(student.score, 1) || 0} / {student.maxScore || 0}
                  </StyledParaSS>
                  <StyledParaSSS data-cy="studentPerformance">
                    {student.score > 0 ? round((student.score / student.maxScore) * 100, 1) : 0}%
                  </StyledParaSSS>
                </StyledFlexDiv>
                {student.testActivityId && (
                  <PagInfo data-cy="viewResponse" onClick={e => viewResponses(e, student.studentId)}>
                    {/* <Link to={`/author/classresponses/${student.testActivityId}`}> */}
                    VIEW RESPONSES <GSpan>&gt;&gt;</GSpan>
                    {/* </Link> */}
                  </PagInfo>
                )}
              </PerfomanceSection>
            </PaginationInfoS>
            <PaginationInfoT data-cy="questions">
              {student.questionActivities
                .filter(x => !x.disabled)
                .map((questionAct, questionIndex) => {
                  const weight = questionAct.weight;
                  if (questionAct.notStarted) {
                    return <SquareColorDisabled weight={weight} key={questionIndex} />;
                  } else if (questionAct.skipped && questionAct.score === 0) {
                    return <SquareColorDivGray weight={weight} key={questionIndex} />;
                  } else if (questionAct.graded === false) {
                    return <SquareColorBlue weight={weight} key={questionIndex} />;
                  } else if (questionAct.score === questionAct.maxScore && questionAct.score > 0) {
                    return <SquareColorDivGreen weight={weight} key={questionIndex} />;
                  } else if (questionAct.score > 0 && questionAct.score < questionAct.maxScore) {
                    return <SquareColorDivYellow weight={weight} key={questionIndex} />;
                  } else if (questionAct.score === 0) {
                    return <SquareColorDivPink weight={weight} key={questionIndex} />;
                  }
                  return null;
                })}
            </PaginationInfoT>
          </StyledCard>
        );
        styledCard.push(studentData);
        return null;
      });
    }

    return <StyledCardContiner>{styledCard}</StyledCardContiner>;
  }
}
