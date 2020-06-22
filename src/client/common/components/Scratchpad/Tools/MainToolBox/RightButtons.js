import React from "react";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { drawTools } from "@edulastic/constants";
import { StyledButton } from "../styled";
import { rightControls } from "../constants/controls";

const RightButtons = ({ onChangeTool, deleteMode, zwibbler }) => {
  const onClickHandler = mode => () => {
    if (drawTools.UNDO_TOOL === mode) {
      return zwibbler?.undo();
    }
    if (drawTools.REDO_TOOL === mode) {
      return zwibbler?.redo();
    }
    onChangeTool(mode);
  };

  return (
    <FlexContainer>
      {rightControls.map(btn => (
        <StyledButton
          key={btn.mode}
          id={btn.mode}
          pos={btn.pos}
          disabled={
            (!zwibbler?.canRedo() && btn.mode === drawTools.REDO_TOOL) ||
            (!zwibbler?.canUndo() && btn.mode === drawTools.UNDO_TOOL)
          }
          onClick={onClickHandler(btn.mode)}
          selected={deleteMode && btn.mode === drawTools.DELETE_TOOL}
        >
          <span />
        </StyledButton>
      ))}
    </FlexContainer>
  );
};

RightButtons.propTypes = {
  onChangeTool: PropTypes.func
};

RightButtons.defaultProps = {
  onChangeTool: () => null
};

export default RightButtons;
