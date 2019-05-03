import React, { useEffect } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter } from "react-router-dom";
// themes
import ThemeContainer from "./themes/index";
import { loadTestAction } from "./actions/test";

const AssessmentPlayer = ({ defaultAP, loadTest, match, preview = false, testId, demo }) => {
  useEffect(() => {
    testId = preview ? testId : match.params.id;
    const { utaId: testActivityId } = match.params;

    loadTest({ testId, testActivityId, preview, demo });
  }, []);

  if (preview) {
    return <ThemeContainer defaultAP preview />;
  }

  return (
    <Switch>
      <Route path={`${match.url}/qid/:qid`} render={() => <ThemeContainer defaultAP={defaultAP} url={match.url} />} />
    </Switch>
  );
};

AssessmentPlayer.propTypes = {
  defaultAP: PropTypes.any.isRequired,
  loadTest: PropTypes.func.isRequired,
  match: PropTypes.any.isRequired,
  preview: PropTypes.any,
  testId: PropTypes.string
};

AssessmentPlayer.defaultProps = {
  preview: false,
  testId: ""
};

// export component
const enhance = compose(
  withRouter,
  connect(
    null,
    {
      loadTest: loadTestAction
    }
  )
);
export default enhance(AssessmentPlayer);
