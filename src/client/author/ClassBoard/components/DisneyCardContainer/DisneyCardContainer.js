import React, { Component } from "react";
import PropTypes from "prop-types";
import { round, shuffle, get } from "lodash";
import { Col, Row, Spin } from "antd";
import { themeColorLighter, yellow, red } from "@edulastic/colors";
import { connect } from "react-redux";

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
  RightAlignedCol,
  ExclamationMark
} from "./styled";
import { NoDataBox, NoDataWrapper, NoDataIcon } from "../../../src/components/common/NoDataNotification";
import { getAvatarName, getFirstName } from "../../Transformer";
class DisneyCardContainer extends Component {
  static propTypes = {
    selectedStudents: PropTypes.object.isRequired,
    studentSelect: PropTypes.func.isRequired,
    studentUnselect: PropTypes.func.isRequired,
    viewResponses: PropTypes.func.isRequired,
    isPresentationMode: PropTypes.bool,
    isLoading: PropTypes.bool
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
    const {
      selectedStudents,
      studentSelect,
      studentUnselect,
      viewResponses,
      isPresentationMode,
      endDate,
      updateDisabledList,
      isLoading,
      enrollmentStatus
    } = this.props;

    const noDataNotification = () => {
      return (
        <NoDataWrapper height="300px" margin="20px auto">
          <NoDataBox width="300px" height="200px" descSize="14px">
            <img src={NoDataIcon} svgWidth="40px" alt="noData" />
            <h4>No Data</h4>
            <p>Students have not yet been assigned</p>
          </NoDataBox>
        </NoDataWrapper>
      );
    };

    const showLoader = () => <Spin size="small" />;

    let styledCard = [];

    if (testActivity.length > 0) {
      testActivity.map((student, index) => {
        const status = {
          color: "",
          status: ""
        };

        if (student.status === "notStarted") {
          status.status = "Not Started";
          status.color = red;
          if (endDate < Date.now()) {
            status.status = "Absent";
          }
        } else if (student.status === "inProgress") {
          status.status = "In Progress";
          status.color = yellow;
        } else if (student.status === "submitted") {
          if (student.graded) {
            status.status = "Graded";
          } else {
            status.status = "Submitted";
          }
          status.color = themeColorLighter;
        } else if (student.status === "redirected") {
          status.status = "Redirected";
          status.color = themeColorLighter;
        } else if (student.status === "absent") {
          status.status = "Absent";
          status.color = red;
        }

        let correctAnswers = 0;
        updateDisabledList(student.studentId, status.status);
        const questions = student.questionActivities.length;
        student.questionActivities.map(questionAct => {
          if (questionAct.correct) {
            correctAnswers++;
          }
          return null;
        });

        const stu_per = round((parseFloat(correctAnswers) / parseFloat(questions)) * 100, 2);
        const name = isPresentationMode ? student.fakeName : student.studentName || "-";
        /**
         * for differentiating archived students
         */
        const enrollMentFlag =
          enrollmentStatus[student.studentId] == 0 ? (
            <span title="Not Enrolled">
              <ExclamationMark />
            </span>
          ) : (
            ""
          );
        const studentData = (
          <StyledCard data-cy={`student-card-${name}`} bordered={false} key={index}>
            <PaginationInfoF>
              {isPresentationMode ? (
                <i style={{ color: student.color, fontSize: "32px" }} className={`fa fa-${student.icon}`}>
                  {" "}
                </i>
              ) : (
                <CircularDiv>{getAvatarName(student.studentName)}</CircularDiv>
              )}
              <StyledName>
                <StyledParaF data-cy="studentName" title={isPresentationMode ? undefined : student.userName}>
                  {name}
                </StyledParaF>
                {student.present ? (
                  <StyledParaS data-cy="studentStatus" color={status.color}>
                    {enrollMentFlag}
                    {status.status}
                  </StyledParaS>
                ) : (
                  <StyledColorParaS>{enrollMentFlag}Absent</StyledColorParaS>
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
              <PerfomanceSection>
                <StyledFlexDiv>
                  <StyledParaFF>Performance</StyledParaFF>
                  <StyledParaSSS data-cy="studentPerformance">
                    {student.score > 0 ? round((student.score / student.maxScore) * 100, 2) : 0}%
                  </StyledParaSSS>
                </StyledFlexDiv>
                <StyledFlexDiv>
                  <StyledParaSS data-cy="studentScore">
                    {round(student.score, 2) || 0} / {student.maxScore || 0}
                  </StyledParaSS>
                  {student.testActivityId && status.status !== "Absent" && (
                    <PagInfo data-cy="viewResponse" onClick={e => viewResponses(e, student.studentId)}>
                      {/* <Link to={`/author/classresponses/${student.testActivityId}`}> */}
                      VIEW RESPONSES <GSpan>&gt;&gt;</GSpan>
                      {/* </Link> */}
                    </PagInfo>
                  )}
                </StyledFlexDiv>
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
                    return <SquareColorDivGray title="skipped" weight={weight} key={questionIndex} />;
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
    if (isPresentationMode) {
      styledCard = shuffle(styledCard);
    }
    return (
      <StyledCardContiner>
        {!isLoading ? (testActivity && testActivity.length > 0 ? styledCard : noDataNotification()) : showLoader()}
      </StyledCardContiner>
    );
  }
}

export default connect(state => ({
  isLoading: get(state, "classResponse.loading")
}))(DisneyCardContainer);
