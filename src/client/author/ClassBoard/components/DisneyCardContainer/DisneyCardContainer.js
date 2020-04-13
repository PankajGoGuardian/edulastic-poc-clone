import React, { Component } from "react";
import PropTypes from "prop-types";
import { round, shuffle, get } from "lodash";
import { Col, Row, Spin } from "antd";
import { themeColorLighter, yellow, red, themeColor } from "@edulastic/colors";
import { connect } from "react-redux";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import { CheckboxLabel } from "@edulastic/common";
import WithDisableMessage from "../../../src/components/common/ToggleDisable";
import { ScratchPadIcon, StyledIconCol } from "./styled";

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
  ExclamationMark,
  StatusRow
} from "./styled";
import { NoDataBox, NoDataWrapper, NoDataIcon } from "../../../src/components/common/NoDataNotification";
import { getAvatarName } from "../../Transformer";
import { isItemVisibiltySelector, testActivtyLoadingSelector } from "../../ducks";
import { formatStudentPastDueTag } from "../../../../student/utils";

class DisneyCardContainer extends Component {
  static propTypes = {
    selectedStudents: PropTypes.object.isRequired,
    studentSelect: PropTypes.func.isRequired,
    studentUnselect: PropTypes.func.isRequired,
    viewResponses: PropTypes.func.isRequired,
    isPresentationMode: PropTypes.bool,
    isLoading: PropTypes.bool,
    testActivityLoading: PropTypes.bool
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
      testActivityLoading,
      enrollmentStatus,
      isItemsVisible,
      closed,
      t,
      dueDate
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
      /**
       * FIXME:
       * 1. mutating testActivity inside map
       * 2. move this sort of tranforming code somewhere else
       */
      testActivity.map((student, index) => {
        const status = {
          color: "",
          status: ""
        };

        let hasUsedScratchPad = false;
        student?.questionActivities.every(questionActivity => {
          // check if this breaks after we find a true value.
          if (questionActivity?.scratchPad?.scratchpad === true) {
            hasUsedScratchPad = true;
            return false;
          }
          return true;
        });

        if (student.status === "notStarted") {
          status.status = "Not Started";
          status.color = red;
          if (endDate < Date.now() || closed) {
            status.status = "Absent";
          }
        } else if (student.status === "inProgress") {
          status.status = "In Progress";
          status.color = yellow;
        } else if (student.status === "submitted") {
          if (student?.graded === "GRADED") {
            status.status = "Graded";
          } else if (student?.graded === "IN GRADING") {
            status.status = "In Grading";
          } else {
            status.status = student?.graded;
          }
          status.color = themeColorLighter;
        } else if (student.status === "redirected") {
          status.status = "Redirected";
          status.color = themeColorLighter;
        } else if (student.status === "absent") {
          status.status = "Absent";
          status.color = red;
        }
        const viewResponseStatus = ["Submitted", "In Progress", "Graded"];
        let correctAnswers = 0;
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
        const canShowResponse = isItemsVisible && viewResponseStatus.includes(status.status);
        const pastDueTag =
          dueDate && status.status !== "Absent"
            ? formatStudentPastDueTag({
                status: student.status,
                dueDate,
                endDate: student.endDate
              })
            : null;

        const studentData = (
          <StyledCard
            data-cy={`student-card-${name}`}
            bordered={false}
            key={index}
            isClickEnable={canShowResponse}
            onClick={e => (canShowResponse ? viewResponses(e, student.studentId, student.testActivityId) : () => {})}
          >
            <WithDisableMessage disabled={!isItemsVisible} errMessage={t("common.testHidden")}>
              <PaginationInfoF>
                {isPresentationMode ? (
                  <i
                    onClick={e =>
                      viewResponseStatus.includes(status.status) ? viewResponses(e, student.studentId) : ""
                    }
                    style={{
                      color: student.color,
                      fontSize: "32px",
                      marginRight: "12px",
                      cursor: viewResponseStatus.includes(status.status) ? "pointer" : "default"
                    }}
                    className={`fa fa-${student.icon}`}
                  >
                    {" "}
                  </i>
                ) : (
                  <CircularDiv
                    isLink={viewResponseStatus.includes(status.status)}
                    title={isPresentationMode ? "" : student.userName}
                    onClick={e =>
                      viewResponseStatus.includes(status.status) ? viewResponses(e, student.studentId) : ""
                    }
                  >
                    {getAvatarName(student.studentName)}
                  </CircularDiv>
                )}
                <StyledName>
                  <StyledParaF
                    isLink={viewResponseStatus.includes(status.status)}
                    data-cy="studentName"
                    disabled={!isItemsVisible}
                    title={isPresentationMode ? "" : student.userName}
                    onClick={e =>
                      viewResponseStatus.includes(status.status) ? viewResponses(e, student.studentId) : ""
                    }
                  >
                    {name}
                  </StyledParaF>
                  {student.present ? (
                    <>
                      <StyledParaS
                        isLink={viewResponseStatus.includes(status.status)}
                        data-cy="studentStatus"
                        color={status.color}
                        onClick={e =>
                          viewResponseStatus.includes(status.status) ? viewResponses(e, student.studentId) : ""
                        }
                      >
                        {enrollMentFlag}
                        {status.status}
                      </StyledParaS>
                      {pastDueTag && <StatusRow>{pastDueTag}</StatusRow>}
                    </>
                  ) : (
                    <StyledColorParaS>{enrollMentFlag}Absent</StyledColorParaS>
                  )}
                </StyledName>
                <RightAlignedCol>
                  <Row>
                    <Col onClick={e => e.stopPropagation()}>
                      <CheckboxLabel
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
                  <Row style={{ display: "flex" }}>
                    {hasUsedScratchPad && (
                      <StyledIconCol title="Student has used scratchpad">
                        <ScratchPadIcon />
                      </StyledIconCol>
                    )}
                    {student.redirected && (
                      <StyledIconCol>
                        <i
                          data-cy="redirected"
                          title="Assessment is redirected to the student. The most recent response will be shown"
                          className="fa fa-external-link"
                          aria-hidden="true"
                          style={{ color: themeColor }}
                        />
                      </StyledIconCol>
                    )}
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
                      <PagInfo
                        data-cy="viewResponse"
                        disabled={!isItemsVisible}
                        onClick={e => viewResponses(e, student.studentId, student.testActivityId)}
                      >
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
                      return <SquareColorDisabled key={questionIndex} />;
                    } else if (questionAct.skipped && questionAct.score === 0) {
                      return <SquareColorDivGray title="skipped" weight={weight} key={questionIndex} />;
                    } else if (questionAct.graded === false || questionAct.pendingEvaluation) {
                      return <SquareColorBlue key={questionIndex} />;
                    } else if (questionAct.score === questionAct.maxScore && questionAct.score > 0) {
                      return <SquareColorDivGreen key={questionIndex} />;
                    } else if (questionAct.score > 0 && questionAct.score < questionAct.maxScore) {
                      return <SquareColorDivYellow key={questionIndex} />;
                    } else if (questionAct.score === 0) {
                      return <SquareColorDivPink key={questionIndex} />;
                    }
                    return null;
                  })}
              </PaginationInfoT>
            </WithDisableMessage>
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
        {!isLoading && !testActivityLoading
          ? testActivity && testActivity.length > 0
            ? styledCard
            : noDataNotification()
          : showLoader()}
      </StyledCardContiner>
    );
  }
}

const withConnect = connect(state => ({
  isLoading: get(state, "classResponse.loading"),
  testActivityLoading: testActivtyLoadingSelector(state),
  isItemsVisible: isItemVisibiltySelector(state)
}));

export default compose(
  withNamespaces("classBoard"),
  withConnect
)(DisneyCardContainer);
