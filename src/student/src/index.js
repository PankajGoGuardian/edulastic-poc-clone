import React from 'react';
import PropTypes from 'prop-types';

import { ASSESSMENTID } from './constants/others';
import AssessmentPlayer from '../../assessment/src/index';

const Student = ({ defaultAP }) => {
  const assessmentId = localStorage.getItem(ASSESSMENTID);
  return <AssessmentPlayer assessmentId={assessmentId} defaultAP={defaultAP} />;
};

Student.propTypes = {
  defaultAP: PropTypes.any.isRequired,
};

export default Student;
