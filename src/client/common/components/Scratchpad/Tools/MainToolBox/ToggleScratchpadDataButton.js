import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getUserRole } from "../../../../../author/src/selectors/user";
import { toggleScratchpadVisbilityAction } from "../../duck";
import { TogglerWrapper } from "../styled";

function Toggler({ userRole, hideData, toggleVisibility }) {
  const isTeacher = userRole === "teacher";
  const state = hideData ? "show" : "hide";

  return (
    <TogglerWrapper onClick={toggleVisibility} isTeacher={isTeacher}>
      {state} student work
    </TogglerWrapper>
  );
}

Toggler.propTypes = {
  userRole: PropTypes.string.isRequired,
  hideData: PropTypes.bool.isRequired,
  toggleVisibility: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userRole: getUserRole(state),
  hideData: state?.scratchpad?.hideData
});

const mapDispatchToProps = {
  toggleVisibility: toggleScratchpadVisbilityAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toggler);
