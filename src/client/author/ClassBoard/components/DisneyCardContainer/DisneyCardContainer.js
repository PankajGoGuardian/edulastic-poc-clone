import React, { Component } from "react";
import PropTypes from "prop-types";
import { round, shuffle, get } from "lodash";
import { Col, Row, Spin } from "antd";
import styled from "styled-components";
import { themeColorLighter, yellow, red, themeColor } from "@edulastic/colors";
import { connect } from "react-redux";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import { CheckboxLabel } from "@edulastic/common";
import WithDisableMessage from "../../../src/components/common/ToggleDisable";
import {
  ScratchPadIcon,
  StyledIconCol,
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
import { formatStudentPastDueTag, maxDueDateFromClassess } from "../../../../student/utils";

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

  static defaultProps = {
    isPresentationMode: false,
    isLoading: false,
    testActivityLoading: false,
    hoverActiveStudentActive: null
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
    const { testActivity, hoverActiveStudentActive } = this.state;
    const {
      selectedStudents,
      studentSelect,
      studentUnselect,
      viewResponses,
      isPresentationMode,
      endDate,
      isLoading,
      testActivityLoading,
      enrollmentStatus,
      isItemsVisible,
      closed,
      t,
      dueDate,
      detailedClasses,
      classId,
      recentAttemptsGrouped
    } = this.props;

    const noDataNotification = () => (
      <NoDataWrapper height="300px" margin="20px auto">
        <NoDataBox width="300px" height="200px" descSize="14px">
          <img src={NoDataIcon} svgWidth="40px" alt="noData" />
          <h4>No Data</h4>
          <p>Students have not yet been assigned</p>
        </NoDataBox>
      </NoDataWrapper>
    );

    const showLoader = () => <Spin size="small" />;
    let styledCard = [];
    const classess = detailedClasses?.filter(({ _id }) => _id === classId);

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
          status.status = student.status;
          if (student?.graded === "GRADED") {
            status.status = "Graded";
          } else if (student?.graded === "IN GRADING") {
            status.status = "In Grading";
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

        const name = isPresentationMode ? student.fakeName : student.studentName || "Anonymous";
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
        const actualDueDate = maxDueDateFromClassess(classess, student.studentId);
        const pastDueTag =
          (actualDueDate || dueDate) && status.status !== "Absent"
            ? formatStudentPastDueTag({
                status: student.status,
                dueDate: actualDueDate || dueDate,
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
            onMouseEnter={() => this.setState({ hoverActiveStudentActive: student.studentId })}
            onMouseLeave={() => this.setState({ hoverActiveStudentActive: null })}
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
                    data-cy="studentAvatarName"
                    isLink={viewResponseStatus.includes(status.status)}
                    title={isPresentationMode ? "" : student.userName}
                    onClick={e =>
                      viewResponseStatus.includes(status.status) ? viewResponses(e, student.studentId) : ""
                    }
                  >
                    {getAvatarName(student.studentName || "Anonymous")}
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
                      {pastDueTag && (
                        <StatusRow>
                          <span>{pastDueTag}</span>
                        </StatusRow>
                      )}
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
                    }
                    if (questionAct.skipped && questionAct.score === 0) {
                      return <SquareColorDivGray title="skipped" weight={weight} key={questionIndex} />;
                    }
                    if (questionAct.graded === false || questionAct.pendingEvaluation) {
                      return <SquareColorBlue key={questionIndex} />;
                    }
                    if (questionAct.score === questionAct.maxScore && questionAct.score > 0) {
                      return <SquareColorDivGreen key={questionIndex} />;
                    }
                    if (questionAct.score > 0 && questionAct.score < questionAct.maxScore) {
                      return <SquareColorDivYellow key={questionIndex} />;
                    }
                    if (questionAct.score === 0) {
                      return <SquareColorDivPink key={questionIndex} />;
                    }
                    return null;
                  })}
              </PaginationInfoT>

              {recentAttemptsGrouped?.[student.studentId]?.length > 0 &&
                hoverActiveStudentActive === student.studentId && (
                  <RecentAttemptsContainer>
                    <PaginationInfoS>
                      <PerfomanceSection>
                        <StyledFlexDiv>
                          <StyledParaFF>Performance</StyledParaFF>
                        </StyledFlexDiv>
                        <StyledFlexDiv style={{ justifyContent: "flex-start" }}>
                          <AttemptDiv>
                            <StyledParaSS>
                              {round(student.score || student._score, 2) || 0} / {student.maxScore || 0}
                            </StyledParaSS>
                            <StyledParaSSS>
                              {student.score > 0 ? round((student.score / student.maxScore) * 100, 2) : 0}%
                            </StyledParaSSS>
                            <p>Attempt {recentAttemptsGrouped[student.studentId][0].number + 1}</p>
                          </AttemptDiv>
                          {recentAttemptsGrouped?.[student.studentId].map(attempt => (
                            <AttemptDiv key={attempt._id || attempt.id}>
                              <StyledParaSS>
                                {round(attempt.score, 2) || 0} / {attempt.maxScore || 0}
                              </StyledParaSS>
                              <StyledParaSSS>
                                {attempt.score > 0 ? round((attempt.score / attempt.maxScore) * 100, 2) : 0}%
                              </StyledParaSSS>
                              <p>Attempt {attempt.number}</p>
                            </AttemptDiv>
                          ))}
                        </StyledFlexDiv>
                      </PerfomanceSection>
                    </PaginationInfoS>
                  </RecentAttemptsContainer>
                )}
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
  isItemsVisible: isItemVisibiltySelector(state),
  recentAttemptsGrouped: state?.author_classboard_testActivity?.data?.recentTestActivitiesGrouped || {}
}));

export default compose(
  withNamespaces("classBoard"),
  withConnect
)(DisneyCardContainer);

const AttemptDiv = styled.div`
  text-align: center;
  width: 33%;
  ${StyledParaSSS} {
    margin-left: 0;
  }
`;

const RecentAttemptsContainer = styled.div`
  position: absolute;
  top: 98px;
  width: 100%;
  left: 0px;
  padding-left: 20px;
  box-sizing: border-box;
  padding-right: 20px;
  height: 80px;
  background: #fff;
  opacity: 0;
  transition: opacity 0.7s;
  ${StyledCard}:hover & {
    opacity: 1;
  }
`;
