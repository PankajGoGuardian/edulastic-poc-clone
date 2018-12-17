import React from 'react';
import PropTypes from 'prop-types';

import AssessmentPlayer from '../../assessment/src/index';

const Student = props => <AssessmentPlayer {...props} />;

Student.propTypes = {
  defaultAP: PropTypes.any.isRequired
};

export default Student;
