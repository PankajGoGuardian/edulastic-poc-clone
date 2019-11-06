import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input } from "antd";
import { ReportIssueContainer, ReportHeader, CloseButton, TextAreaSendButton } from "./styled";
import { reportContentErrorAction } from "../../../../TestPage/components/AddItems/ducks";
import { getUserRole } from "../../../../../student/Login/ducks";

const ReportIssue = ({
  textareaRows,
  item,
  toggleReportIssue,
  reportTestItemError,
  visible,
  toggleModal,
  confirmationResponse,
  userRole
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
          <i class="fa fa-exclamation-triangle" aria-hidden="true" />
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
  { reportTestItemError: reportContentErrorAction }
)(ReportIssue);
