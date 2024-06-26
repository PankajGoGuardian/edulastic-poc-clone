import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal } from "antd";
import { themeColor } from "@edulastic/colors";
import { MathFormulaDisplay, CustomModalStyled, EduButton } from "@edulastic/common";
import { launchAssignmentFromLinkAction, startAssignmentAction, redirectToDashboardAction } from "./Assignments/ducks";
import { changeClassAction, getUserRole } from "./Login/ducks";
import { showTestInstructionsAction } from "./sharedDucks/AssignmentModule/ducks";

const StartAssignment = ({
  match,
  launchAssignment,
  changeClass,
  userRole,
  timedAssignment,
  startAssignment,
  redirectToDashboard,
  showInstruction,
  assignment,
  setShowTestInstruction,
  history
}) => {
  useEffect(() => {
    const { assignmentId, groupId } = match.params;
    if (userRole === "student") {
      changeClass(groupId);
    }
    launchAssignment({ assignmentId, groupId });
  }, []);

  useEffect(() => {
    if (timedAssignment) {
      const { assignmentId, groupId } = match.params;
      const { pauseAllowed, allowedTime, testId, testType = "assessment" } = timedAssignment;
      const content = pauseAllowed ? (
        <p>
          {" "}
          This is a timed assignment which should be finished within the time limit set for this assignment. The time
          limit for this assignment is{" "}
          <span data-cy="test-time" style={{ fontWeight: 700 }}>
            {" "}
            {allowedTime / (60 * 1000)} minutes
          </span>
          . Do you want to continue?
        </p>
      ) : (
        <p>
          {" "}
          This is a timed assignment which should be finished within the time limit set for this assignment. The time
          limit for this assignment is{" "}
          <span data-cy="test-time" style={{ fontWeight: 700 }}>
            {" "}
            {allowedTime / (60 * 1000)} minutes
          </span>{" "}
          and you can’t quit in between. Do you want to continue?
        </p>
      );

      Modal.confirm({
        title: "Do you want to Continue ?",
        content,
        onOk: () => {
          startAssignment({ testId, assignmentId, testType, classId: groupId });
          Modal.destroyAll();
        },
        onCancel: () => {
          redirectToDashboard();
          Modal.destroyAll();
        },
        okText: "Continue",
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor }
        }
      });
    }
  }, [timedAssignment]);

  const cancelInstructions = () => {
    setShowTestInstruction({ showInstruction: false, assignment: {} });
    history.push("/home/assignments");
  };

  const continueToTest = () => {
    const { assignmentId, groupId } = match.params;
    const { testId, testType = "assessment" } = assignment;
    startAssignment({ testId, assignmentId, testType, classId: groupId });
    setShowTestInstruction({ showInstruction: false, assignment: {} });
  };

  if (showInstruction && assignment.instruction) {
    const { instruction } = assignment;
    const footer = [
      <EduButton onClick={cancelInstructions} isGhost>
        <span>Cancel</span>
      </EduButton>,
      <EduButton onClick={continueToTest}>
        <span>Continue</span>
      </EduButton>
    ];

    return (
      <CustomModalStyled
        centered
        destroyOnClose
        maskClosable={false}
        title="Do you want to Continue ?"
        visible={showInstruction}
        footer={footer}
        onOk={continueToTest}
        onCancel={cancelInstructions}
      >
        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: instruction }} style={{ marginTop: "1rem" }} />
      </CustomModalStyled>
    );
  }
  return <div> Initializing Assignment... </div>;
};

StartAssignment.propTypes = {
  match: PropTypes.object.isRequired,
  launchAssignment: PropTypes.func.isRequired,
  changeClass: PropTypes.func.isRequired
};

export default connect(
  ({ studentAssignment }) => ({
    timedAssignment: studentAssignment.unconfirmedTimedAssignment,
    showInstruction: studentAssignment.showInstruction,
    assignment: studentAssignment.assignment
  }),
  {
    launchAssignment: launchAssignmentFromLinkAction,
    startAssignment: startAssignmentAction,
    redirectToDashboard: redirectToDashboardAction,
    changeClass: changeClassAction,
    userRole: getUserRole,
    setShowTestInstruction: showTestInstructionsAction
  }
)(StartAssignment);
