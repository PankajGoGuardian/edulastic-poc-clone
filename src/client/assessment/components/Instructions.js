import React from "react";
import styled from "styled-components";
import { borderGrey2 } from "@edulastic/colors";
import { MathFormulaDisplay } from "@edulastic/common";
import PropTypes from "prop-types";
import { isRichTextFieldEmpty } from "../../author/questionUtils";
import { getFontSize } from "../utils/helpers";

const Instructions = ({
  item: { scoringInstructions = "", uiStyle: { fontsize = "" } = {}, isScoringInstructionsEnabled = false } = {}
}) =>
  isScoringInstructionsEnabled && !isRichTextFieldEmpty(scoringInstructions) ? (
    <InstructionsContainer>
      <i
        style={{ display: "flex", alignItems: "center", fontSize: fontsize }}
        className="fa fa-info-circle"
        aria-hidden="true"
      />
      <MathFormulaDisplay
        style={{ marginLeft: "10px" }}
        dangerouslySetInnerHTML={{ __html: scoringInstructions }}
        fontSize={getFontSize(fontsize)}
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

Instructions.protoTypes = {
  item: PropTypes.shape({
    uiStyle: PropTypes.shape({
      fontSize: PropTypes.string.isRequired
    }).isRequired,
    scoringInstructions: PropTypes.string.isRequired,
    isScoringInstructionsEnabled: PropTypes.bool.isRequired
  }).isRequired
};

export default Instructions;
