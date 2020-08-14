import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import { FroalaEditor } from "@edulastic/common";

import { ReportIssueContainer, ReportHeader, CloseButton, TextAreaSendButton } from "./styled";
import { reportContentErrorAction } from "../../../../TestPage/components/AddItems/ducks";
import { submitReviewFeedbackAction } from "../../../../ItemList/ducks";
import { getUserRole } from "../../../../../student/Login/ducks";

const ReportIssue = ({
  item,
  toggleReportIssue,
  reportTestItemError,
  visible,
  toggleModal,
  confirmationResponse,
  userRole,
  submitReviewFeedback
}) => {
  const [reportedComment, setReportComment] = useState("");

  const setCommentValue = comment => {
    setReportComment(comment);
  };

  const clearComment = () => {
    setReportComment("");
  };

  const reportError = () => {
    if (reportedComment) {
      reportTestItemError({
        contentId: item._id,
        contentType: "testitem",
        comments: reportedComment
      });
      submitReviewFeedback({
        status: "content error",
        data: {
          type: "testItem",
          referrerType: "TestItemContent",
          referrerId: item._id,
          data: {
            note: reportedComment
          },
          status: "content error"
        }
      });
      setTimeout(toggleReportIssue(), 1000);
    }
  };

  const checkForConfirmation = () => {
    if (toggleModal && userRole === "student") {
      toggleModal(true);
    } else {
      reportError();
    }
  };

  useEffect(() => {
    if (visible === false) clearComment();
  }, [visible]);

  useEffect(() => {
    if (confirmationResponse) reportError();
  }, [confirmationResponse]);

  return (
    <ReportIssueContainer className="report">
      <ReportHeader>
        <span>
          <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
          Report Content Issue
        </span>
        <CloseButton
          icon="close"
          onClick={() => {
            clearComment();
            toggleReportIssue();
          }}
        />
      </ReportHeader>

      <FroalaEditor
        placeholder="Enter content issue..."
        onChange={setCommentValue}
        value={reportedComment}
        border="border"
        toolbarId="report-content-issue-toolbar"
        allowQuickInsert={false}
        data-cy="report-content-issue-input"
      />

      <TextAreaSendButton disabled={!reportedComment} onClick={checkForConfirmation}>
        Send
      </TextAreaSendButton>
    </ReportIssueContainer>
  );
};

export default connect(
  state => ({
    userRole: getUserRole(state)
  }),
  {
    reportTestItemError: reportContentErrorAction,
    submitReviewFeedback: submitReviewFeedbackAction
  }
)(ReportIssue);
