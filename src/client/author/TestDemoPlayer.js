import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import AssessmentPlayer from "../assessment";

const DemoPlayer = ({ match }) => {
  const { id: testId } = match.params;

  return <AssessmentPlayer testId={testId} preview demo />;
};

DemoPlayer.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(DemoPlayer);
