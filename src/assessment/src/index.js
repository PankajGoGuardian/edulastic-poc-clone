import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadJSON } from './utils/loadjson';

// themes
import ThemeContainer from './themes/index';

class AssessmentPlayer extends React.Component {
  componentDidMount() {
    const { dispatch, assessmentId } = this.props;
    loadJSON(assessmentId, dispatch);
  }

  render() {
    const { defaultAP } = this.props;
    return <ThemeContainer />;
  }
}

// props
AssessmentPlayer.defaultProps = {
  defaultAP: false,
};

AssessmentPlayer.propType = {
  dispatch: PropTypes.func.isRequired,
  defaultAP: PropTypes.bool,
  assessmentId: PropTypes.string,
};

// export component
export default connect()(AssessmentPlayer);
