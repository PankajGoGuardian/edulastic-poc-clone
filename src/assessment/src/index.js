import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadJSON } from './utils/loadjson';

// themes
import ThemeContainer from './themes/index';
import { loadTest } from './actions/test';

class AssessmentPlayer extends React.Component {
  componentDidMount() {
    const { dispatch, assessmentId, aId } = this.props;
    loadJSON(assessmentId, dispatch);
    this.props.dispatch(loadTest());
  }

  render() {
    const { defaultAP } = this.props;
    return <ThemeContainer defaultAP={defaultAP} />;
  }
}

AssessmentPlayer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  assessmentId: PropTypes.string.isRequired,
  defaultAP: PropTypes.any.isRequired
};

// export component
export default connect()(AssessmentPlayer);
