import React, { useState, memo } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import {
  extraDesktopWidth,
  mobileWidthMax,
  smallDesktopWidth,
  lightGreySecondary,
  largeDesktopWidth,
  desktopWidth
} from "@edulastic/colors";
import { test as testConstants } from "@edulastic/constants";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { first, maxBy } from "lodash";
import { Row, Col, message } from "antd";
import { TokenStorage } from "@edulastic/api";

//  components
import AssessmentDetails from "./AssessmentDetail";
import StartButton from "../Assignments/components/StartButton";
import ReviewButton from "../Reports/components/ReviewButton";
import SafeStartAssignButton from "../styled/AssignmentCardButton";
import Attempt from "./Attempt";

// actions
import { startAssignmentAction, resumeAssignmentAction } from "../Assignments/ducks";

const isSEB = () => window.navigator.userAgent.includes("SEB");

const SafeBrowserButton = ({
  testId,
  testType,
  assignmentId,
  testActivityId,
  startDate,
  t,
  startTest,
  attempted,
  resume,
  classId
}) => {
  const startButtonText = resume ? t("common.resume") : attempted ? t("common.retake") : t("common.startAssignment");

  const token = TokenStorage.getAccessToken();
  let url;
  if (process.env.POI_APP_API_URI.startsWith("http")) {
    url = `${process.env.POI_APP_API_URI.replace("http", "seb").replace(
      "https",
      "seb"
    )}/test-activity/seb/test/${testId}/type/${testType}/assignment/${assignmentId}`;
  } else if (process.env.POI_APP_API_URI.startsWith("//")) {
    url = `${window.location.protocol.replace("http", "seb")}${
      process.env.POI_APP_API_URI
    }/test-activity/seb/test/${testId}/type/${testType}/assignment/${assignmentId}`;
  } else {
    console.warn(`** can't figure out where to put seb protocol **`);
  }

  if (testActivityId) {
    url += `/testActivity/${testActivityId}`;
  }

  url += `/token/${token}/settings.seb?classId=${classId}`;
  return (
    <SafeStartAssignButton href={url} assessment>
      {startButtonText}
    </SafeStartAssignButton>
  );
};

const AssignmentCard = memo(({ startAssignment, resumeAssignment, data, theme, t, type, classId, userRole }) => {
  const [showAttempts, setShowAttempts] = useState(false);
  const toggleAttemptsView = () => setShowAttempts(prev => !prev);
  const { releaseGradeLabels } = testConstants;

  let {
    test = {},
    reports = [],
    endDate,
    testId,
    startDate,
    open = false,
    close = false,
    _id: assignmentId,
    safeBrowser,
    isPaused = false,
    testType,
    class: clazz = [],
    maxAttempts = 1,
    title,
    thumbnail
  } = data;

  const currentClassList = clazz.filter(cl => cl._id === classId);
  if (!startDate || !endDate) {
    const maxCurrentClass =
      currentClassList && currentClassList.length > 0
        ? maxBy(currentClassList, "endDate") || currentClassList[currentClassList.length - 1]
        : {};
    open = maxCurrentClass.open;
    close = maxCurrentClass.close;
    startDate = maxCurrentClass.startDate;
    endDate = maxCurrentClass.endDate;
    isPaused = maxCurrentClass.isPaused;
  }
  if (!startDate && open) {
    const maxCurrentClass =
      currentClassList && currentClassList.length > 0
        ? maxBy(currentClassList, "openDate") || currentClassList[currentClassList.length - 1]
        : {};
    startDate = maxCurrentClass.openDate;
    isPaused = maxCurrentClass.isPaused;
  }
  if (!endDate && close) {
    endDate = (currentClass && currentClass.length > 0
      ? maxBy(currentClass, "closedDate") || currentClass[currentClass.length - 1]
      : {}
    ).closedDate;
  }

  const lastAttempt = maxBy(reports, o => parseInt(o.createdAt)) || {};
  // if last test attempt was not *submitted*, user should be able to resume it.
  const resume = lastAttempt.status == 0;
  const absent = lastAttempt.status == 2;
  const graded =
    lastAttempt.graded && lastAttempt.graded.toLowerCase() === "in grading" ? "submitted" : lastAttempt.graded;
  let newReports = resume ? reports.slice(0, reports.length - 1) : reports.slice(0);
  newReports = newReports || [];
  const { maxScore = 0, score = 0 } = first(newReports) || {};
  const attempted = !!(newReports && newReports.length);
  const attemptCount = newReports && newReports.length;
  const scorePercentage = (score / maxScore) * 100 || 0;
  const arrow = showAttempts ? "\u2191" : "\u2193";

  const startTest = () => {
    if (endDate < Date.now()) {
      return message.error("Test is expired");
    }
    if (resume) {
      resumeAssignment({
        testId,
        testType,
        assignmentId,
        testActivityId: lastAttempt._id,
        classId
      });
    } else if (attemptCount < maxAttempts) {
      startAssignment({ testId, assignmentId, testType, classId });
    }
  };

  const { activityReview = true } = data;
  let { releaseScore } = data.class.find(item => item._id === classId) || {};

  if (!releaseScore) {
    releaseScore = data.releaseScore;
  }

  const showReviewButton =
    releaseScore !== releaseGradeLabels.DONT_RELEASE && releaseScore !== releaseGradeLabels.SCORE_ONLY;
  const StartButtonContainer =
    type === "assignment"
      ? userRole !== "parent" &&
        (safeBrowser && !(new Date(startDate) > new Date() || !startDate) && !isSEB() ? (
          <SafeBrowserButton
            data-cy="start"
            testId={testId}
            testType={testType}
            testActivityId={lastAttempt._id}
            assignmentId={assignmentId}
            btnName={t("common.startAssignment")}
            startDate={startDate}
            t={t}
            startTest={startTest}
            attempted={attempted}
            resume={resume}
            classId={classId}
          />
        ) : (
          <StartButton
            assessment
            data-cy="start"
            safeBrowser={safeBrowser}
            startDate={startDate}
            t={t}
            isPaused={isPaused}
            startTest={startTest}
            attempted={attempted}
            resume={resume}
            classId={classId}
          />
        ))
      : showReviewButton &&
        !absent && (
          <ReviewButton
            data-cy="review"
            testId={testId}
            isPaused={isPaused}
            testActivityId={lastAttempt._id}
            title={test.title}
            activityReview={activityReview}
            t={t}
            attempted={attempted}
            classId={classId}
          />
        );

  const isValidAttempt = attempted;

  const getColSize = type => {
    let colsCount = 1;

    if (isValidAttempt) {
      colsCount += 1;
    }

    if (type == "assignment") {
      return colsCount;
    }

    return 4;
  };

  const selectedColSize = 24 / getColSize(type);
  let btnWrapperSize = 24;
  if (type !== "assignment") {
    btnWrapperSize =
      releaseScore === releaseGradeLabels.DONT_RELEASE ? 18 : releaseScore === releaseGradeLabels.WITH_ANSWERS ? 6 : 12;
  } else if (isValidAttempt) {
    btnWrapperSize = 12;
  }

  const ScoreDetail = (
    <React.Fragment>
      {releaseScore === releaseGradeLabels.WITH_ANSWERS && (
        <AnswerAndScore xs={selectedColSize}>
          <span data-cy="score">
            {Math.round(score * 100) / 100}/{Math.round(maxScore * 100) / 100}
          </span>
          <Title>{t("common.correctAnswer")}</Title>
        </AnswerAndScore>
      )}
      <AnswerAndScore xs={selectedColSize}>
        <span data-cy="percent">{Math.round(scorePercentage)}%</span>
        <Title>{t("common.score")}</Title>
      </AnswerAndScore>
    </React.Fragment>
  );

  return (
    <CardWrapper data-cy={`test-${data.testId}`}>
      <AssessmentDetails
        data-cy={`test-${data.testId}`}
        title={title}
        thumbnail={thumbnail}
        theme={theme}
        testType={testType}
        t={t}
        type={type}
        started={attempted}
        resume={resume}
        dueDate={endDate}
        startDate={startDate}
        safeBrowser={safeBrowser}
        graded={graded}
        absent={absent}
        isPaused={isPaused}
        lastAttempt={lastAttempt}
      />
      <ButtonAndDetail>
        <DetailContainer>
          <AttemptDetails isValidAttempt={isValidAttempt}>
            {isValidAttempt && (
              <React.Fragment>
                <Attempts xs={selectedColSize} onClick={toggleAttemptsView}>
                  <span data-cy="attemptsCount">
                    {attemptCount}/{maxAttempts || attemptCount}
                  </span>
                  <AttemptsTitle data-cy="attemptClick">
                    {arrow} &nbsp;&nbsp;{t("common.attemps")}
                  </AttemptsTitle>
                </Attempts>
                {type !== "assignment" && releaseScore !== releaseGradeLabels.DONT_RELEASE && ScoreDetail}
              </React.Fragment>
            )}
            {StartButtonContainer && (
              <StyledActionButton
                isAssignment={type == "assignment"}
                isValidAttempt={isValidAttempt}
                sm={btnWrapperSize}
              >
                {StartButtonContainer}
              </StyledActionButton>
            )}
          </AttemptDetails>
        </DetailContainer>
        {showAttempts &&
          newReports.map(attempt => (
            <Attempt
              key={attempt._id}
              data={attempt}
              activityReview={activityReview}
              type={type}
              releaseScore={releaseScore}
              showReviewButton={showReviewButton}
              releaseGradeLabels={releaseGradeLabels}
              classId={attempt.groupId}
            />
          ))}
      </ButtonAndDetail>
    </CardWrapper>
  );
});

const enhance = compose(
  withTheme,
  withRouter,
  withNamespaces("assignmentCard"),
  connect(
    state => ({
      userRole: state?.user?.user?.role
    }),
    {
      startAssignment: startAssignmentAction,
      resumeAssignment: resumeAssignmentAction
    },
    undefined, // (a, b, c) => ({ ...a, ...b, ...c }), // mergeProps
    { pure: false }
  )
);

export default enhance(AssignmentCard);

AssignmentCard.propTypes = {
  data: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  startAssignment: PropTypes.func.isRequired,
  resumeAssignment: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const CardWrapper = styled(Row)`
  display: flex;
  padding: 25px 0px;
  border-bottom: 1px solid #f2f2f2;

  &:last-child {
    border-bottom: 0px;
  }

  @media (max-width: ${extraDesktopWidth}) {
    padding: 20px 0px;
  }

  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    padding: 24px 0;
    border: 1px solid
      ${props => (props.theme.assignment && props.theme.assignment.attemptsReviewRowBgColor) || lightGreySecondary};
    border-radius: 10px;
    margin-top: 20px;
  }
`;

const ButtonAndDetail = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 62%;

  @media screen and (min-width: 1025px) {
    margin-left: auto;
  }
  @media (max-width: ${largeDesktopWidth}) {
    width: 55%;
  }
  @media (max-width: ${desktopWidth}) {
    width: 64%;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    width: 100%;
  }
`;

const AttemptDetails = styled(Row)`
  width: 65%;
  display: flex;

  ${({ isValidAttempt }) =>
    !isValidAttempt &&
    `
    justify-content: flex-end
  `}

  @media screen and (max-width: ${mobileWidthMax}) {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
  @media only screen and (min-width: ${largeDesktopWidth}) {
    flex: 1;
  }
  @media (max-width: ${largeDesktopWidth}) {
    width:100%;
  }
`;

const AnswerAndScore = styled(Col)`
  display: flex;
  align-items: center;
  flex-direction: column;

  & > span {
    font-size: ${props => props.theme.assignment.cardAnswerAndScoreTextSize};
    font-weight: bold;
    color: ${props => props.theme.assignment.cardAnswerAndScoreTextColor};
    @media (max-width: ${smallDesktopWidth}) {
      font-size: ${props => props.theme.subtitleFontSize};
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    flex: 1;
  }
`;

const StyledActionButton = styled(AnswerAndScore)`
  @media screen and (max-width: ${mobileWidthMax}) {
    align-items: center;
  }

  align-items: ${({ isValidAttempt, isAssignment }) => (!isValidAttempt || isAssignment ? "flex-end" : "center")};
  justify-content: center;
`;

const Attempts = AnswerAndScore;

const DetailContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media screen and (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`;

const AttemptsTitle = styled.div`
  font-size: ${props => props.theme.assignment.cardAttemptLinkFontSize};
  font-weight: 600;
  color: ${props => props.theme.assignment.cardAttemptLinkTextColor};
  cursor: pointer;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${props => props.theme.smallLinkFontSize};
  }
`;

const Title = styled.div`
  font-size: ${props => props.theme.assignment.cardResponseBoxLabelsFontSize};
  font-weight: 600;
  color: ${props => props.theme.assignment.cardResponseBoxLabelsColor};
  text-align: center;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${props => props.theme.smallLinkFontSize};
  }
`;
