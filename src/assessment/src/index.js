import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadJSON } from './utils/loadjson';

// themes
import ThemeContainer from './themes/index';
import { loadTest } from './actions/test';

class AssessmentPlayer extends React.Component {
  componentDidMount() {
    this.props.loadTest();
  }

  render() {
    const { defaultAP } = this.props;
    return <ThemeContainer defaultAP={defaultAP} />;
  }
}

AssessmentPlayer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  defaultAP: PropTypes.any.isRequired
};

// export component
export default connect(
  () => {},
  {
    loadTest
  }
)(AssessmentPlayer);
