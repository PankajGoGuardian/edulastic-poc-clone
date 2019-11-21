import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Radio, Row } from "antd";
import styled from "styled-components";

import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

import {
  getToggleDeleteAssignmentModalState,
  toggleDeleteAssignmentModalAction,
  deleteAssignmentRequestAction
} from "../../../sharedDucks/assignments";

const DeleteAssignmentModal = ({
  toggleDeleteAssignmentModalState,
  toggleDeleteAssignmentModalAction,
  deleteAssignmentRequestAction,
  testId
}) => {
  const [confirmText, setConfirmText] = useState("");

  return (
    <StyledModal
      visible={toggleDeleteAssignmentModalState}
      title="Delete"
      onCancel={() => toggleDeleteAssignmentModalAction(false)}
      footer={[
        <Button key="cancel" onClick={() => toggleDeleteAssignmentModalAction(false)}>
          No, Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          onClick={() => {
            if (confirmText.toLocaleLowerCase() === "delete") {
              deleteAssignmentRequestAction(testId);
            }
          }}
        >
          Yes, Delete
        </Button>
      ]}
    >
      <div className="delete-message">
        <p>
          Are you sure you want to delete the assignment <b>Assignment name</b> from the selected class(es)? This action
          will result in permanent deletion of student responses in the selected class(es).
        </p>
        <p>
          If you are sure, please type <b>Delete</b> in the space given below and proceed.
        </p>
      </div>
      <div className="delete-confirm-contaner">
        <input
          className="delete-confirm-input"
          type="text"
          onChange={event => setConfirmText(event.currentTarget.value)}
        />
      </div>
    </StyledModal>
  );
};

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-body {
      flex-direction: column;

      .delete-confirm-contaner {
        margin-top: 10px;
        .delete-confirm-input {
          border: solid 1px;
          padding: 10px;
        }
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
