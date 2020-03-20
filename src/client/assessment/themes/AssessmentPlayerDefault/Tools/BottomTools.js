import React from "react";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { Trash, Redo, Undo } from "./tools";
import { StyledButton } from "./styled";

const BottomTools = ({ undo, redo, onToolChange, deleteMode }) => (
  <FlexContainer flexDirection="column" className="scratchpad-action-tools">
    <StyledButton onClick={undo}>
      <Undo />
    </StyledButton>
    <StyledButton onClick={redo}>
      <Redo />
    </StyledButton>
    <StyledButton onClick={onToolChange("deleteMode")} active={deleteMode}>
      <Trash />
    </StyledButton>
  </FlexContainer>
);

BottomTools.propTypes = {
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
  onToolChange: PropTypes.func.isRequired,
  deleteMode: PropTypes.bool.isRequired
};

export default BottomTools;
