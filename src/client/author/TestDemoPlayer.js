import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import AssessmentPlayer from "../assessment";

const DemoPlayer = ({ match, isPublic }) => {
  const { id: testId } = match.params;

  return <AssessmentPlayer testId={testId} preview demo sharedType={isPublic && "PUBLIC"} />;
};

DemoPlayer.propTypes = {
  match: PropTypes.object.isRequired,
  isPublic: PropTypes.bool
};

export default withRouter(DemoPlayer);
