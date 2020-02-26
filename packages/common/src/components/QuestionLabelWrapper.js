import React from "react";
import { FlexContainer } from "@edulastic/common";

const QuestionLabelWrapper = ({ children }) => (
  <FlexContainer flexDirection="column" alignItems="baseline" justifyContent="flex-start">
    {children}
  </FlexContainer>
);

export default QuestionLabelWrapper;
