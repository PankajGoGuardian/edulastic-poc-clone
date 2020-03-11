import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import styled, { withTheme } from "styled-components";
import { questionType } from "@edulastic/constants";
import { get, isEmpty } from "lodash";
import { PrintPreviewScore } from "./printPreviewScore";
import FeedbackRight from "./FeedbackRight";
import FeedBackContainer from "./FeedBackContainer";
import StudentReportFeedback from "../../student/TestAcitivityReport/components/StudentReportFeedback";

const FeedbackWrapper = ({
  showFeedback,
  displayFeedback = false,
  isPrintPreview = false,
  theme,
  showCollapseBtn,
  data,
  prevQActivityForQuestion = {},
  isStudentReport,
  isPresentationMode
}) => {
  const { rubrics: rubricDetails } = data;
  const isPassageOrVideoType = [questionType.PASSAGE, questionType.VIDEO].includes(data.type);

  const studentReportFeedbackVisible = isStudentReport && !isPassageOrVideoType && !data.scoringDisabled;
  const disabled = get(data, "activity.disabled", false) || data.scoringDisabled;
  const userId = get(data, "activity.userId");
  const studentName = data.activity && data.activity.studentName;
  const presentationModeProps = {
    isPresentationMode,
    color: data.activity && data.activity.color,
    icon: data.activity && data.activity.icon
  };
  const { score: prevScore, maxScore: prevMaxScore, feedback: prevFeedback, correct } = prevQActivityForQuestion;
  return (
    <StyledFeedbackWrapper
      style={{
        width: showFeedback && !isPassageOrVideoType && displayFeedback && !studentReportFeedbackVisible && !isPrintPreview ? "265px" : theme?.twoColLayout?.second,
        minWidth: studentReportFeedbackVisible && displayFeedback && !isPrintPreview ? "320px" : ""
      }}
    >
      {showFeedback && !isPassageOrVideoType && displayFeedback && !studentReportFeedbackVisible && !isPrintPreview && (
        <FeedbackRight
          data-cy="feedBackRight"
          // eslint-disable-next-line
          twoColLayout={theme?.twoColLayout}
          showCollapseBtn={showCollapseBtn}
          disabled={disabled}
          widget={data}
          studentId={userId}
          studentName={studentName}
          rubricDetails={rubricDetails}
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
        <StudentReportFeedback qLabel={data.barLabel} qId={data.id} style={{ width: "100%" }} />
      )}
      {showFeedback && isPrintPreview && <PrintPreviewScore disabled={disabled} data={data} />}
      {showFeedback && isPrintPreview && (
        <div data-cy="teacherFeedBack" className="print-preview-feedback">
          {data?.activity?.feedback?.text ? <div>Teacher Feedback: {data.activity.feedback.text}</div> : null}
        </div>
      )}
    </StyledFeedbackWrapper>
  );
};

const StyledFeedbackWrapper = styled.div`
  align-self: normal;
  padding-bottom: 10px;
  ${({ style }) => style};
`;

FeedbackWrapper.propTypes = {
  data: PropTypes.object.isRequired,
  showFeedback: PropTypes.bool,
  displayFeedback: PropTypes.bool,
  isPrintPreview: PropTypes.bool,
  showCollapseBtn: PropTypes.bool,
  prevQActivityForQuestion: PropTypes.object,
  isStudentReport: PropTypes.bool,
  isPresentationMode: PropTypes.bool
};
FeedbackWrapper.defaultProps = {
  data: {},
  showFeedback: false,
  isPresentationMode: false,
  displayFeedback: true
};

const enhance = compose(
  withTheme,
  connect(
    state => ({
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false)
    }),
    null
  )
);

export default enhance(FeedbackWrapper);
