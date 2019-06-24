import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { test as testConstants } from "@edulastic/constants";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { last, maxBy } from "lodash";
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
  resume
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

  url += `/token/${token}/settings.seb`;
  return <SafeStartAssignButton href={url}>{startButtonText}</SafeStartAssignButton>;
};

const AssignmentCard = ({ startAssignment, resumeAssignment, data, theme, t, type, currentGroup }) => {
  const [showAttempts, setShowAttempts] = useState(false);

  const toggleAttemptsView = () => setShowAttempts(prev => !prev);
  const { releaseGradeLabels } = testConstants;

  let {
    test = {},
    reports = [],
    endDate,
    testId,
    startDate,
    _id: assignmentId,
    safeBrowser,
    testType,
    class: clazz = [],
    maxAttempts,
    title,
    thumbnail
  } = data;

  if (!startDate && !endDate) {
    const currentClass = maxBy(clazz.filter(cl => (currentGroup ? cl._id === currentGroup : true)), "endDate") || {};
    startDate = currentClass.startDate;
    endDate = currentClass.endDate;
  }
  if (!startDate) {
    startDate = (maxBy(clazz.filter(cl => (currentGroup ? cl._id === currentGroup : true)), "openDate") || {}).openDate;
  }
  if (!endDate) {
    endDate = (maxBy(clazz.filter(cl => (currentGroup ? cl._id === currentGroup : true)), "closedDate") || {})
      .closedDate;
  }
  const lastAttempt = last(reports) || {};
  // if last test attempt was not *submitted*, user should be able to resume it.
  const resume = lastAttempt.status == 0;
  const absent = lastAttempt.status == 2;
  let newReports = resume ? reports.slice(0, reports.length - 1) : reports.slice(0);
  newReports = newReports || [];
  const { correct = 0, wrong = 0, maxScore = 0, score = 0, skipped = 0 } = last(newReports) || {};
  const attempted = !!(newReports && newReports.length);
  const attemptCount = newReports && newReports.length;
  const totalQuestions = correct + wrong + skipped || 0;
  const scorePercentage = (score / maxScore) * 100 || 0;
  const arrow = showAttempts ? "\u2193" : "\u2191";

  const startTest = () => {
    if (endDate < Date.now()) {
      return message.error("Test is expired");
    }
    if (resume) {
      resumeAssignment({
        testId,
        testType,
        assignmentId,
        testActivityId: lastAttempt._id
      });
    } else if (attemptCount < maxAttempts) {
      startAssignment({ testId, assignmentId, testType });
    }
  };

  const { releaseScore = releaseGradeLabels.DONT_RELEASE, activityReview = true } = data;
  const showReviewButton = releaseScore !== releaseGradeLabels.DONT_RELEASE;
  const ScoreDetail = (
    <React.Fragment>
      {releaseScore === releaseGradeLabels.WITH_ANSWERS && (
        <AnswerAndScore>
          <span data-cy="score">
            {correct}/{totalQuestions}
          </span>
          <Title>{t("common.correctAnswer")}</Title>
        </AnswerAndScore>
      )}
      <AnswerAndScore>
        <span data-cy="percent">{Math.floor(scorePercentage * 100) / 100}%</span>
        <Title>{t("common.score")}</Title>
      </AnswerAndScore>
    </React.Fragment>
  );

  return (
    <CardWrapper>
      <AssessmentDetails
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
        graded={lastAttempt.graded}
        absent={absent}
      />
      <ButtonAndDetail>
        <DetailContainer>
          {attempted && (
            <AttemptDetails>
              <Attempts onClick={toggleAttemptsView}>
                <span data-cy="attemptsCount">
                  {attemptCount}/{maxAttempts || attemptCount}
                </span>
                <AttemptsTitle data-cy="attemptClick">
                  {arrow} &nbsp;&nbsp;{t("common.attemps")}
                </AttemptsTitle>
              </Attempts>
              {releaseScore !== releaseGradeLabels.DONT_RELEASE && ScoreDetail}
            </AttemptDetails>
          )}
          {type === "assignment" ? (
            safeBrowser && !(new Date(startDate) > new Date()) && !isSEB() ? (
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
              />
            ) : (
              <StartButton
                data-cy="start"
                safeBrowser={safeBrowser}
                startDate={startDate}
                t={t}
                startTest={startTest}
                attempted={attempted}
                resume={resume}
              />
            )
          ) : (
            showReviewButton && (
              <ReviewButton
                data-cy="review"
                testActivityId={lastAttempt._id}
                title={test.title}
                activityReview={activityReview}
                t={t}
                attempted={attempted}
              />
            )
          )}
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
            />
          ))}
      </ButtonAndDetail>
    </CardWrapper>
  );
};

const enhance = compose(
  withTheme,
  withRouter,
  withNamespaces("assignmentCard"),
  connect(
    null,
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
  padding: 28px 0;
  border-bottom: 1px solid #f2f2f2;
  &:last-child {
    border-bottom: 0px;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    padding: 10px 0;
  }
`;

const ButtonAndDetail = styled(Col)`
  display: flex;
  flex-direction: column;
  width: 62%;
  @media screen and (min-width: 1025px) {
    margin-left: auto;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    width: 100%;
  }
`;

const AttemptDetails = styled(Col)`
  display: flex;
  @media screen and (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const AnswerAndScore = styled.div`
  width: 135px;
  display: flex;
  align-items: center;
  flex-direction: column;
  span {
    font-size: ${props => props.theme.assignment.cardAnswerAndScoreTextSize};
    font-weight: bold;
    color: ${props => props.theme.assignment.cardAnswerAndScoreTextColor};
  }
  @media screen and (max-width: 767px) {
    width: 33%;
  }
`;

const Attempts = AnswerAndScore;

const DetailContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;

const AttemptsTitle = styled.div`
  font-size: ${props => props.theme.assignment.cardAttemptLinkFontSize};
  font-weight: 600;
  color: ${props => props.theme.assignment.cardAttemptLinkTextColor};
  cursor: pointer;
`;

const Title = styled.div`
  font-size: ${props => props.theme.assignment.cardResponseBoxLabelsFontSize};
  font-weight: 600;
  color: ${props => props.theme.assignment.cardResponseBoxLabelsColor};
`;
