import { EduButton, CustomModalStyled } from "@edulastic/common";
import React, { useState } from "react";
import { connect } from "react-redux";
import { roleuser } from "@edulastic/constants";
import {
  InitOptions,
  LightGreenSpan,
  ModalFooter,
  StyledInput
} from "../../../../common/components/ConfirmationModal/styled";
import {
  deleteAssignmentRequestAction as deleteAssignmetByTestId,
  getToggleDeleteAssignmentModalState,
  toggleDeleteAssignmentModalAction
} from "../../../sharedDucks/assignments";
import { deleteAssignmentAction as deleteAssigmnetByClass } from "../../../TestPage/components/Assign/ducks";
import { bulkUnassignAssignmentAction } from "../../../AssignmentAdvanced/ducks";
import { getUserRole } from "../../../src/selectors/user";

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
  handleUnassignAssignments,
  bulkUnassignAssignmentRequest,
  testType,
  userRole
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

      if (roleuser.DA_SA_ROLE_ARRAY.includes(userRole)) {
        bulkUnassignAssignmentRequest({
          data: {},
          testId,
          testType,
          fromHomePage: true
        });
        return toggleDeleteAssignmentModal(false);
      }
      deleteAssignmetByTestIdRequest(testId);
    }
  };

  return (
    <CustomModalStyled
      visible={toggleDeleteAssignmentModalState}
      width="750px"
      title="Unassign"
      onCancel={() => toggleDeleteAssignmentModal(false)}
      destroyOnClose
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
            This action will result in <span style={{ color: "#ed6a6b" }}> permanent deletion </span>of student
            responses from the assigned class ,Are you sure that you want to unassign{" "}
            <b className="delete-message-test-name">{testName}</b>?{!lcb ? " (es)." : "."}
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
            placeholder="Type the action"
            onChange={event => setConfirmText(event.currentTarget.value)}
          />
        </div>
      </InitOptions>
    </CustomModalStyled>
  );
};

const ConnectedDeleteAssignmentModal = connect(
  state => ({
    toggleDeleteAssignmentModalState: getToggleDeleteAssignmentModalState(state),
    userRole: getUserRole(state)
  }),
  {
    toggleDeleteAssignmentModal: toggleDeleteAssignmentModalAction,
    deleteAssignmetByTestIdRequest: deleteAssignmetByTestId,
    deleteAssigmnetByClassRequest: deleteAssigmnetByClass,
    bulkUnassignAssignmentRequest: bulkUnassignAssignmentAction
  }
)(DeleteAssignmentModal);

export { ConnectedDeleteAssignmentModal as DeleteAssignmentModal };
