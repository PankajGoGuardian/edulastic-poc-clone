import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import styled, { withTheme } from "styled-components";
import { questionType } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { get, isEmpty, round } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { PrintPreviewScore } from "./printPreviewScore";
import FeedbackRight from "./FeedbackRight";
import FeedBackContainer from "./FeedBackContainer";
import StudentReportFeedback from "../../student/TestAcitivityReport/components/StudentReportFeedback";
import { TimeSpentWrapper } from "./QuestionWrapper";

const FeedbackWrapper = ({
  showFeedback,
  displayFeedback = false,
  isPrintPreview = false,
  showCollapseBtn,
  data,
  prevQActivityForQuestion = {},
  isStudentReport,
  isPresentationMode,
  dimensions,
  shouldTakeDimensionsFromStore,
  studentId,
  itemId,
  studentName,
  t
}) => {
  const { rubrics: rubricDetails } = data;
  const isPassageOrVideoType = [questionType.PASSAGE, questionType.VIDEO].includes(data.type);

  const { validation: { unscored: isPracticeQuestion = false } = {} } = data;

  const studentReportFeedbackVisible = isStudentReport && !isPassageOrVideoType && !data.scoringDisabled;
  const disabled = get(data, "activity.disabled", false) || data.scoringDisabled;
  const userId = get(data, "activity.userId");
  const userName = get(data, "activity.studentName");
  const presentationModeProps = {
    isPresentationMode,
    color: data.activity && data.activity.color,
    icon: data.activity && data.activity.icon
  };

  const { score: prevScore, maxScore: prevMaxScore, feedback: prevFeedback, correct } = prevQActivityForQuestion;
  const timeSpent = get(data, "activity.timeSpent", false);

  if (isPrintPreview && disabled) {
    return null;
  }

  return (
    <StyledFeedbackWrapper
      minWidth={studentReportFeedbackVisible && displayFeedback && !isPrintPreview ? "320px" : ""}
      shouldTakeDimensionsFromStore={shouldTakeDimensionsFromStore}
      dimensions={dimensions}
      className="__print-feedback-wrapper"
    >
      {showFeedback && !isPassageOrVideoType && displayFeedback && !studentReportFeedbackVisible && !isPrintPreview && (
        <FeedbackRight
          data-cy="feedBackRight"
          showCollapseBtn={showCollapseBtn}
          disabled={disabled}
          widget={data}
          studentId={userId || studentId}
          studentName={userName || studentName || t("common.anonymous")}
          rubricDetails={rubricDetails}
          isPracticeQuestion={isPracticeQuestion}
          itemId={itemId}
          {...presentationModeProps}
        />
      )}
      {!isEmpty(prevQActivityForQuestion) && displayFeedback && !isPrintPreview && (
        <FeedBackContainer
          data-cy="feedBackContainer"
          correct={correct}
          prevScore={prevScore}
          prevMaxScore={prevMaxScore}
          prevFeedback={prevFeedback}
          itemId={data.id}
        />
      )}
      {/* STUDENT REPORT PAGE FEEDBACK */}
      {studentReportFeedbackVisible && displayFeedback && !isPrintPreview && (
        <StudentReportFeedback
          isPracticeQuestion={isPracticeQuestion}
          qLabel={data.barLabel}
          qId={data.id}
          isStudentReport={isStudentReport}
        />
      )}
      {showFeedback && isPrintPreview && !disabled && <PrintPreviewScore disabled={disabled} data={data} />}
      {isPrintPreview && timeSpent && showFeedback && !disabled && (
        <div className="__prevent-page-break __print-time-spent">
          <TimeSpentWrapper style={{ justifyContent: "center" }}>
            <FontAwesomeIcon icon={faClock} aria-hidden="true" />
            {round(timeSpent / 1000, 1)}s
          </TimeSpentWrapper>
        </div>
      )}
      {showFeedback && isPrintPreview && data?.activity?.feedback?.text && (
        <div data-cy="teacherFeedBack" className="print-preview-feedback">
          <div>Teacher Feedback: {data.activity.feedback.text}</div>
        </div>
      )}
    </StyledFeedbackWrapper>
  );
};

const StyledFeedbackWrapper = styled.div`
  align-self: normal;
  padding-bottom: 10px;
  min-width: ${({ minWidth }) => minWidth}
    /**
   * as per https://snapwiz.atlassian.net/browse/EV-12821
   *
   * if its a multipart item, with item level scoring off
   * the container dimensions for the question block is stored in store
   * need to take the dimensions from store and set it to the feedback block
   */
    ${({ shouldTakeDimensionsFromStore, dimensions }) =>
      shouldTakeDimensionsFromStore &&
      dimensions &&
      `
        position: absolute;
        top: ${dimensions.top}px;
        right: 0;
        width: 100%;
        height: ${dimensions.height ? `${dimensions.height}px` : "100%"};
      `};
`;

FeedbackWrapper.propTypes = {
  data: PropTypes.object,
  showFeedback: PropTypes.bool,
  displayFeedback: PropTypes.bool,
  isPrintPreview: PropTypes.bool.isRequired,
  showCollapseBtn: PropTypes.bool.isRequired,
  prevQActivityForQuestion: PropTypes.object.isRequired,
  isStudentReport: PropTypes.bool.isRequired,
  isPresentationMode: PropTypes.bool,
  t: PropTypes.func.isRequired
};
FeedbackWrapper.defaultProps = {
  data: {},
  showFeedback: false,
  isPresentationMode: false,
  displayFeedback: true
};

const enhance = compose(
  withNamespaces("student"),
  withTheme,
  connect(
    (state, ownProps) => ({
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      dimensions: get(state, ["feedback", ownProps.data?.id], null)
    }),
    null
  )
);

export default enhance(FeedbackWrapper);
