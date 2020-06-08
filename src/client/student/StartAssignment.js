import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { launchAssignmentFromLinkAction } from "./Assignments/ducks";
import { changeClassAction, getUserRole } from "./Login/ducks";

const StartAssignment = ({ match, launchAssignment, changeClass, userRole }) => {
  useEffect(() => {
    const { assignmentId, groupId } = match.params;
    if (userRole === "student") {
      changeClass(groupId);
    }
    launchAssignment({ assignmentId, groupId });
  }, []);
  return <div> Initializing Assignment... </div>;
};

StartAssignment.propTypes = {
  match: PropTypes.object.isRequired,
  launchAssignment: PropTypes.func.isRequired,
  changeClass: PropTypes.func.isRequired
};

export default connect(
  null,
  {
    launchAssignment: launchAssignmentFromLinkAction,
    changeClass: changeClassAction,
    userRole: getUserRole
  }
)(StartAssignment);
