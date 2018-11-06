import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { testIdSelector } from './selectors/routes';
// themes
import ThemeContainer from './themes/index';
import { loadTest as LoadTestAction } from './actions/test';

const AssessmentPlayer = ({ defaultAP, loadTest, testId, test }) => {
  useEffect(() => {
    loadTest(test, testId);
  }, []);

  return <ThemeContainer defaultAP={defaultAP} />;
};

AssessmentPlayer.propTypes = {
  defaultAP: PropTypes.any.isRequired,
  loadTest: PropTypes.func.isRequired,
  testId: PropTypes.string,
  test: PropTypes.bool,
};

AssessmentPlayer.defaultProps = {
  testId: '',
  test: false,
};
// export component
export default connect(
  state => ({
    testId: testIdSelector(state),
  }),
  {
    loadTest: LoadTestAction,
  },
)(AssessmentPlayer);
