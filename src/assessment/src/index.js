import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// themes
import ThemeContainer from './themes/index';
import { loadTest } from './actions/test';

class AssessmentPlayer extends React.Component {
  componentDidMount() {
    const { loadTest: load } = this.props;
    load();
  }

  render() {
    const { defaultAP } = this.props;
    return <ThemeContainer defaultAP={defaultAP} />;
  }
}

AssessmentPlayer.propTypes = {
  defaultAP: PropTypes.any.isRequired,
  loadTest: PropTypes.func.isRequired,
};

// export component
export default connect(
  () => {},
  {
    loadTest,
  },
)(AssessmentPlayer);
