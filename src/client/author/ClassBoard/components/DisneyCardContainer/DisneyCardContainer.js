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

  getAvatarName = studentName => {
    let firstLetter = "";
    let secondLetter = "";

    if (studentName.length > 0) {
      if (studentName.indexOf(" ") >= 0) {
        firstLetter = studentName.substring(0, 1);
        secondLetter = studentName.substring(studentName.indexOf(" "), 1);
      } else if (this.countUpperCaseChars(studentName) >= 2) {
        firstLetter = studentName.match(/^[A-Z]{4}/);
        secondLetter = studentName.substring(
          studentName.indexOf(firstLetter),
          studentName.length - studentName.indexOf(firstLetter)
        );
        secondLetter = secondLetter.match(/^[A-Z]{4}/);
      } else if (studentName.length >= 2) {
        return studentName.substring(0, 2).toUpperCase();
      }

      return `${firstLetter}${secondLetter}`.toUpperCase();
    }
  };

  countUpperCaseChars = str => {
    let count = 0;
    const len = str.length;
    for (let i = 0; i < len; i++) {
      if (/[A-Z]/.test(str.charAt(i))) count++;
    }
    return count;
  };

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
          status.status = "SUBMITTED";
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
          <StyledCard bordered={false} key={index}>
            <PaginationInfoF>
              <CircularDiv>{this.getAvatarName(student.studentName)}</CircularDiv>
              <StyledName>
                <StyledParaF>{student.studentName ? student.studentName : "-"}</StyledParaF>
                {student.present ? (
                  <StyledParaS color={status.color}>{status.status}</StyledParaS>
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
                  <StyledParaSS>
                    {student.score || 0} / {student.maxScore || 0}
                  </StyledParaSS>
                  <StyledParaSSS>{stu_per || stu_per === 0 ? `${stu_per}%` : "-%"}</StyledParaSSS>
                </StyledFlexDiv>
                {student.testActivityId && (
                  <PagInfo onClick={e => viewResponses(e, student.studentId)}>
                    {/* <Link to={`/author/classresponses/${student.testActivityId}`}> */}
                    VIEW RESPONSES <GSpan>&gt;&gt;</GSpan>
                    {/* </Link> */}
                  </PagInfo>
                )}
              </PerfomanceSection>
            </PaginationInfoS>
            <PaginationInfoT>
              {student.questionActivities.map((questionAct, questionIndex) => {
                if (questionAct.correct) {
                  return <SquareColorDivGreen key={questionIndex} />;
                }
                if (questionAct.skipped) {
                  return <SquareColorDivGray key={questionIndex} />;
                }
                if (questionAct.partialCorrect) {
                  return <SquareColorDivYellow key={questionIndex} />;
                }
                if (questionAct.notStarted) {
                  return <SquareColorDisabled key={questionIndex} />;
                }
                if (!questionAct.correct) {
                  return <SquareColorDivPink key={questionIndex} />;
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
