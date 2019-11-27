import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Radio, Row } from "antd";
import styled from "styled-components";

import {
  ModalWrapper,
  InitOptions,
  StyledButton,
  StyledInput,
  ModalFooter,
  LightGreenSpan
} from "../../../../common/components/ConfirmationModal/styled";

import {
  getToggleDeleteAssignmentModalState,
  toggleDeleteAssignmentModalAction,
  deleteAssignmentRequestAction
} from "../../../sharedDucks/assignments";

const DeleteAssignmentModal = ({
  toggleDeleteAssignmentModalState,
  toggleDeleteAssignmentModalAction,
  deleteAssignmentRequestAction,
  testId,
  testName
}) => {
  const [confirmText, setConfirmText] = useState("");

  return (
    <StyledModal
      visible={toggleDeleteAssignmentModalState}
      width="750px"
      title="Unassign"
      onCancel={() => toggleDeleteAssignmentModalAction(false)}
      footer={[
        <ModalFooter>
          <StyledButton cancel={true} key="cancel" onClick={() => toggleDeleteAssignmentModalAction(false)}>
            No, Cancel
          </StyledButton>
          ,
          <StyledButton
            key="delete"
            type="primary"
            disabled={confirmText.toLocaleLowerCase() !== "unassign"}
            onClick={() => {
              if (confirmText.toLocaleLowerCase() === "unassign") {
                deleteAssignmentRequestAction(testId);
              }
            }}
          >
            Yes, Unassign
          </StyledButton>
        </ModalFooter>
      ]}
    >
      <InitOptions className="delete-message-container">
        <div className="delete-message">
          <p>
            Are you sure you want to unassign the assignment <b className="delete-message-test-name">{testName}</b>?
            This action will result in permanent deletion of student responses from the assigned class(es).
          </p>
          <p>
            If you are sure, please type <LightGreenSpan>UNASSIGN</LightGreenSpan> in the space given below and proceed.
          </p>
        </div>
        <div className="delete-confirm-contaner">
          <StyledInput
            className="delete-confirm-input"
            type="text"
            onChange={event => setConfirmText(event.currentTarget.value)}
          />
        </div>
      </InitOptions>
    </StyledModal>
  );
};

const StyledModal = styled(ModalWrapper)`
  .ant-modal-body {
    .delete-message-container {
      font-weight: 600;

      .delete-message-test-name {
        font-weight: bold;
      }
    }
  }
`;

const ConnectedDeleteAssignmentModal = connect(
  state => ({
    toggleDeleteAssignmentModalState: getToggleDeleteAssignmentModalState(state)
  }),
  {
    toggleDeleteAssignmentModalAction,
    deleteAssignmentRequestAction
  }
)(DeleteAssignmentModal);

export { ConnectedDeleteAssignmentModal as DeleteAssignmentModal };
