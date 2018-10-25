import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import AssessmentPlayer from '../../assessment/src/index';

const Student = ({ defaultAP, location }) => {
  let aId = 'all';

  return <AssessmentPlayer aId={aId} defaultAP={defaultAP} />;
};

Student.propTypes = {
  defaultAP: PropTypes.any.isRequired
};

export default withRouter(Student);
