import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input } from "antd";
import { ReportIssueContainer, ReportHeader, CloseButton, TextAreaSendButton } from "./styled";
import { reportContentErrorAction } from "../../../../TestPage/components/AddItems/ducks";
import { submitReviewFeedbackAction } from "../../../../ItemList/ducks";
import { getUserRole } from "../../../../../student/Login/ducks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const ReportIssue = ({
  textareaRows,
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

  useEffect(() => {
    if (visible === false) clearComment();
  }, [visible]);

  useEffect(() => {
    if (confirmationResponse) reportError();
  }, [confirmationResponse]);

  const checkForConfirmation = () => {
    if (toggleModal && userRole === "student") toggleModal(true);
    else reportError();
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

  const setCommentValue = e => {
    const comment = e.target.value;
    setReportComment(comment);
  };

  const clearComment = () => {
    setReportComment("");
  };

  return (
    <ReportIssueContainer>
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
      <div style={{ overflow: "hidden" }}>
        <Input.TextArea
          rows={textareaRows}
          placeholder="Enter content issue..."
          value={reportedComment}
          onChange={e => setCommentValue(e)}
        />
        <TextAreaSendButton disabled={!reportedComment} onClick={checkForConfirmation}>
          Send
        </TextAreaSendButton>
      </div>
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
