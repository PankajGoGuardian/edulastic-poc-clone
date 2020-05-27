import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { EduButton } from "@edulastic/common";
import {
  ModalWrapper,
  InitOptions,
  StyledInput,
  ModalFooter,
  LightGreenSpan
} from "../../../../common/components/ConfirmationModal/styled";

import {
  getToggleDeleteAssignmentModalState,
  toggleDeleteAssignmentModalAction,
  deleteAssignmentRequestAction as deleteAssignmetByTestId
} from "../../../sharedDucks/assignments";
import { deleteAssignmentAction as deleteAssigmnetByClass } from "../../../TestPage/components/Assign/ducks";

const DeleteAssignmentModal = ({
  toggleDeleteAssignmentModalState,
  toggleDeleteAssignmentModal,
  deleteAssignmetByTestIdRequest,
  deleteAssigmnetByClassRequest,
  testId,
  testName,
  assignmentId,
  classId,
  lcb,
  advancedAssignments,
  handleUnassignAssignments
}) => {
  const [confirmText, setConfirmText] = useState("");
  const handleUnassign = () => {
    if (confirmText.toLocaleLowerCase() === "unassign") {
      if (lcb) {
        return deleteAssigmnetByClassRequest({ assignmentId, classId, testId });
      }
      if (advancedAssignments) {
        return handleUnassignAssignments();
      }
      deleteAssignmetByTestIdRequest(testId);
    }
  };

  return (
    <StyledModal
      visible={toggleDeleteAssignmentModalState}
      width="750px"
      title="Unassign"
      onCancel={() => toggleDeleteAssignmentModal(false)}
      footer={[
        <ModalFooter>
          <EduButton isGhost key="cancel" onClick={() => toggleDeleteAssignmentModal(false)}>
            No, Cancel
          </EduButton>
          <EduButton
            data-cy="submitConfirm"
            key="delete"
            disabled={confirmText.toLocaleLowerCase() !== "unassign"}
            onClick={handleUnassign}
          >
            Yes, Unassign
          </EduButton>
        </ModalFooter>
      ]}
    >
      <InitOptions className="delete-message-container">
        <div className="delete-message">
          <p>
            Are you sure you want to unassign the assignment <b className="delete-message-test-name">{testName}</b>?
            This action will result in permanent deletion of student responses from the assigned class
            {!lcb ? " (es)." : "."}
          </p>
          <p>
            If you are sure, please type <LightGreenSpan>UNASSIGN</LightGreenSpan> in the space given below and proceed.
          </p>
        </div>
        <div className="delete-confirm-contaner">
          <StyledInput
            data-cy="confirmationInput"
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
    toggleDeleteAssignmentModal: toggleDeleteAssignmentModalAction,
    deleteAssignmetByTestIdRequest: deleteAssignmetByTestId,
    deleteAssigmnetByClassRequest: deleteAssigmnetByClass
  }
)(DeleteAssignmentModal);

export { ConnectedDeleteAssignmentModal as DeleteAssignmentModal };
