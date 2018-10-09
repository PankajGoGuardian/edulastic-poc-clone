import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { loadJSON } from "./utils/loadjson";

// themes
import ThemeContainer from "./themes/index";

class AssessmentPlayer extends React.Component {
  componentDidMount() {
    const { dispatch, assessmentId } = this.props;
    loadJSON(assessmentId, dispatch);
  }

  render() {
    return <ThemeContainer defaultAP={this.props.defaultAP} />;
  }
}

AssessmentPlayer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  assessmentId: PropTypes.string.isRequired
};

// export component
export default connect()(AssessmentPlayer);
