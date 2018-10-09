import React from "react";

import { ASSESSMENTID } from "./constants/others";
import AssessmentPlayer from "../../assessment/src/index";

const Student = ({ defaultAP }) => {
  const assessmentId = localStorage.getItem(ASSESSMENTID);
  return <AssessmentPlayer assessmentId={assessmentId} defaultAP={defaultAP} />;
};
export default Student;
