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
  userRole,
  deleteAssignmentFromPlaylist,
  fromPlaylist = false
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [unassignConfirmation, setUnassignConfirmation] = useState(false);
  const handleUnassign = () => {
    if (confirmText.toLocaleLowerCase() === "unassign") {
      if (unassignConfirmation) {
        if (lcb) {
          return deleteAssigmnetByClassRequest({ assignmentId, classId, testId });
        }
        if (advancedAssignments) {
          return handleUnassignAssignments();
        }
        if (fromPlaylist) {
          return deleteAssignmentFromPlaylist();
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
      } else {
        setUnassignConfirmation(true);
      }
    }
  };

  const onCancel = () => {
    if (unassignConfirmation) {
      setUnassignConfirmation(false);
    } else {
      toggleDeleteAssignmentModal(false);
    }
  };

  return (
    <CustomModalStyled
      visible={toggleDeleteAssignmentModalState}
      width="750px"
      title="Unassign Complete Class"
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <ModalFooter>
          <EduButton isGhost key="cancel" onClick={onCancel}>
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
      {unassignConfirmation ? (
        <div>
          <p style={{ color: "red" }}>
            This action will delete the data for the entire class for this assignment. Do you want to continue?
          </p>
        </div>
      ) : (
        <InitOptions className="delete-message-container">
          <div className="delete-message">
            <p>
              This action will result in <span style={{ color: "#ed6a6b" }}> permanent deletion </span>of student
              responses from the assigned class ,Are you sure that you want to unassign{" "}
              <b className="delete-message-test-name">{testName}</b>?{!lcb ? " (es)." : "."}
            </p>
            <p>
              If you are sure, please type <LightGreenSpan>UNASSIGN</LightGreenSpan> in the space given below and
              proceed.
            </p>
          </div>
          <div className="delete-confirm-contaner">
            <StyledInput
              data-cy="confirmationInput"
              className="delete-confirm-input"
              type="text"
              placeholder="Type the action"
              value={confirmText}
              onChange={event => setConfirmText(event.currentTarget.value)}
            />
          </div>
        </InitOptions>
      )}
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
