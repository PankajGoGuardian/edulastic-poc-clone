import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";
import { notification } from "@edulastic/common";
import { drawTools } from "@edulastic/constants";
import MainToolBox from "./MainToolBox";
import SubToolBox from "./SubToolBox";
import { updateScratchpadAction } from "../duck";
import { ToolBoxContainer } from "./styled";
import ZwibblerContext from "../common/ZwibblerContext";

const Tools = props => {
  const { scratchData, updateScratchPad, undoScratchPad, redoScratchPad } = props;
  const {
    fillColor,
    lineWidth,
    lineColor,
    fontSize,
    fontFamily,
    fontColor,
    deleteMode,
    activeMode,
    selectedNodes
  } = scratchData;
  const { zwibbler } = useContext(ZwibblerContext);
  const [workingHistory, setWorkingHistory] = useState(0);
  const [clipBoard, updateClipBoard] = useState();

  const undo = () => {
    if (workingHistory > 0) {
      setWorkingHistory(workingHistory - 1);
      undoScratchPad();
    }
  };

  const redo = () => {
    setWorkingHistory(workingHistory + 1);
    redoScratchPad();
  };

  const onChangeTool = value => {
    const data = {};
    // handle undo and redo action.
    if (value === drawTools.UNDO_TOOL) {
      return undo();
    }
    if (value === drawTools.REDO_TOOL) {
      return redo();
    }

    if (value === drawTools.DELETE_TOOL) {
      data.deleteMode = !deleteMode;
      data.activeMode = "";
    } else if (activeMode === value) {
      data.activeMode = "";
    } else {
      data.activeMode = value;
      data.deleteMode = false;
    }
    if (value === drawTools.DRAW_BREAKING_LINE || value === drawTools.DRAW_CURVE_LINE) {
      notification({ type: "info", messageKey: "pleaseDoubleClickToStopDrawing" });
    }
    updateScratchPad(data);
  };

  const onChangeOption = (prop, value) => {
    updateScratchPad({ ...scratchData, [prop]: value });
  };

  const onClickEditingButton = mode => {
    if (zwibbler) {
      switch (mode) {
        case drawTools.MOVE_FORWARD:
          zwibbler.bringToFront();
          break;
        case drawTools.MOVE_BEHIND:
          zwibbler.sendToBack();
          break;
        case drawTools.COPY:
          updateClipBoard(zwibbler.copy(true));
          break;

        case drawTools.CUT:
          updateClipBoard(zwibbler.cut(true));
          break;
        case drawTools.PASTE:
          zwibbler.paste(clipBoard);
          break;
        default:
          break;
      }
    }
  };

  return (
    <ToolBoxContainer alignItems="stretch" flexDirection="column">
      <MainToolBox onChangeTool={onChangeTool} deleteMode={deleteMode} activeMode={activeMode} zwibbler={zwibbler} />
      <SubToolBox
        zwibbler={zwibbler}
        activeMode={activeMode}
        fillColor={fillColor}
        lineWidth={lineWidth}
        lineColor={lineColor}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontColor={fontColor}
        selectedNodes={selectedNodes}
        onChangeOption={onChangeOption}
        onClickEditBtn={onClickEditingButton}
      />
    </ToolBoxContainer>
  );
};

Tools.propTypes = {
  scratchData: PropTypes.object.isRequired
};

export default connect(
  state => ({
    scratchData: state.scratchpad
  }),
  {
    updateScratchPad: updateScratchpadAction,
    undoScratchPad: ActionCreators.undo,
    redoScratchPad: ActionCreators.redo
  }
)(Tools);
