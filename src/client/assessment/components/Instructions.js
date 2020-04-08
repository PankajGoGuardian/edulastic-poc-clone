import React from "react";
import styled from "styled-components";
import { borderGrey2 } from "@edulastic/colors";
import { MathFormulaDisplay } from "@edulastic/common";
import { isRichTextFieldEmpty } from "../../author/questionUtils";

const Instructions = ({ item }) =>
  item.isScoringInstructionsEnabled && !isRichTextFieldEmpty(item.scoringInstructions) ? (
    <InstructionsContainer>
      <i style={{ lineHeight: "24px" }} className="fa fa-info-circle" aria-hidden="true" />
      <MathFormulaDisplay
        style={{ marginLeft: "10px" }}
        dangerouslySetInnerHTML={{ __html: item.scoringInstructions }}
      />
    </InstructionsContainer>
  ) : null;

const InstructionsContainer = styled.div`
  display: flex;
  border: 1px solid ${borderGrey2};
  border-radius: 4px;
  margin: 1rem 0;
  padding: 10px;
`;

export default Instructions;
