import React from "react";

/**
 * pass related props from assesment players to the question components
 * there are many components in between
 * so use this context intead of drilling props
 */
const assessmentPlayerContext = React.createContext({
  isStudentAttempt: false
});

export default assessmentPlayerContext;
