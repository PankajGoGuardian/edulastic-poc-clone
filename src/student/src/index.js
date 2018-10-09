import React from 'react';

import { ASSESSMENTID } from './constants/others';
import AssessmentPlayer from '../../assessment/src/index';

const Student = () => {
  const assessmentId = localStorage.getItem(ASSESSMENTID);
  return <AssessmentPlayer assessmentId={assessmentId} />;
};
export default Student;
