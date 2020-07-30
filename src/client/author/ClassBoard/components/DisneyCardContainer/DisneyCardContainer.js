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
    testActivityLoading: false
  };

  constructor(props) {
    super(props);
    this.state = {
      testActivity: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { testActivity, assignmentId, classId, isPresentationMode } = props;
    return {
      testActivity: !state.isPresentationMode && isPresentationMode ? shuffle(testActivity) : testActivity,
      assignmentId,
      classId,
      isPresentationMode
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
      recentAttemptsGrouped,
      testActivities
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
    const styledCard = [];
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
          status.status = student?.graded === "GRADED" ? "Graded" : student.status;
          status.color = themeColorLighter;
        } else if (student.status === "redirected") {
          status.status = "Redirected";
          status.color = themeColorLighter;
        } else if (student.status === "absent") {
          status.status = "Absent";
          status.color = red;
        }

        const score = (_status, attemptScore) => {
          /* for redirected, old attempts status will show in numbers like START = 0, SUBMITTED = 1, ABSENT = 2 */
          if (_status === "absent" || _status === 2 || _status === "notStarted") {
            return <span style={{ marginTop: "-3px" }}>-</span>;
          }
          return <span>{round(attemptScore || student.score || student._score, 2) || 0}</span>;
        };

        const currentTestActivity = testActivities?.find(attempt => student.studentId == attempt.userId) || {};

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
        const responseLink = student.testActivityId && status.status !== "Absent" && (
          <PagInfo
            data-cy="viewResponse"
            disabled={!isItemsVisible}
            onClick={e => viewResponses(e, student.studentId, student.testActivityId)}
          >
            {/* <Link to={`/author/classresponses/${student.testActivityId}`}> */}
            VIEW RESPONSES <GSpan>&gt;&gt;</GSpan>
            {/* </Link> */}
          </PagInfo>
        );
        const studentData = (
          <StyledCard
            data-cy={`student-card-${name}`}
            bordered={false}
            key={index}
            isClickEnable={canShowResponse}
            onClick={e => (canShowResponse ? viewResponses(e, student.studentId, student.testActivityId) : () => {})}
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
                    title={student.userName}
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
              <div onMouseEnter={() => this.setState({ hoverActiveStudentActive: student.studentId })}>
                <PaginationInfoS>
                  <PerfomanceSection>
                    <StyledFlexDiv>
                      <StyledParaFF>Performance</StyledParaFF>
                      <StyledParaSSS data-cy="studentPerformance">
                        {student.score > 0 && student.status !== "redirected"
                          ? round((student.score / student.maxScore) * 100, 2)
                          : 0}
                        %
                      </StyledParaSSS>
                    </StyledFlexDiv>
                    <StyledFlexDiv>
                      <StyledParaSS data-cy="studentScore">
                        {score(student.status)}/ {student.maxScore || 0}
                      </StyledParaSS>
                      {responseLink}
                    </StyledFlexDiv>
                  </PerfomanceSection>
                </PaginationInfoS>
                <PaginationInfoT data-cy="questions">
                  {student.questionActivities
                    .filter(x => !x.disabled)
                    .map((questionAct, questionIndex) => {
                      const weight = questionAct.weight;
                      if (questionAct.notStarted || student.status === "redirected") {
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
              </div>
              {(recentAttemptsGrouped?.[student.studentId]?.length > 0 || student.status === "redirected") &&
                hoverActiveStudentActive === student.studentId && (
                  <RecentAttemptsContainer>
                    <PaginationInfoS>
                      <PerfomanceSection>
                        <StyledFlexDiv>
                          <StyledParaFF>Performance</StyledParaFF>
                          <StyledParaFF>{responseLink}</StyledParaFF>
                        </StyledFlexDiv>
                        <StyledFlexDiv style={{ justifyContent: "flex-start" }}>
                          {student.status === "redirected" && (
                            <AttemptDiv>
                              <StyledParaSSS>&nbsp;</StyledParaSSS>
                              <StyledParaSS style={{ fontSize: "12px" }}>Not Started</StyledParaSS>
                              <p style={{ fontSize: "12px" }}>
                                Attempt {(recentAttemptsGrouped[student.studentId]?.[0]?.number || 0) + 2}
                              </p>
                            </AttemptDiv>
                          )}
                          <AttemptDiv
                            className="attempt-container"
                            onClick={e =>
                              viewResponses(
                                e,
                                student.studentId,
                                student.testActivityId,
                                (recentAttemptsGrouped[student.studentId]?.[0]?.number || 0) + 1
                              )
                            }
                          >
                            <CenteredStyledParaSS>
                              {score(currentTestActivity.status)} / {student.maxScore || 0}
                            </CenteredStyledParaSS>
                            <StyledParaSSS>
                              {student.score > 0 ? round((student.score / student.maxScore) * 100, 2) : 0}%
                            </StyledParaSSS>
                            <p style={{ fontSize: "12px" }}>
                              Attempt {(recentAttemptsGrouped[student.studentId]?.[0]?.number || 0) + 1}
                            </p>
                          </AttemptDiv>
                          {recentAttemptsGrouped?.[student.studentId].map(attempt => (
                            <AttemptDiv
                              className="attempt-container"
                              key={attempt._id || attempt.id}
                              onClick={e => viewResponses(e, attempt.userId, attempt._id, attempt.number)}
                            >
                              <CenteredStyledParaSS>
                                {score(attempt.status, attempt.score)} / {attempt.maxScore || 0}
                              </CenteredStyledParaSS>
                              <StyledParaSSS>
                                {attempt.score > 0 ? round((attempt.score / attempt.maxScore) * 100, 2) : 0}%
                              </StyledParaSSS>
                              <p style={{ fontSize: "12px" }}>Attempt {attempt.number}</p>
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
  recentAttemptsGrouped: state?.author_classboard_testActivity?.data?.recentTestActivitiesGrouped || {},
  testActivities: state?.author_classboard_testActivity?.data?.testActivities || {}
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

const CenteredStyledParaSS = styled(StyledParaSS)`
  justify-content: center;
`;

const RecentAttemptsContainer = styled.div`
  position: absolute;
  top: 96px;
  width: 100%;
  height: 80px;
  left: 0px;
  padding-left: 20px;
  box-sizing: border-box;
  padding-right: 20px;
  background: #fff;
  opacity: 0;
  transition: opacity 0.7s;
  .attempt-container {
    :hover {
      cursor: pointer;
      border: 1px solid #dadae4;
      box-shadow: 8px 4px 10px rgba(0, 0, 0, 0.1);
    }
  }
  ${StyledCard}:hover & {
    opacity: 1;
  }
`;
