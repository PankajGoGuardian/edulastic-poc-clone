import React from "react";
import { FlexContainer } from "@edulastic/common";

const QuestionContentWrapper = ({ children }) => (
  <FlexContainer alignItems="flex-start" flexDirection="column" width="100%">
    {children}
  </FlexContainer>
);

export default QuestionContentWrapper;
