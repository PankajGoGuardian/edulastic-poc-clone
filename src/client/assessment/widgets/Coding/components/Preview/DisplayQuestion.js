import React from "react";
import { white } from "@edulastic/colors";

import { StyledWrapper, StyledTitle, StyledQuestionBody } from "./styled";

const DisplayQuestion = ({ stimulus, stimulusBody, layout }) => {
  const style = { background: white };
  if (layout === "column") {
    style.width = "100%";
  }
  return (
    <StyledWrapper style={style}>
      <StyledTitle>{stimulus}</StyledTitle>
      <StyledQuestionBody dangerouslySetInnerHTML={{ __html: stimulusBody }} />
    </StyledWrapper>
  );
};

export default DisplayQuestion;
